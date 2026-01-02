import mongoose from 'mongoose';

const adminSettingsSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    recoveryKey: { type: String, required: true }
}, { timestamps: true });

adminSettingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne({ key: 'admin' });
    if (!settings) {
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

export default mongoose.models.AdminSettings || mongoose.model('AdminSettings', adminSettingsSchema);
