import { TaskStatus } from "./enum";

export const countryCodes = [
  {
    countryName: "United States",
    countryCode: "US",
    countryMobileExtension: "+1",
    lengthOfMobileNumber: 10,
  },
  {
    countryName: "Canada",
    countryCode: "CA",
    countryMobileExtension: "+1",
    lengthOfMobileNumber: 10,
  },
  {
    countryName: "United Kingdom",
    countryCode: "UK",
    countryMobileExtension: "+44",
    lengthOfMobileNumber: 10,
  },
  {
    countryName: "Australia",
    countryCode: "AU",
    countryMobileExtension: "+61",
    lengthOfMobileNumber: 9,
  },
  {
    countryName: "India",
    countryCode: "IN",
    countryMobileExtension: "+91",
    lengthOfMobileNumber: 10,
  },
  {
    countryName: "Germany",
    countryCode: "GN",
    countryMobileExtension: "+49",
    lengthOfMobileNumber: 10,
  },
  {
    countryName: "France",
    countryCode: "FR",
    countryMobileExtension: "+33",
    lengthOfMobileNumber: 9,
  },
  {
    countryName: "China",
    countryCode: "CH",
    countryMobileExtension: "+86",
    lengthOfMobileNumber: 11,
  },
  {
    countryName: "Japan",
    countryCode: "JP",
    countryMobileExtension: "+81",
    lengthOfMobileNumber: 10,
  },
  {
    countryName: "Brazil",
    countryCode: "BR",
    countryMobileExtension: "+55",
    lengthOfMobileNumber: 11,
  },
];

export const departmentOptions = [
  { id: 1, value: "hr", label: "HR" },
  { id: 2, value: "finance", label: "Finance" },
  { id: 3, value: "admin", label: "Admin" },
  { id: 4, value: "training", label: "Training" },
  { id: 5, value: "operations", label: "Operations" },
  { id: 6, value: "mis", label: "MIS" },
  { id: 7, value: "work-force-management", label: "Work force management" },
];

export const taskStatusOptions = [
  { id: 1, value: TaskStatus.COMPLETED, label: TaskStatus.COMPLETED_VAL },
  { id: 2, value: TaskStatus.IN_PROGRESS, label: TaskStatus.IN_PROGRESS_VAL },
  { id: 3, value: TaskStatus.REJECTED, label: TaskStatus.REJECTED_VAL },
  { id: 4, value: TaskStatus.STALE, label: TaskStatus.STALE_VAL },
];

export const assigneeOptions = [
  { id: 1, value: "hr", label: "HR" },
  { id: 2, value: "finance", label: "Finance" },
  { id: 3, value: "admin", label: "Admin" },
  { id: 4, value: "training", label: "Training" },
  { id: 5, value: "operations", label: "Operations" },
  { id: 6, value: "mis", label: "MIS" },
  { id: 7, value: "work-force-management", label: "Work force management" },
];

export const logicOptions = [
  {
    id: 1,
    value: "parrallel",
    label: "Parrallel",
  },
];

export const logicColOptions = [
  {
    id: 1,
    value: "1",
    label: "1",
  },
  {
    id: 2,
    value: "2",
    label: "2",
  },
  {
    id: 3,
    value: "3",
    label: "3",
  },
  {
    id: 4,
    value: "4",
    label: "4",
  },
];

export const dummyTasks = [
  {
    id: 1,
    taskName: "Task A",
    description: "Do This",
    timeline: "24",
    department: "HR",
    assignee: "",
    status: "",
    approval: true,
  },
  {
    id: 1,
    taskName: "Task B",
    description: "Do This",
    timeline: "24",
    department: "HR",
    assignee: "",
    status: "",
    approval: true,
  },
  {
    id: 1,
    taskName: "Task C",
    description: "Do This",
    timeline: "24",
    department: "HR",
    assignee: "",
    status: "",
    approval: true,
  },
  {
    id: 1,
    taskName: "Task D",
    description: "Do This",
    timeline: "24",
    department: "HR",
    assignee: "",
    status: "",
    approval: true,
  },
];

export const nullTask = { isTask: false, parent: null };

export const dummyFlow = [
  [{ id: 1, taskName: "Task A", parent: null }],
  [
    {
      id: 2,
      taskName: "Task B",
      parent: [1],
    },
    {
      id: 3,
      taskName: "Task C",
      parent: [1],
    },
    {
      id: 4,
      taskName: "Task D",
      parent: [1],
    },
  ],
  [
    {
      id: 5,
      taskName: "Task E",
      parent: [2],
    },
  ],
];
