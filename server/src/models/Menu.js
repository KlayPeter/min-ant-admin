import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null },
  menuName: { type: String, required: true },
  menuCode: { type: String, required: true, unique: true },
  menuType: { type: Number, required: true }, // 1:目录 2:菜单 3:按钮
  path: String,
  component: String,
  icon: String,
  sortOrder: { type: Number, default: 0 },
  visible: { type: Number, default: 1 },
  status: { type: Number, default: 1 },
  permissionCode: String
}, {
  timestamps: true
});

export default mongoose.model('Menu', menuSchema);
