export interface ITextInput {
  type?: string;
  maxLen?: number | null;
  onChange?: (val: string) => void;
  placeholder?: string;
  prevValue?: string;
}

export interface INumberInput {
  maxLen?: number | null;
  minLen?: number | null;
  onChange?: (val: string | number) => void;
  placeholder?: string;
}

export interface IOption {
  value: string;
  label: string;
  id: number | string;
}

export interface IDropdownProps {
  options: IOption[];
  isMulti?: boolean;
  showFilter?: boolean;
  placeholder?: string;
  filterPlaceholder?: string;
  handleChange?: (options: IOption[]) => void;
}

export interface ISelectedOption {
  option: IOption;
  handleUnselectOption: (option: IOption) => void;
}

export interface IMultiLineInput {
  onChange?: (val: string) => void;
  placeholder?: string;
  maxRows?: number;
}

export interface ICustomButtonProps {
  type?: "button" | "submit";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export interface ICheckboxInput {
  placeholder: string;
  handleChange?: (val: boolean) => void;
}

export interface IDropdownOption {
  onDelete: () => void;
  id: number;
  handleChange?: (label: string, value: string) => void;
  prevLabel?: string;
  prevValue?: string;
}

export interface IFormBuildItem {
  id: number;
  type: string;
  properties: any;
}

export interface IFormBuildStorageItem {
  formFields: IFormBuildItem[];
  title: string;
}

export interface IFormInput {
  handleFormBuild: (type: string, properties: any) => void;
}

export interface ICustomModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  children: React.ReactNode;
}

export interface IFlowFormListItem {
  item: IFormBuildStorageItem;
}
