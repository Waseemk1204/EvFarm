const connectDB = require('./lib/db');
const AdminSettings = require('./lib/models/AdminSettings');

// In-memory rate limiting (note: in serverless, this resets per cold start)
// For production, consider using Redis or a database
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        'unknown';
}

function isLockedOut(ip) {
    const attempts = loginAttempts.get(ip);
    if (!attempts) return false;
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
        return true;
    }
    if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
        loginAttempts.delete(ip);
        return false;
    }
    return false;
}

function recordFailedAttempt(ip) {
    const attempts = loginAttempts.get(ip) || { count: 0, lockedUntil: null };
    attempts.count++;
    if (attempts.count >= MAX_ATTEMPTS) {
        attempts.lockedUntil = Date.now() + LOCKOUT_DURATION;
    }
    loginAttempts.set(ip, attempts);
    return attempts;
}

function clearAttempts(ip) {
    loginAttempts.delete(ip);
}

export default async function handler(req, res) {
    await connectDB();

    const { method } = req;
    const path = req.query.path || [];
    const pathString = Array.isArray(path) ? path.join('/') : path;
    const ip = getClientIP(req);

    // POST /api/admin/login
    if (method === 'POST' && pathString === 'login') {
        const { password } = req.body;

        if (isLockedOut(ip)) {
            const attempts = loginAttempts.get(ip);
            const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
            return res.status(429).json({
                success: false,
                error: 'Too many failed attempts',
                lockedOut: true,
                remainingMinutes: remainingTime
            });
        }

        try {
            const settings = await AdminSettings.getSettings();
            if (password === settings.password) {
                clearAttempts(ip);
                return res.status(200).json({ success: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ success: false, error: 'Server error' });
        }

        const attempts = recordFailedAttempt(ip);
        const remaining = MAX_ATTEMPTS - attempts.count;

        if (attempts.lockedUntil) {
            return res.status(429).json({
                success: false,
                error: 'Too many failed attempts. Account locked for 15 minutes.',
                lockedOut: true,
                remainingMinutes: 15
            });
        }

        return res.status(401).json({
            success: false,
            error: `Invalid password. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
            attemptsRemaining: remaining
        });
    }

    // POST /api/admin/reset-password
    if (method === 'POST' && pathString === 'reset-password') {
        try {
            const { recoveryKey, newPassword } = req.body;
            const settings = await AdminSettings.getSettings();

            if (recoveryKey !== settings.recoveryKey) {
                return res.status(401).json({ success: false, error: 'Invalid recovery key' });
            }

            settings.password = newPassword;
            await settings.save();
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Password reset error:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    }

    // GET /api/admin/lockout-status
    if (method === 'GET' && pathString === 'lockout-status') {
        const attempts = loginAttempts.get(ip);
        if (!attempts || !attempts.lockedUntil) {
            return res.status(200).json({ lockedOut: false });
        }
        if (Date.now() >= attempts.lockedUntil) {
            loginAttempts.delete(ip);
            return res.status(200).json({ lockedOut: false });
        }
        const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
        return res.status(200).json({
            lockedOut: true,
            remainingMinutes: remainingTime
        });
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
