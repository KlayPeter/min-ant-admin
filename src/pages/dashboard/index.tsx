import storage from "@/utils/storage";
import styles from "./index.module.scss";
import { PageContent } from "@/components/base";

const Dashboard: React.FC = () => {
  const realName = storage.get("userInfo")?.realName || "";
  return (
    <PageContent>
      <div className={styles.container}>
        <h1>{realName}，欢迎您</h1>
      </div>
    </PageContent>
  );
};

export default Dashboard;
