import React from "react";
import { Layout, Watermark } from "antd";
import cls from "classnames";
import styles from "./index.module.scss";
const { Content } = Layout;

interface PageContentProps {
  className?: string;
  title?: string | React.ReactNode;
  back?: boolean; // 返回上一页
  leftArea?: React.ReactNode | null;
  rightArea?: React.ReactNode | null;
  subArea?: React.ReactNode | null;
  children?: React.ReactNode | null;
}
const Component: React.FC<PageContentProps> = ({
  className,
  children,
}: PageContentProps) => {
  return (
    <Content className={cls(styles.pageContent, className)}>
      <Watermark
        zIndex={99999}
        font={{ color: "rgba(0, 0, 0, 0.07)" }}
        content={"密码"}
        offset={[80, 80]}
      >
        <div className={cls("page-content", styles.contentBox)}>{children}</div>
      </Watermark>
    </Content>
  );
};

Component.displayName = "PageContent";

export default Component;
