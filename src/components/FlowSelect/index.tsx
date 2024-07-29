import { useEffect, useState } from "react";
import localforage from "localforage";
import { StorageKeys } from "../../utils/enum";
import styles from "./index.module.scss";
import { CustomButton } from "../BaseInputs";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Routes/RouteConstants";

const FlowSelect = () => {
  const [availableFlows, setAvailableFlows] = useState<any[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<any>();
  const navigate = useNavigate();

  const getFormsFromStorage = async () => {
    const flows: any[] = (await localforage.getItem(StorageKeys.FLOWS)) ?? [];
    if (flows?.length === 0) {
      navigate(ROUTES.HOMEPAGE);
    }
    setAvailableFlows(flows);
  };

  const handleFlowSelect = (item: any) => {
    setSelectedFlow(item);
  };

  useEffect(() => {
    getFormsFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProceed = async () => {
    await localforage.setItem(StorageKeys.SELECTED_FLOW, selectedFlow);
    await localforage.setItem(StorageKeys.ONGOING_FLOW, null);
    navigate(ROUTES.EXECUTE_FLOW);
  };

  return (
    <div className="container">
      <div className={styles.container}>
        <h2>Select a flow to proceed</h2>
        <div className={styles.wrapper}>
          {availableFlows?.map((item) => (
            <div
              className={`${styles.formContainer} ${
                selectedFlow?.title === item?.title ? styles.active : ""
              }`}
              key={item?.title}
              onClick={() => handleFlowSelect(item)}
            >
              <p className={styles.formTitle}>{item?.title}</p>
            </div>
          ))}
        </div>
        <div className={styles.button}>
          <CustomButton disabled={!selectedFlow} onClick={handleProceed}>
            Proceed
          </CustomButton>
        </div>{" "}
      </div>
    </div>
  );
};

export default FlowSelect;
