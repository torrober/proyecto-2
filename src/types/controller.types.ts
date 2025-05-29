export interface ControllerResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}
