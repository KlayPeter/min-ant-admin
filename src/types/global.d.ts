declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_BASE_URL: string;
    REACT_APP_DEV_API_URL: string;
    REACT_APP_PROD_API_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}

// eslint-disable-next-line no-var
declare var process: {
  env: NodeJS.ProcessEnv;
};

declare namespace API {
  interface Response<T = any> {
    data: T;
    success: boolean;
    message: string;
  }
}
