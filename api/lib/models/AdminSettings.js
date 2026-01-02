const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    recoveryKey: { type: String, required: true }
}, { timestamps: true });

// Singleton pattern - always use key 'admin'
adminSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne({ key: 'admin' });
    if (!settings) {
        // Create default settings from env on first run
        settings = await this.create({
            key: 'admin',
            password: process.env.ADMIN_PASSWORD || 'admin123',
            recoveryKey: process.env.ADMIN_RECOVERY_KEY || 'evfarm-recovery-2024'
        });
    }
    return settings;
};

adminSettingsSchema.statics.updatePassword = async function (newPassword) {
    return this.findOneAndUpdate(
        { key: 'admin' },
        { password: newPassword },
        { new: true }
    );
};

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);
