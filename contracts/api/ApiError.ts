import { ErrorCode } from "./ErrorCode";

export type ApiError = {
  code: ErrorCode;
  message: string;
};