"use server";
// Server-side axios instance that automatically attaches the Bearer token
// from the http-only cookie. Use this for any request that must be
// authenticated (whoami, profile update, password update, etc.)
import axios from "axios";
import { getTokenCookie } from "../cookies";

const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function getAuthAxios() {
    const token = await getTokenCookie();

    return axios.create({
        baseURL: BASE_URL,
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}
