import BaseError from "./BaseError";
import { HTTPStatusCodes } from "./statusCodes";

class ForbiddenError extends BaseError {
  constructor(
    name: string,
    statusCode = HTTPStatusCodes.FORBIDDEN,
    description = "Forbidden",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

export default ForbiddenError;
