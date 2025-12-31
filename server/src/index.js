import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.js';
import roleRoutes from './routes/role.js';
import menuRoutes from './routes/menu.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/manage/sys/user', userRoutes);
app.use('/manage/sys/role', roleRoutes);
app.use('/manage/sys/menu', menuRoutes);
app.use('/manage/sys/auth', authRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// MongoDB 连接
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB 连接成功');
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB 连接失败:', err);
    process.exit(1);
  });
