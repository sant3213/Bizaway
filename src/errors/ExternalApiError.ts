import { AppError } from "./AppError.js";

export class ExternalApiError extends AppError {
  constructor(message = "Failed to fetch from external API", statusCode = 502) {
    super(message, statusCode);
  }
}
