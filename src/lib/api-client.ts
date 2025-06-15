import { handleApiError, ErrorType } from './error-handler';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  retries?: number;
  timeout?: number;
}

interface RateLimit {
  maxRequests: number;
  timeWindow: number;
  currentRequests: number;
  resetTime: number;
}

class ApiClient {
  private static instance: ApiClient;
  private rateLimits: Map<string, RateLimit> = new Map();
  private defaultTimeout = 30000; // 30 seconds

  private constructor() {}

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getRateLimitKey(url: string): string {
    return new URL(url).hostname;
  }

  private checkRateLimit(url: string): boolean {
    const key = this.getRateLimitKey(url);
    const now = Date.now();
    let rateLimit = this.rateLimits.get(key);

    if (!rateLimit) {
      rateLimit = {
        maxRequests: 100, // Default: 100 requests
        timeWindow: 60000, // Default: 1 minute
        currentRequests: 0,
        resetTime: now + 60000
      };
      this.rateLimits.set(key, rateLimit);
    }

    // Reset if time window has passed
    if (now > rateLimit.resetTime) {
      rateLimit.currentRequests = 0;
      rateLimit.resetTime = now + rateLimit.timeWindow;
    }

    // Check if rate limit exceeded
    if (rateLimit.currentRequests >= rateLimit.maxRequests) {
      return false;
    }

    rateLimit.currentRequests++;
    return true;
  }

  private async retryRequest(
    url: string,
    options: RequestOptions,
    retries: number
  ): Promise<Response> {
    try {
      if (!this.checkRateLimit(url)) {
        throw new Error('Rate limit exceeded');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || this.defaultTimeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (retries > 0 && (error.name === 'AbortError' || error.message.includes('Network'))) {
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.retryRequest(url, options, retries - 1);
      }
      throw error;
    }
  }

  public async request<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      method = 'GET',
      headers = {},
      body,
      retries = 3,
      timeout = this.defaultTimeout
    } = options;

    try {
      const response = await this.retryRequest(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        retries,
        timeout
      }, retries);

      const data = await response.json();
      return data as T;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Convenience methods
  public async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  public async post<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'POST', body: data });
  }

  public async put<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PUT', body: data });
  }

  public async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance(); 