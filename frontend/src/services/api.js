// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1/",
    headers: {
        "Content-Type": "application/json",
    },
});

export const fetchCategories = async () => {
    try {
        const response = await api.get("/categories/");
        return response.data.results;
    } catch (error) {
        console.error("Ошибка при загрузке категорий:", error.response?.data || error.message);
        throw error; // Передаем ошибку дальше
    }
};

export const fetchTypes = async () => {
    try {
        const response = await api.get("/types/");
        return response.data.results;
    } catch (error) {
        console.error("Ошибка при загрузке типов:", error.response?.data || error.message);
        throw error; // Передаем ошибку дальше
    }
};

export const fetchProducts = async (categoryId, typeId, excludeId = null) => {
    try {
        const params = {};
        // Добавляем параметр category только если categoryId не "all" и является числом
        if (categoryId && categoryId !== "all") params.category = categoryId;
        if (typeId) params.type = typeId;
        if (excludeId) params.exclude = excludeId;

        const response = await api.get("/products/", { params });
        console.log("Полученные продукты:", response.data);
        return response.data.results || [];
    } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error.response?.data || error.message);
        throw error; // Передаем ошибку дальше
    }
};

export const fetchProductById = async (productId) => {
    try {
        const response = await api.get(`/products/${productId}/`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке продукта:", error.response?.data || error.message);
        throw error; // Передаем ошибку дальше
    }
};