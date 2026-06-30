//centralized path definitions for API endpoints
export const API = {
    AUTH: {
        REGISTER: "/api/v1/auth/register",
        LOGIN: "/api/v1/auth/login",
        WHOAMI: "/api/v1/auth/whoami",
        UPDATE: "/api/v1/auth/update",
        UPDATE_PASSWORD: "/api/v1/auth/update-password",
    },
    ADMIN: {
        USERS: "/api/v1/admin/users",
        USER_BY_ID: (id: string) => `/api/v1/admin/users/${id}`,
    },
    ADMIN_BLOGS: {
        LIST: "/api/v1/admin/blogs",
        DETAIL: (id: string) => `/api/v1/admin/blogs/${id}`,
        CREATE: "/api/v1/admin/blogs",
        UPDATE: (id: string) => `/api/v1/admin/blogs/${id}`,
        DELETE: (id: string) => `/api/v1/admin/blogs/${id}`,
    },
}