// src/services/api.js
import axios from "axios";

// Определяем базовый URL в зависимости от окружения
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api/v1'  // В режиме разработки используем относительный путь
  : 'https://optima.fly.dev/api/v1'; // На продакшене используем полный путь

// Функция для определения нужного формата токена
const getTokenFormat = (token) => {
  if (!token) return null;
  
  // Проверяем, является ли токен JWT (формат: xxxx.yyyy.zzzz)
  if (token.split('.').length === 3) {
    try {
      // Попытка декодировать JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Проверка срока действия токена
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.warn("JWT токен просрочен");
        return null;
      }
      
      // Для JWT используется формат "Bearer token"
      return "Bearer";
    } catch (e) {
      console.warn("Ошибка при проверке JWT формата:", e);
      return null;
    }
  }
  
  // Для прочих токенов используем формат "Token token" (DRF)
  return "Token";
};

// Функция для получения токена из локального хранилища
const getAdminToken = () => {
  // Проверяем наличие токена во всех возможных местах хранения
  const token = localStorage.getItem("adminToken") || 
                localStorage.getItem("token") || 
                localStorage.getItem("access_token");
  
  if (!token) {
    console.warn("Токен не найден в локальном хранилище");
    return null;
  }
  
  // Проверяем формат и валидность токена
  const tokenFormat = getTokenFormat(token);
  
  if (!tokenFormat) {
    console.warn("Токен недействителен или просрочен");
    return null;
  }
  
  return token;
};

// Создаем клиент axios для общих запросов
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Создаем клиент axios для административных запросов
const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к каждому запросу
adminApi.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    
    if (token) {
      const tokenFormat = getTokenFormat(token);
      if (tokenFormat) {
        config.headers.Authorization = `${tokenFormat} ${token}`;
      } else {
        // Если токен невалидный, удаляем его из хранилища
        localStorage.removeItem("adminToken");
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        
        // Перенаправляем на страницу входа
        if (window.location.pathname.includes('/admin') && 
            !window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если токен просрочен или недействителен (401)
    if (error.response && error.response.status === 401) {
      console.error('Ошибка авторизации:', error.response.data);
      // Выполняем выход из системы
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      
      // Обновляем страницу для перехода на логин если мы на странице админки
      if (window.location.pathname.includes('/admin') && 
          !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API-запросы для публичной части сайта
// --- Categories ---
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// --- Types ---
export const fetchTypes = async () => {
  try {
    const response = await api.get('/types/');
    return response.data;
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
};

export const fetchTypesByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/types/?category=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching types for category ${categoryId}:`, error);
    throw error;
  }
};

// --- Products ---
export const fetchProducts = async (params = {}) => {
  try {
    const response = await api.get('/products/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductsByType = async (typeId) => {
  try {
    const response = await api.get(`/products/?type=${typeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for type ${typeId}:`, error);
    throw error;
  }
};

export const fetchProductById = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await api.get(`/products/search/?query=${query}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching products with query '${query}':`, error);
    throw error;
  }
};

// --- Admin API ---

// Авторизация
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/token/`, { username, password });
    
    // Обработка и логирование ответа
    console.log('Login response:', response.data);
    
    // Если получен токен, сохраняем его
    const token = response?.data?.token || 
                  response?.data?.access || 
                  response?.data?.access_token;
                  
    if (token) {
      localStorage.setItem("adminToken", token);
      // Для обратной совместимости также сохраняем в старых форматах
      localStorage.setItem("token", token);
      localStorage.setItem("access_token", token);
      
      // Проверяем формат токена
      const tokenFormat = getTokenFormat(token);
      if (!tokenFormat) {
        console.warn("Получен недействительный токен от сервера");
      }
    } else {
      console.error("Токен не получен в ответе от сервера");
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// --- Categories ---
export const adminFetchCategories = async () => {
  try {
    const response = await adminApi.get('/categories/');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories (admin):', error);
    throw error;
  }
};

export const adminAddCategory = async (category) => {
  try {
    const response = await adminApi.post('/categories/', category);
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const adminUpdateCategory = async (id, category) => {
  try {
    const response = await adminApi.put(`/categories/${id}/`, category);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

export const adminDeleteCategory = async (id) => {
  try {
    await adminApi.delete(`/categories/${id}/`);
    return true;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};

// --- Types ---
export const adminFetchTypes = async () => {
  try {
    const response = await adminApi.get('/types/');
    return response.data;
  } catch (error) {
    console.error('Error fetching types (admin):', error);
    throw error;
  }
};

export const adminAddType = async (type) => {
  try {
    const response = await adminApi.post('/types/', type);
    return response.data;
  } catch (error) {
    console.error('Error adding type:', error);
    throw error;
  }
};

export const adminUpdateType = async (id, type) => {
  try {
    const response = await adminApi.put(`/types/${id}/`, type);
    return response.data;
  } catch (error) {
    console.error(`Error updating type ${id}:`, error);
    throw error;
  }
};

export const adminDeleteType = async (id) => {
  try {
    await adminApi.delete(`/types/${id}/`);
    return true;
  } catch (error) {
    console.error(`Error deleting type ${id}:`, error);
    throw error;
  }
};

// --- Products ---
export const adminFetchProducts = async (params = {}) => {
  try {
    const response = await adminApi.get('/products/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products (admin):', error);
    throw error;
  }
};

export const adminFetchProductById = async (id) => {
  try {
    const response = await adminApi.get(`/products/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id} (admin):`, error);
    throw error;
  }
};

export const adminAddProduct = async (product) => {
  try {
    // Для продукта используем FormData, т.к. могут быть файлы
    const formData = new FormData();
    
    // Добавляем все поля продукта в formData
    Object.keys(product).forEach(key => {
      // Если поле - массив, но не является файлом
      if (Array.isArray(product[key]) && key !== 'images') {
        // Преобразуем массив в JSON строку
        formData.append(key, JSON.stringify(product[key]));
      } 
      // Для обычных полей
      else if (product[key] !== undefined && product[key] !== null && key !== 'images') {
        formData.append(key, product[key]);
      }
    });
    
    const response = await adminApi.post('/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const adminUpdateProduct = async (id, product) => {
  try {
    // Для продукта используем FormData, т.к. могут быть файлы
    const formData = new FormData();
    
    // Добавляем все поля продукта в formData
    Object.keys(product).forEach(key => {
      // Если поле - массив, но не является файлом
      if (Array.isArray(product[key]) && key !== 'images') {
        // Преобразуем массив в JSON строку
        formData.append(key, JSON.stringify(product[key]));
      } 
      // Для обычных полей
      else if (product[key] !== undefined && product[key] !== null && key !== 'images') {
        formData.append(key, product[key]);
      }
    });
    
    const response = await adminApi.patch(`/products/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

export const adminDeleteProduct = async (id) => {
  try {
    await adminApi.delete(`/products/${id}/`);
    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// Загрузка изображений для продукта
export const adminUploadProductImage = async (productId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await adminApi.post(`/products/${productId}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error uploading image for product ${productId}:`, error);
    throw error;
  }
};

// Удаление изображения продукта
export const adminDeleteProductImage = async (productId, imageId) => {
  try {
    await adminApi.delete(`/products/${productId}/images/${imageId}/`);
    return true;
  } catch (error) {
    console.error(`Error deleting image ${imageId} for product ${productId}:`, error);
    throw error;
  }
};

export default api;