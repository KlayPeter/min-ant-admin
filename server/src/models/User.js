import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  realName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarUrl: String,
  status: { type: Number, default: 1 }, // 1:启用 0:禁用
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
