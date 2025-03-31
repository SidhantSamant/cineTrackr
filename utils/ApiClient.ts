import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Base class for API client
class ApiClient {
    protected axiosInstance: AxiosInstance;

    constructor(baseURL: string, headers: Record<string, string>) {
        this.axiosInstance = axios.create({
            baseURL,
            headers,
        });
    }

    // Method to handle GET requests
    async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint, { params });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Method to handle POST requests
    async post<T>(endpoint: string, data: Record<string, any> = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Method to handle PUT requests
    async put<T>(endpoint: string, data: Record<string, any> = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Method to handle DELETE requests
    async delete<T>(endpoint: string, data: Record<string, any> = {}): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint, { data });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    // Generic error handler
    private handleError(error: any): void {
        console.error('API Error:', error);
        // throw new Error(error?.response?.data?.message || 'Something went wrong');
    }
}

export default ApiClient;
