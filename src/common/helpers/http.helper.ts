import { SuccessResponse, ErrorResponse } from '../model/dto/response.dto';

export class CustomApiResponse {
  /**
   * Creates a standardized success response.
   * @param data The payload to be sent.
   * @param message A descriptive message for the response.
   * @param statusCode The HTTP status code. Defaults to 200.
   * @returns A SuccessResponse object.
   */
  public static success<T>(data: T, message: string = 'Operation successful', statusCode: number = 200): SuccessResponse<T> {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  /**
   * Creates a standardized error response.
   * @param message A descriptive, user-friendly error message.
   * @param statusCode The HTTP status code.
   * @param errorCode A specific, machine-readable error code.
   * @param details Additional details about the error (e.g., validation failures).
   * @returns An ErrorResponse object.
   */
  public static error(message: string, statusCode: number, errorCode: string = 'INTERNAL_SERVER_ERROR', details?: any): ErrorResponse {
    return {
      success: false,
      statusCode,
      message,
      error: {
        code: errorCode,
        details,
      },
    };
  }
}
