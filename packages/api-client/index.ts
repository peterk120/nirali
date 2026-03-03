interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

class ApiClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || '/api') {
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return {
        data,
        message: 'Success',
        success: true,
      };
    } catch (error: any) {
      return {
        data: null as unknown as T,
        message: error.message || 'Something went wrong',
        success: false,
      };
    }
  }

  async post<T, U = any>(endpoint: string, body: U): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return {
        data,
        message: 'Success',
        success: true,
      };
    } catch (error: any) {
      return {
        data: null as unknown as T,
        message: error.message || 'Something went wrong',
        success: false,
      };
    }
  }

  async put<T, U = any>(endpoint: string, body: U): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return {
        data,
        message: 'Success',
        success: true,
      };
    } catch (error: any) {
      return {
        data: null as unknown as T,
        message: error.message || 'Something went wrong',
        success: false,
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return {
        data,
        message: 'Success',
        success: true,
      };
    } catch (error: any) {
      return {
        data: null as unknown as T,
        message: error.message || 'Something went wrong',
        success: false,
      };
    }
  }
}

export default ApiClient;