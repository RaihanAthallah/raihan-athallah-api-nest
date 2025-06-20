// Interface for a standardized success response.
// It uses a generic <T> to allow for any type of data payload.
export interface SuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
}

// Interface for a standardized error response.
export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: {
    code: string; // A specific error code for programmatic handling
    details?: any; // Can be a string, array, or object with more info
  };
}
