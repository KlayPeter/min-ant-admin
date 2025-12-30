import { useEffect, useRef } from "react";
import type { ActionType } from "@ant-design/pro-components";

interface UseListRefreshParams {
  key: string;
  actionRef?: React.RefObject<ActionType | null>;
  cb?: () => void;
}

export const useListRefresh = ({
  key,
  actionRef,
  cb,
}: UseListRefreshParams) => {
  const cbRef = useRef<(() => void) | undefined>(cb);
  const actionRefRef = useRef(actionRef);

  // 同步最新回调（effect 阶段）
  useEffect(() => {
    cbRef.current = cb;
    actionRefRef.current = actionRef;
  }, [cb, actionRef]);

  // 只负责订阅 / 取消订阅
  useEffect(() => {
    const handleRefresh = () => {
      if (actionRefRef.current?.current) {
        actionRefRef.current.current.reload();
      } else if (cbRef.current) {
        cbRef.current();
      }
    };

    window.addEventListener(key, handleRefresh);

    return () => {
      window.removeEventListener(key, handleRefresh);
    };
  }, [key]);
};

export default useListRefresh;
