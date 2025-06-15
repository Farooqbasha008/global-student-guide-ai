// Error types
export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  API = 'API',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN'
}

// Error interface
export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: number;
}

// Error logger
class ErrorLogger {
  private static instance: ErrorLogger;
  private errors: AppError[] = [];

  private constructor() {
    // Initialize error logger
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private handleGlobalError(event: ErrorEvent): void {
    this.logError({
      type: ErrorType.UNKNOWN,
      message: event.message,
      details: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      },
      timestamp: Date.now()
    });
  }

  private handlePromiseError(event: PromiseRejectionEvent): void {
    this.logError({
      type: ErrorType.UNKNOWN,
      message: event.reason?.message || 'Unhandled Promise Rejection',
      details: event.reason,
      timestamp: Date.now()
    });
  }

  public logError(error: AppError): void {
    this.errors.push(error);
    console.error('Application Error:', error);

    // In production, you would send this to a logging service
    if (import.meta.env.PROD) {
      // Example: sendToLoggingService(error);
    }

    // Store in localStorage for debugging
    localStorage.setItem('last_error', JSON.stringify(error));
  }

  public getErrors(): AppError[] {
    return this.errors;
  }

  public clearErrors(): void {
    this.errors = [];
  }
}

// Error handler functions
export const handleApiError = (error: any): AppError => {
  const logger = ErrorLogger.getInstance();
  
  let appError: AppError = {
    type: ErrorType.UNKNOWN,
    message: 'An unexpected error occurred',
    timestamp: Date.now()
  };

  if (error.response) {
    // API error with response
    appError = {
      type: ErrorType.API,
      message: error.response.data?.message || 'API Error',
      details: error.response.data,
      timestamp: Date.now()
    };
  } else if (error.request) {
    // Network error
    appError = {
      type: ErrorType.NETWORK,
      message: 'Network Error',
      details: error.request,
      timestamp: Date.now()
    };
  } else {
    // Other errors
    appError = {
      type: ErrorType.UNKNOWN,
      message: error.message || 'Unknown Error',
      details: error,
      timestamp: Date.now()
    };
  }

  logger.logError(appError);
  return appError;
};

export const handleValidationError = (error: any): AppError => {
  const logger = ErrorLogger.getInstance();
  
  const appError: AppError = {
    type: ErrorType.VALIDATION,
    message: 'Validation Error',
    details: error,
    timestamp: Date.now()
  };

  logger.logError(appError);
  return appError;
};

// Export logger instance
export const errorLogger = ErrorLogger.getInstance(); 