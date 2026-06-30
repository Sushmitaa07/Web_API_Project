"use server";
import { API } from "./endpoints";
import { getAuthAxios } from "./server-axios";

export type AdminUserListParams = {
    page?: number;
    limit?: number;
    search?: string;
};

export const getUsers = async (params: AdminUserListParams) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.get(API.ADMIN.USERS, {
            params,
        });
        return response.data; // { status, success, message, data, meta }
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch users"
        );
    }
};

export const getUserById = async (id: string) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.get(API.ADMIN.USER_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch user"
        );
    }
};

export const createUser = async (data: {
    fullName: string;
    email: string;
    contactNumber?: string;
    password: string;
    gender?: string;
    role?: string;
}) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.post(API.ADMIN.USERS, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to create user"
        );
    }
};

export const updateUser = async (
    id: string,
    data: Partial<{
        fullName: string;
        email: string;
        contactNumber?: string;
        password?: string;
        gender?: string;
        role?: string;
    }>
) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.put(API.ADMIN.USER_BY_ID(id), data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to update user"
        );
    }
};

export const deleteUser = async (id: string) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.delete(API.ADMIN.USER_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to delete user"
        );
    }
};
