import storage from '@/utils/storage';

interface GlobalState {
  token: string;
  userInfo: any;
  [key: string]: any;
}

// 简单的状态管理，不使用外部库
class SimpleStore {
  private state: { global: GlobalState };

  constructor() {
    // 安全的初始化，防止存储解析错误
    let token = '';
    let userInfo = null;
    
    try {
      token = storage.get('token') || '';
    } catch (e) {
      console.warn('获取token失败:', e);
    }
    
    try {
      userInfo = storage.get('userInfo') || null;
    } catch (e) {
      console.warn('获取userInfo失败:', e);
    }

    this.state = {
      global: {
        token,
        userInfo,
      }
    };
  }

  getGlobal(): GlobalState {
    return this.state.global;
  }

  setGlobal(data: Partial<GlobalState>) {
    this.state.global = { ...this.state.global, ...data };
    
    // 同步到localStorage
    if (data.token !== undefined) {
      storage.set('token', data.token);
    }
    if (data.userInfo !== undefined) {
      storage.set('userInfo', data.userInfo);
    }
  }

  resetGlobal() {
    storage.remove('token');
    storage.remove('userInfo');
    this.state.global = {
      token: '',
      userInfo: null,
    };
  }
}

const store = new SimpleStore();

// 兼容原有的 getData 和 resetDataSync 接口
export const getData = (_key: 'global'): GlobalState => {
  return store.getGlobal();
};

export const setData = (_key: 'global', data: Partial<GlobalState>) => {
  store.setGlobal(data);
};

export const resetDataSync = (_key: 'global') => {
  store.resetGlobal();
};

export default store;
