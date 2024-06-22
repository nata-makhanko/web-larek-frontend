import { IOrder } from "./api.type";

export type FormErrors = Partial<Record<keyof IOrder, string>>;