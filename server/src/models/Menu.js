import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', default: null },
  name: { type: String, required: true },
  path: String,
  component: String,
  icon: String,
  type: { type: Number, required: true }, // 1:目录 2:菜单 3:按钮
  sortOrder: { type: Number, default: 0 },
  visible: { type: Number, default: 1 },
  status: { type: Number, default: 1 }
}, {
  timestamps: true
});

export default mongoose.model('Menu', menuSchema);
