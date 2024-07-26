import { useEffect, useState } from "react";
import { IFormBuildStorageItem } from "../../utils/interface";
import localforage from "localforage";
import { StorageKeys } from "../../utils/enum";
import styles from "./index.module.scss";
import { CustomButton } from "../BaseInputs";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Routes/RouteConstants";

const Flow = () => {
  const [availableForms, setAvailableForms] = useState<IFormBuildStorageItem[]>(
    []
  );
  const [selectedForm, setSelectedForm] = useState<IFormBuildStorageItem>();
  const navigate = useNavigate();

  const getFormsFromStorage = async () => {
    const forms: IFormBuildStorageItem[] =
      (await localforage.getItem(StorageKeys.FORMS)) ?? [];
    setAvailableForms(forms);
  };

  const handleFormSelect = async (item: IFormBuildStorageItem) => {
    await localforage.setItem(StorageKeys.SELECTED_FORM, item);
    setSelectedForm(item);
  };

  useEffect(() => {
    getFormsFromStorage();
  }, []);

  const handleProceed = () => {
    navigate(ROUTES.TASK_BUILDER);
  };

  return (
    <div className="container">
      <div className={styles.container}>
        <h2>Select a form to proceed</h2>
        <div className={styles.wrapper}>
          {availableForms?.map((item) => (
            <div
              className={`${styles.formContainer} ${
                selectedForm?.title === item?.title ? styles.active : ""
              }`}
              key={item?.title}
              onClick={() => handleFormSelect(item)}
            >
              <p className={styles.formTitle}>{item?.title}</p>
            </div>
          ))}
        </div>
        <div className={styles.button}>
          <CustomButton disabled={!selectedForm} onClick={handleProceed}>
            Proceed
          </CustomButton>
        </div>{" "}
      </div>
    </div>
  );
};

export default Flow;
