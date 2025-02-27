export type ErrorType = {
  error: unknown;
};
export const isErrorType = (value: unknown): value is ErrorType => {
  return typeof value === 'object' && value !== null && 'error' in value;
};
