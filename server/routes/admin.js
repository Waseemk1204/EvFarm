const express = require('express');
const router = express.Router();
const AdminSettings = require('../models/AdminSettings');

// In-memory rate limiting store
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIP(req) {
    return req.ip || req.connection.remoteAddress || 'unknown';
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

// Login endpoint with rate limiting
router.post('/login', async (req, res) => {
    const { password } = req.body;
    const ip = getClientIP(req);

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
            return res.json({ success: true });
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
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { recoveryKey, newPassword } = req.body;

        // Get settings from MongoDB (creates default if missing)
        const settings = await AdminSettings.getSettings();

        // Verify recovery key against database
        if (recoveryKey !== settings.recoveryKey) {
            return res.status(401).json({ success: false, error: 'Invalid recovery key' });
        }

        // Update password
        settings.password = newPassword;
        await settings.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check lockout status
router.get('/lockout-status', (req, res) => {
    const ip = getClientIP(req);
    const attempts = loginAttempts.get(ip);

    if (!attempts || !attempts.lockedUntil) {
        return res.json({ lockedOut: false });
    }

    if (Date.now() >= attempts.lockedUntil) {
        loginAttempts.delete(ip);
        return res.json({ lockedOut: false });
    }

    const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
    return res.json({
        lockedOut: true,
        remainingMinutes: remainingTime
    });
});

module.exports = router;
