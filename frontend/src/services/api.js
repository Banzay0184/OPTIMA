// src/services/api.js
import axios from "axios";

// Базовые URL для API
const API_URL = 'http://localhost:8000/api/v1';
const ADMIN_API_URL = 'http://localhost:8000/api/v1';

// Функции для обработки ответов и ошибок
const handleResponse = (response) => {
  return response;
};

const handleError = (error) => {
  if (error.response) {
    // Ошибка от сервера с ответом
    
    // Если запрос не авторизован, попытаемся перенаправить на страницу входа
    if (error.response.status === 401 || error.response.status === 403) {
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin/login';
      }
    }
  }
  
  // Просто передаем ошибку дальше для обработки в компонентах
  throw error;
};

// Получение токена с учетом различных форматов хранения
const getToken = () => {
  // Проверяем наличие токена в разных местах хранения
  return localStorage.getItem('token') || 
         localStorage.getItem('access_token') || 
         sessionStorage.getItem('token') || 
         sessionStorage.getItem('access_token');
};

// Получение и форматирование токена для заголовка авторизации
const getAuthHeader = () => {
  const token = getToken();
  
  if (!token) return {};
  
  // Проверяем, является ли токен JWT (формат: xxxx.yyyy.zzzz)
  if (token.split('.').length === 3) {
    return { Authorization: `Bearer ${token}` };
  }
  
  // Для DRF или других форматов
  return { Authorization: `Token ${token}` };
};

// Получение админского токена
const getAdminToken = () => {
  return localStorage.getItem('adminToken') || 
         localStorage.getItem('token') || 
         localStorage.getItem('access_token');
};

// Получение и форматирование админского токена для заголовка авторизации
const getAdminAuthHeader = () => {
  const token = getAdminToken();
  
  if (!token) return {};
  
  // Проверяем, является ли токен JWT (формат: xxxx.yyyy.zzzz)
  if (token.split('.').length === 3) {
    return { Authorization: `Bearer ${token}` };
  }
  
  // Для DRF или других форматов
  return { Authorization: `Token ${token}` };
};

// Создаем экземпляр axios для обычных запросов
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Создаем экземпляр axios для запросов администратора
const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации к запросам администратора
adminApi.interceptors.request.use(
  (config) => {
    const headers = getAdminAuthHeader();
    if (headers.Authorization) {
      config.headers = {
        ...config.headers,
        ...headers
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Функции API для публичной части

// Получение всех категорий
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories/');
    return response.data.results || response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Получение всех типов продуктов
export const fetchTypes = async () => {
  try {
    const response = await api.get('/types/');
    return response.data.results || response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Получение продуктов с фильтрацией
export const fetchProducts = async (categoryId = null, typeId = null, excludeId = null) => {
  try {
    const params = {};
    
    if (categoryId && categoryId !== "all") {
      params.category = categoryId;
    }
    if (typeId) {
      params.type = typeId;
    }
    if (excludeId) {
      params.exclude = excludeId;
    }
    
    const response = await api.get('/products/', { params });
    return response.data.results || response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Получение деталей продукта по ID
export const fetchProductById = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Функции для административной части

// Авторизация администратора
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${ADMIN_API_URL}/token/`, { username, password });
    
    // Извлекаем токен из ответа сервера, обрабатывая разные форматы
    const token = response?.data?.token || 
                 response?.data?.access || 
                 response?.data?.access_token || 
                 response?.data?.key || 
                 response?.data?.auth_token || 
                 (response?.data?.auth?.token) || 
                 (response?.data?.user?.token) || 
                 (response?.data?.data?.token) || 
                 (typeof response.data === 'string' ? response.data : null);
    
    // Если токен получен, сохраняем его
    if (token) {
      localStorage.setItem("adminToken", token);
      localStorage.setItem("token", token);
      localStorage.setItem("access_token", token);
    }
    
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Получение всех категорий для админа
export const adminGetCategories = async () => {
  try {
    const response = await adminApi.get('/categories/');
    return response.data.results || response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Добавление новой категории
export const adminAddCategory = async (categoryData) => {
  try {
    const response = await adminApi.post('/categories/', categoryData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Обновление категории
export const adminUpdateCategory = async (categoryId, categoryData) => {
  try {
    const response = await adminApi.put(`/categories/${categoryId}/`, categoryData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Удаление категории
export const adminDeleteCategory = async (categoryId) => {
  try {
    const response = await adminApi.delete(`/categories/${categoryId}/`);
    return response.data || true;
  } catch (error) {
    return handleError(error);
  }
};

// Получение всех типов для админа
export const adminGetTypes = async () => {
  try {
    const response = await adminApi.get('/types/');
    return response.data.results || response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Добавление нового типа
export const adminAddType = async (typeData) => {
  try {
    // Преобразуем данные для совместимости с API сервера
    // Бэкенд может ожидать поле category_id вместо category
    const formattedData = {
      ...typeData,
      category_id: typeData.category_id || typeData.category
    };
    
    const response = await adminApi.post('/types/', formattedData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Обновление типа
export const adminUpdateType = async (typeId, typeData) => {
  try {
    // Аналогично преобразуем данные для обновления
    const formattedData = {
      ...typeData,
      category_id: typeData.category_id || typeData.category
    };
    
    const response = await adminApi.put(`/types/${typeId}/`, formattedData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Удаление типа
export const adminDeleteType = async (typeId) => {
  try {
    const response = await adminApi.delete(`/types/${typeId}/`);
    return response.data || true;
  } catch (error) {
    return handleError(error);
  }
};

// Получение всех продуктов для админа
export const adminGetProducts = async (params = {}) => {
  try {
    const response = await adminApi.get('/products/', { params });
    return response.data.results || response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Получение деталей продукта для админа
export const adminGetProduct = async (productId) => {
  try {
    const response = await adminApi.get(`/products/${productId}/`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Добавление нового продукта
export const adminAddProduct = async (productData) => {
  try {
    // Формируем FormData для возможности загрузки файлов
    let formData;
    
    if (productData instanceof FormData) {
      formData = productData;
    } else {
      formData = new FormData();
      // Добавляем все поля продукта в FormData
      Object.keys(productData).forEach(key => {
        // Обрабатываем массивы и объекты
        if (typeof productData[key] === 'object' && !(productData[key] instanceof File)) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });
    }
    
    const response = await adminApi.post('/products/', formData, {
      headers: {
        ...getAdminAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Обновление продукта
export const adminUpdateProduct = async (productId, productData) => {
  try {
    // Формируем FormData для возможности загрузки файлов
    let formData;
    
    if (productData instanceof FormData) {
      formData = productData;
    } else {
      formData = new FormData();
      // Добавляем все поля продукта в FormData
      Object.keys(productData).forEach(key => {
        // Обрабатываем массивы и объекты
        if (typeof productData[key] === 'object' && !(productData[key] instanceof File)) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });
    }
    
    const response = await adminApi.put(`/products/${productId}/`, formData, {
      headers: {
        ...getAdminAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Удаление продукта
export const adminDeleteProduct = async (productId) => {
  try {
    const response = await adminApi.delete(`/products/${productId}/`);
    return response.data || true;
  } catch (error) {
    return handleError(error);
  }
};

// Загрузка изображения продукта
export const adminUploadProductImage = async (productId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await adminApi.post(`/products/${productId}/images/`, formData, {
      headers: {
        ...getAdminAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Удаление изображения продукта
export const adminDeleteProductImage = async (imageId) => {
  try {
    const response = await adminApi.delete(`/product-images/${imageId}/`);
    return response.data || true;
  } catch (error) {
    return handleError(error);
  }
};

export default api;