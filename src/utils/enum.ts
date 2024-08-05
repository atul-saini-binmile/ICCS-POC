export enum TextInputType {
  TEXT = "text",
  EMAIL = "email",
  SINGLE_LINE = "single-line",
  MULTI_LINE = "multi-line",
  ALPHA_NUMERIC = "alpha-numeric",
}

export enum FormType {
  NAME = "name",
  EMAIL = "email",
  MOBILE = "mobile",
  SINGLE_LINE_TEXT = "singleLineText",
  NUMBER = "number",
  MULTI_LINE_TEXT = "multiLineText",
  CHECKBOX = "checkbox",
  DROPDOWN = "dropdown",
  NAME_VAL = "Name Input",
  EMAIL_VAL = "Email Input",
  MOBILE_VAL = "Mobile Input",
  SINGLE_LINE_TEXT_VAL = "Single Line Text Input",
  NUMBER_VAL = "Number Input",
  MULTI_LINE_TEXT_VAL = "Multi Line Text Input",
  CHECKBOX_VAL = "Checkbox Input",
  DROPDOWN_VAL = "Dropdown Input",
}

export enum StorageKeys {
  FORMS = "forms",
  SELECTED_FORM = "selectedForm",
  TASKS = "tasks",
  FLOWS = "flow",
  SELECTED_FLOW = "selectedFlow",
  ONGOING_FLOW = "ongoingFlow",
}

export enum FlowFieldType {
  TASK = "Task",
  LOGIC = "Logic",
  END = "End",
}

export enum TaskStatus {
  DONE = "done",
  PENDING = "pending",
  DONE_VAL = "Done",
  PENDING_VAL = "Pending",
  IN_PROGRESS = "in-progress",
  IN_PROGRESS_VAL = "In Progress",
}

export enum BackgroundVariant {
  Dots = "dots",
  Cross = "Cross",
  Lines = "lines",
}
