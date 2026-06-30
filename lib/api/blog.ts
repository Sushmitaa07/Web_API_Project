"use server";
import { API } from "./endpoints";
import { getAuthAxios } from "./server-axios";

export type GetBlogsParams = {
    page?: number;
    size?: number;
    search?: string;
};

// 1. Get All with Pagination
export const getBlogs = async (params: GetBlogsParams) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.get(API.ADMIN_BLOGS.LIST, {
            params,
        });
        return response.data; // { status, success, message, data, meta }
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch blogs"
        );
    }
};

// 2. Get One
export const getBlogById = async (id: string) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.get(API.ADMIN_BLOGS.DETAIL(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch blog"
        );
    }
};

// 3. Create (data: FormData, supports text fields + thumbnail file)
export const createBlog = async (data: FormData) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.post(API.ADMIN_BLOGS.CREATE, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to create blog"
        );
    }
};

// 4. Edit / Update
export const updateBlog = async (id: string, data: FormData) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.patch(
            API.ADMIN_BLOGS.UPDATE(id),
            data,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to update blog"
        );
    }
};

// Delete
export const deleteBlog = async (id: string) => {
    try {
        const axiosInstance = await getAuthAxios();
        const response = await axiosInstance.delete(API.ADMIN_BLOGS.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to delete blog"
        );
    }
};
