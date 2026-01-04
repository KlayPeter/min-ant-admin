import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nickname: { type: String },
  status: { type: Number, default: 1 }, // 1:启用 0:禁用
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }] // 用户额外菜单权限
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
