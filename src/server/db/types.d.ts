import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { Status } from "./enums";

export type Todo = {
  id: Generated<number>;
  title: string;
  description: string | null;
  status: Generated<Status>;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
  userId: string;
};
export type DB = {
  Todo: Todo;
};
