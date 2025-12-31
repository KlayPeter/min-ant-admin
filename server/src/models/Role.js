import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true, unique: true },
  roleCode: { type: String, required: true, unique: true },
  description: String,
  status: { type: Number, default: 1 },
  sortOrder: { type: Number, default: 0 },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }]
}, {
  timestamps: true
});

export default mongoose.model('Role', roleSchema);
