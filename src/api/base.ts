import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL_PROD;

export interface ApiResponse<T> {
    body: T;
    success: boolean;
}

export type API_ERROR_RESPONSE = {
    response: {
        data: {
            error: string
            success: boolean
        }
    }
}

export const createAPI = (route: string) => {
    return axios.create({
        baseURL: `${API_URL}/${route}`,
    });
}