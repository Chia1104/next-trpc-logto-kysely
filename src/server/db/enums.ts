export const Status = {
  COMPLETED: "COMPLETED",
  UNCOMPLETED: "UNCOMPLETED",
} as const;
export type Status = (typeof Status)[keyof typeof Status];
