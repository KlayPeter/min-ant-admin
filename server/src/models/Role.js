import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  roleCode: { type: String, required: true, unique: true },
  roleName: { type: String, required: true },
  description: String,
  status: { type: Number, default: 1 },
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }]
}, {
  timestamps: true
});

export default mongoose.model('Role', roleSchema);
