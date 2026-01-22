import api from "./api";
import { Contact } from "@/types/types";

export const contactService = {
    getAll: async () => {
        const response = await api.get<{ contacts: Contact[] }>("/");
        return response.data.contacts;
    },

    isLoggedIn: async () => {
        const response = await api.get<{ authenticated: boolean }>("/is-logged-in");
        return response.data.authenticated;
    },

    logout: async () => {
        const response = await api.post<{ success: boolean; message: string }>("/logout");
        return response.data;
    },

    create: async (data: Partial<Contact>) => {
        const response = await api.post<{ contacts: Contact[] }>("/create", data);
        return response.data.contacts;
    },

    update: async (id: string, data: Partial<Contact>) => {
        const response = await api.put<{ contacts: Contact[] }>(`/edit/${id}`, data);
        return response.data.contacts;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ contacts: Contact[] }>(`/delete/${id}`);
        return response.data.contacts;
    },

    search: async (name: string) => {
        if (!name) return null;
        const response = await api.get<{ success: boolean; ids: string[] }>(`/search/${name}`);
        return response.data.ids;
    },
};
