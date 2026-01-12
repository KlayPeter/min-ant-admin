import { useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Result, Typography, Space } from 'antd';
import styles from './index.module.scss';
import type { ResultStatusType } from 'antd/es/result';
import { CloseCircleOutlined, HomeOutlined, RollbackOutlined } from '@ant-design/icons';
import { EVENT_KEY } from '@/constants';


const Error = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    // const event$ = useEvent();

    const status = searchParams.get('status') || '404';
    const message = decodeURIComponent(searchParams.get('message') || '');
    const filename = decodeURIComponent(searchParams.get('filename') || '');

    const subTitle = useMemo(() => tuple[status], [status]);

    // 导航并关闭当前tab的通用函数
    const navigateAndClose = useCallback((targetPath: string | number) => {
        // const currentPath = location.pathname + location.search;
        navigate(targetPath as any);

        // // 延迟关闭，确保新tab已添加
        // setTimeout(() => {
        //   event$.emit({ key: EVENT_KEY.CLOSE_TAB, pathname: currentPath });
        // }, 50);
    }, [navigate, location.pathname, location.search]);

    const goHome = useCallback(() => {
        // Error页面在Layout内，说明已登录，直接跳转首页
        navigateAndClose('/');
    }, [navigateAndClose]);

    const goBack = useCallback(() => {
        navigateAndClose(-1);
    }, [navigateAndClose]);

    return (
        <div className={styles.container}>
            <Result
                status={status as ResultStatusType}
                title={status}
                subTitle={subTitle}
                extra={
                    <Space size="middle">
                        <Button icon={<RollbackOutlined />} onClick={goBack}>
                            返回上一页
                        </Button>
                        <Button type="primary" icon={<HomeOutlined />} onClick={goHome}>
                            返回首页
                        </Button>
                    </Space>
                }
            >
                {status === 'error' && (
                    <Typography.Paragraph>
                        <CloseCircleOutlined className={styles.icon} /> {message}
                        <br />
                        <a target="_blank" href={filename}>
                            {filename} &gt;
                        </a>
                    </Typography.Paragraph>
                )}
            </Result>
        </div>
    );
};

export default Error;

const tuple: Record<string, string> = {
    403: '抱歉，你没有此页面的访问权限',
    404: '抱歉，你访问的页面不存在',
    error: '抱歉，程序出错了',
};
