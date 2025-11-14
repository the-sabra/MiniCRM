/**
 * Creates an API response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {*} [data=null] - Optional response data
 */

export class ApiResponse {
  status: 'success' | 'fail';
  message: string;
  statusCode: number;
  data?: unknown;
  meta?: unknown;

  constructor(statusCode: number, message: string, data: any = null) {
    this.status = statusCode < 400 ? 'success' : 'fail';
    this.message = message;
    this.statusCode = statusCode;
    if (data) this.data = data.data ? data.data : data;
    if (data && data.meta) this.meta = data.meta;
  }

  /**
   * Creates a success response
   * @param {number} [statusCode=200] - HTTP success status code
   * @param {*} data - Response data
   * @param {string} [message='Success'] - Success message
   * @returns {ApiResponse} Success response instance
   */
  static success(statusCode: number = 200, data?: any, message: string = 'Success'): ApiResponse {
    return new ApiResponse(statusCode, message, data);
  }

  /**
   * Creates an error response
   * @param {number} statusCode - HTTP error status code
   * @param {string} message - Error message
   * @returns {ApiResponse} Error response instance
   */
  static error(statusCode: number, message: string,data? : Record<string, unknown>): ApiResponse {
    return new ApiResponse(statusCode, message, data);
  }
}
