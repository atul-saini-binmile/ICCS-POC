import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { ROUTES } from "../../Routes/RouteConstants";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button
          className={styles.button}
          onClick={() => navigate(ROUTES.FORM_BUILDER)}
        >
          Create a form
        </button>
        <button
          className={styles.button}
          onClick={() => navigate(ROUTES.FLOW_BUILDER)}
        >
          Create a flow
        </button>
      </div>
    </div>
  );
};

export default Home;
