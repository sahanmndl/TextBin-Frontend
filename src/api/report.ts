import {ApiResponse, createAPI} from "@/api/base.ts";

const reportAPI = createAPI("reports");

export interface ReportType {
    documentId: string;
    reason?: string;
    ipAddress?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface CreateReportRequest {
    readCode: string;
    reason?: string;
}

export const createReport = async (data: CreateReportRequest) => {
    const response = await reportAPI.post<ApiResponse<ReportType>>("", data);
    return response.data.body;
};