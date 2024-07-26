import { useState } from "react";
import { FormType, StorageKeys } from "../../utils/enum";
import {
  CheckboxFormInput,
  DropdownFormInput,
  EmailFormInput,
  MobileFormInput,
  MultiLineFormInput,
  NameFormInput,
  NumberFormInput,
  SingleLineFormInput,
} from "../FormInputs";
import styles from "./index.module.scss";
import { IFormBuildItem, IFormBuildStorageItem } from "../../utils/interface";
import { CustomButton, TextInput } from "../BaseInputs";
import localforage from "localforage";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Routes/RouteConstants";
import CustomModal from "../CustomModal";

const formInputTypes = [
  {
    type: FormType.NAME,
    label: "Name",
  },
  {
    type: FormType.EMAIL,
    label: "Email",
  },
  {
    type: FormType.MOBILE,
    label: "Mobile",
  },
  {
    type: FormType.SINGLE_LINE_TEXT,
    label: "Single Line Text",
  },
  {
    type: FormType.NUMBER,
    label: "Number",
  },
  {
    type: FormType.MULTI_LINE_TEXT,
    label: "Multi Line Text",
  },
  { type: FormType.CHECKBOX, label: "Checkbox" },
  {
    type: FormType.DROPDOWN,
    label: "Dropdown",
  },
];

const getSelectedForm = (
  type: string,
  handleFormBuild: (type: string, properties: any) => void
) => {
  switch (type) {
    case FormType.NAME:
      return <NameFormInput handleFormBuild={handleFormBuild} />;
    case FormType.EMAIL:
      return <EmailFormInput handleFormBuild={handleFormBuild} />;
    case FormType.MOBILE:
      return <MobileFormInput handleFormBuild={handleFormBuild} />;
    case FormType.NUMBER:
      return <NumberFormInput handleFormBuild={handleFormBuild} />;
    case FormType.SINGLE_LINE_TEXT:
      return <SingleLineFormInput handleFormBuild={handleFormBuild} />;
    case FormType.MULTI_LINE_TEXT:
      return <MultiLineFormInput handleFormBuild={handleFormBuild} />;
    case FormType.DROPDOWN:
      return <DropdownFormInput handleFormBuild={handleFormBuild} />;
    case FormType.CHECKBOX:
      return <CheckboxFormInput handleFormBuild={handleFormBuild} />;
    default:
      return <p>Select an Form Input</p>;
  }
};

const getFormFieldName = (type: string) => {
  switch (type) {
    case FormType.NAME:
      return FormType.NAME_VAL;
    case FormType.EMAIL:
      return FormType.EMAIL_VAL;
    case FormType.MOBILE:
      return FormType.MOBILE_VAL;
    case FormType.NUMBER:
      return FormType.NUMBER_VAL;
    case FormType.SINGLE_LINE_TEXT:
      return FormType.SINGLE_LINE_TEXT_VAL;
    case FormType.MULTI_LINE_TEXT:
      return FormType.MULTI_LINE_TEXT_VAL;
    case FormType.DROPDOWN:
      return FormType.DROPDOWN_VAL;
    case FormType.CHECKBOX:
      return FormType.CHECKBOX_VAL;
    default:
      return <p>Select an Form Input</p>;
  }
};

const Form = () => {
  const [selectedInputType, setSelectedInputType] = useState<string>("");
  // const [selectedFormId, setSelectedFormItemId] = useState<number>();
  const [formBuild, setFormBuild] = useState<IFormBuildItem[]>([]);
  const [show, setShow] = useState<boolean>(false);
  const [formTitle, setFormTitle] = useState<string>("");
  const navigate = useNavigate();

  const handleFormBuild = (type: string, properties: any) => {
    setFormBuild([...formBuild, { id: formBuild?.length, type, properties }]);
  };

  const editSelectedFormField = (item: IFormBuildItem) => {
    console.log(item);
  };

  const handleFormSave = async () => {
    const value: IFormBuildStorageItem[] =
      (await localforage.getItem(StorageKeys.FORMS)) ?? [];
    const alreadyPresent = value?.find((i) => i?.title === formTitle);
    if (alreadyPresent) {
      window.alert("The form title is already in use");
      return false;
    }
    value.push({ title: formTitle, formFields: formBuild });
    await localforage.setItem(StorageKeys.FORMS, value);
    return true;
  };

  const handleCreateFlowSave = async () => {
    const saved = await handleFormSave();
    saved && navigate(ROUTES.FLOW_BUILDER);
  };

  return (
    <div className="container">
      <div className={`${styles.container}`}>
        <div className={styles.formType}>
          {formInputTypes?.map((item) => (
            <div
              key={item?.type}
              className={styles.formInputType}
              onClick={() => setSelectedInputType(item?.type)}
            >
              {item?.label}
            </div>
          ))}
        </div>
        <div className={styles.canvas}>
          <div className={styles.formCanvas}>
            {formBuild?.map((item) => (
              <div
                className={styles.formFieldWrapper}
                key={item?.id}
                onClick={() => editSelectedFormField(item)}
              >
                <p className={styles.formField}>
                  {getFormFieldName(item?.type)}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.button}>
            <CustomButton
              onClick={() => setShow(true)}
              disabled={formBuild?.length === 0}
            >
              Save
            </CustomButton>
          </div>
        </div>
        <div className={styles.formValues}>
          {getSelectedForm(selectedInputType, handleFormBuild)}
        </div>
      </div>
      <CustomModal show={show} onHide={() => setShow(false)} title="Form Title">
        <div className={styles.modalContainer}>
          <TextInput
            placeholder="Enter Form Title"
            onChange={(val) => setFormTitle(val)}
            prevValue={formTitle}
          />
          <div className={styles.modalButton}>
            <CustomButton onClick={handleFormSave} disabled={!formTitle}>
              Save
            </CustomButton>
            <CustomButton onClick={handleCreateFlowSave} disabled={!formTitle}>
              Save & Create Flow
            </CustomButton>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default Form;
