import storage from "@/utils/storage";
import styles from "./index.module.scss";
import { PageContent } from "@/components/base";

const Dashboard: React.FC = () => {
  const userInfo = storage.get("userInfo");
  const displayName = userInfo?.nickname || "用户";

  return (
    <PageContent>
      <div className={styles.container}>
        <h1>{displayName}，欢迎您</h1>
      </div>
    </PageContent>
  );
};

export default Dashboard;
