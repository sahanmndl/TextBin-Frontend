import {ApiResponse, createAPI} from "./base.ts";

const documentAPI = createAPI("documents");

export interface DocumentType {
    _id: string;
    title: string;
    content: string;
    active: boolean;
    tags: string[];
    type: string;
    syntax: string;
    privacy: string;
    readCode: string;
    updateCode: string;
    expiryStatus: {
        isExpiring: boolean;
        expirationDate: Date;
    };
    passwordStatus: {
        isPasswordProtected: boolean;
        password?: string;
    };
    isEncrypted: boolean;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface SavedDocumentType extends DocumentType {
    readLink: string;
    updateLink?: string | undefined;
    decryptionKey?: string | undefined;
}

interface AddDocumentRequest {
    title: string;
    content: string;
    tags?: string[];
    type: string;
    syntax?: string;
    privacy: string;
    expiryStatus?: {
        isExpiring: boolean;
        expirationDate?: Date | null;
    };
    passwordStatus?: {
        isPasswordProtected: boolean;
        password?: string;
    };
    isEncrypted?: boolean;
}

interface UpdateDocumentRequest {
    id: string;
    title?: string;
    content?: string;
    active?: boolean;
    tags?: string[];
    type?: string;
    syntax?: string;
    privacy?: string;
    expiryStatus?: {
        isExpiring: boolean;
        expirationDate?: Date | null;
    };
    passwordStatus?: {
        isPasswordProtected: boolean;
        password?: string;
    };
    updateCode: string;
}

interface GetDocumentsRequest {
    tags?: string[];
    type?: string;
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "views";
    sortOrder?: "asc" | "desc";
}

interface DeleteDocumentRequest {
    id: string;
    readCode: string;
    updateCode: string;
}

export interface DocumentResponseType extends DocumentType {
    isReported: boolean;
}

interface EncryptedDocument {
    decryptionKey: string;
    document: DocumentType
}

interface DocumentStatus {
    privacy: string;
    isPasswordProtected: boolean;
    isEncrypted: boolean;
}

interface PaginatedDocumentsResponse {
    data: DocumentType[];
    pagination: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        pageSize: number;
        hasNext: boolean;
    };
}


export const addDocument = async (data: AddDocumentRequest) => {
    const response = await documentAPI.post<ApiResponse<DocumentType>>("", data);
    return response.data.body;
};

export const addDocumentWithEncryption = async (data: AddDocumentRequest) => {
    const response = await documentAPI.post<ApiResponse<EncryptedDocument>>("", data);
    return response.data.body;
};

export const updateDocument = async (data: UpdateDocumentRequest) => {
    const response = await documentAPI.put<ApiResponse<DocumentType>>("", data);
    return response.data.body;
};

export const getDocumentById = async (id: string) => {
    const response = await documentAPI.get<ApiResponse<DocumentType>>(`/get/${id}`);
    return response.data.body;
};

export const getDocumentPrivacyStatus = async (code: string) => {
    const response = await documentAPI.get<ApiResponse<DocumentStatus>>(`/status/${code}`);
    return response.data.body;
};

export const getDocumentByReadCode = async (code: string, password?: string, key?: string) => {
    const params: Record<string, string> = {};
    if (password) params.password = password;
    if (key) params.key = key;

    const response = await documentAPI.get<ApiResponse<DocumentResponseType>>(`/read/${code}`, {params});
    return response.data.body;
};

export const getDocumentByUpdateCode = async (code: string) => {
    const response = await documentAPI.get<ApiResponse<DocumentType>>(`/update/${code}`);
    return response.data.body;
};

export const getDocuments = async (params: GetDocumentsRequest) => {
    const response = await documentAPI.get<ApiResponse<PaginatedDocumentsResponse>>("", {params});
    return response.data.body;
};

export const deleteDocument = async (data: DeleteDocumentRequest) => {
    const response = await documentAPI.post<ApiResponse<string>>("/delete", data);
    return response.data.body;
};
