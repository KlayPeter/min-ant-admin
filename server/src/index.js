import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
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

// Swagger 文档 - 使用自动生成的文档
let swaggerDocument;
try {
  const swaggerFile = fs.readFileSync('./swagger-output.json', 'utf8');
  swaggerDocument = JSON.parse(swaggerFile);
} catch (error) {
  console.warn('⚠️  未找到 swagger-output.json，请运行 npm run swagger 生成文档');
  swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'Admin System API',
      version: '1.0.0',
      description: '请运行 npm run swagger 生成完整文档'
    }
  };
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Admin System API 文档'
}));

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
      console.log(`📚 API 文档地址: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB 连接失败:', err);
    process.exit(1);
  });
