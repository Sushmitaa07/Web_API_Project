"use server";
import {
    getUsers,
    getUserById as getUserByIdApi,
    createUser as createUserApi,
    updateUser as updateUserApi,
    deleteUser as deleteUserApi,
    AdminUserListParams,
} from "../api/admin-user";

export const handleGetUsers = async (params: AdminUserListParams) => {
    try {
        const result = await getUsers(params);
        return {
            success: true,
            message: result.message,
            data: result.data,
            meta: result.meta,
        };
    } catch (error: Error | any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch users",
            data: [],
            meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
        };
    }
};

export const handleGetUserById = async (id: string) => {
    try {
        const result = await getUserByIdApi(id);
        return { success: true, message: result.message, data: result.data };
    } catch (error: Error | any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch user",
        };
    }
};

export const handleCreateUser = async (data: {
    fullName: string;
    email: string;
    contactNumber?: string;
    password: string;
    gender?: string;
    role?: string;
}) => {
    try {
        const result = await createUserApi(data);
        return { success: true, message: result.message, data: result.data };
    } catch (error: Error | any) {
        return {
            success: false,
            message: error?.message || "Failed to create user",
        };
    }
};

export const handleUpdateUser = async (
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
        const result = await updateUserApi(id, data);
        return { success: true, message: result.message, data: result.data };
    } catch (error: Error | any) {
        return {
            success: false,
            message: error?.message || "Failed to update user",
        };
    }
};

export const handleDeleteUser = async (id: string) => {
    try {
        const result = await deleteUserApi(id);
        return { success: true, message: result.message };
    } catch (error: Error | any) {
        return {
            success: false,
            message: error?.message || "Failed to delete user",
        };
    }
};
