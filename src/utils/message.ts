import { message as antdMessage } from 'antd';

type MessageType = 'success' | 'error' | 'info' | 'warning' | 'loading';

interface MessageInstance {
  success: (content: string, duration?: number) => void;
  error: (content: string, duration?: number) => void;
  info: (content: string, duration?: number) => void;
  warning: (content: string, duration?: number) => void;
  loading: (content: string, duration?: number) => void;
}

let messageInstance: any = null;

// 设置 message 实例（从 App.useApp() 获取）
export const setMessageInstance = (instance: any) => {
  messageInstance = instance;
};

// 全局 message 工具
const message: MessageInstance = {
  success: (content: string, duration?: number) => {
    if (messageInstance) {
      messageInstance.success(content, duration);
    } else {
      antdMessage.success(content, duration);
    }
  },
  error: (content: string, duration?: number) => {
    if (messageInstance) {
      messageInstance.error(content, duration);
    } else {
      antdMessage.error(content, duration);
    }
  },
  info: (content: string, duration?: number) => {
    if (messageInstance) {
      messageInstance.info(content, duration);
    } else {
      antdMessage.info(content, duration);
    }
  },
  warning: (content: string, duration?: number) => {
    if (messageInstance) {
      messageInstance.warning(content, duration);
    } else {
      antdMessage.warning(content, duration);
    }
  },
  loading: (content: string, duration?: number) => {
    if (messageInstance) {
      messageInstance.loading(content, duration);
    } else {
      antdMessage.loading(content, duration);
    }
  },
};

export default message;
