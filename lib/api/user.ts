"use server";
import { API } from "./endpoints";
import { getAuthAxios } from "./server-axios";

export const getCurrentUser = async () => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.get(API.AUTH.WHOAMI);
        return response.data; // { status, success, message, data }
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch user"
        );
    }
};

// data: FormData (supports text fields + profileImage file)
export const updateProfile = async (data: FormData) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.patch(API.AUTH.UPDATE, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Profile update failed"
        );
    }
};

export const updatePassword = async (data: {
    currentPassword: string;
    newPassword: string;
}) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.patch(
            API.AUTH.UPDATE_PASSWORD,
            data
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Password update failed"
        );
    }
};
