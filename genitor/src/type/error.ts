export interface ErrorDetail {
  label: string,
  params?: Record<string, any>,
};

export type ErrorData = Record<string, ErrorDetail[]>;