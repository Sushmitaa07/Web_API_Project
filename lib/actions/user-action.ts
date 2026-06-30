"use server";
import {
    getCurrentUser,
    updateProfile as updateProfileApi,
    updatePassword as updatePasswordApi,
} from "@/lib/api/user";
import { updateUserData } from "@/lib/cookies";

export const handleGetCurrentUser = async () => {
    try {
        const result = await getCurrentUser();
        return { success: true, message: result.message, data: result.data };
    } catch (error: Error | any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch user",
        };
    }
};

// formData should already contain text fields + optional "profileImage" file
export const handleUpdateProfile = async (formData: FormData) => {
    try {
        const result = await updateProfileApi(formData);

        // keep the user_data cookie in sync with the latest profile
        if (result?.data) {
            await updateUserData(result.data);
        }

        return { success: true, message: result.message, data: result.data };
    } catch (error: Error | any) {
        return {
            success: false,
            message: error?.message || "Profile update failed",
        };
    }
};

export const handleUpdatePassword = async (data: {
    currentPassword: string;
    newPassword: string;
}) => {
    try {
        const result = await updatePasswordApi(data);
        return { success: true, message: result.message, data: result.data };
    } catch (error: Error | any) {
        return {
            success: false,
            message: error?.message || "Password update failed",
        };
    }
};
