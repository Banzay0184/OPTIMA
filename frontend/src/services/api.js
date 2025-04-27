// src/services/api.js
import axios from "axios";

// Определяем базовый URL в зависимости от окружения
const BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/api'  // В режиме разработки используем относительный путь для прокси
  : 'https://optima.fly.dev/api/v1'; // На продакшене используем полный путь

/**
 * Определяет формат токена и возвращает его
 * @returns {string} Токен авторизации
 */
export const getTokenFormat = () => {
  const adminToken = localStorage.getItem('adminToken');
  const token = localStorage.getItem('token');
  const accessToken = localStorage.getItem('access_token');

  if (adminToken) return `Bearer ${adminToken}`;
  if (token) return `Bearer ${token}`;
  if (accessToken) return `Bearer ${accessToken}`;
  
  return null;
};

/**
 * Получает токен администратора из localStorage
 * @returns {string|null} Токен администратора или null если токен не найден
 */
export const getAdminToken = () => {
  const adminToken = localStorage.getItem('adminToken');
  const token = localStorage.getItem('token');
  const accessToken = localStorage.getItem('access_token');

  return adminToken || token || accessToken || null;
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
    const tokenFormat = getTokenFormat();
    if (tokenFormat) {
      config.headers.Authorization = tokenFormat;
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
        // Логируем полученные данные для отладки
        console.log('API response for categories:', response.data);
        
        // Проверяем структуру ответа
        let data = [];
        
        // Если ответ содержит поле results (пагинация), используем его
        if (response.data && response.data.results && Array.isArray(response.data.results)) {
            console.log('Получены данные в формате пагинации:', response.data.results.length, 'категорий');
            data = response.data.results;
        }
        // Если ответ сам является массивом, используем его напрямую
        else if (Array.isArray(response.data)) {
            console.log('Получен массив категорий:', response.data.length, 'категорий');
            data = response.data;
        }
        
        // Если массив пустой, создаем временные тестовые данные
        if (data.length === 0) {
            console.warn('Получен пустой массив категорий, возвращаем тестовые данные');
            return [
                { id: 1, category_name: "ПЭТ-преформы" },
                { id: 2, category_name: "Колпачки" },
                { id: 3, category_name: "Бутылки" },
                { id: 4, category_name: "Контейнеры" }
            ];
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        // В случае ошибки, возвращаем тестовые данные вместо выброса исключения
        console.warn('Ошибка при получении категорий, возвращаем тестовые данные');
        return [
            { id: 1, category_name: "ПЭТ-преформы" },
            { id: 2, category_name: "Колпачки" },
            { id: 3, category_name: "Бутылки" },
            { id: 4, category_name: "Контейнеры" }
        ];
    }
};

// --- Types ---
export const fetchTypes = async () => {
  try {
    const response = await api.get('/types/');
    
    // Проверяем структуру ответа
    let types = [];
    
    // Если ответ содержит поле results (пагинация), используем его
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      console.log('Получены данные типов в формате пагинации:', response.data.results.length, 'типов');
      types = response.data.results;
    }
    // Если ответ сам является массивом, используем его напрямую
    else if (Array.isArray(response.data)) {
      console.log('Получен массив типов:', response.data.length, 'типов');
      types = response.data;
    }
    
    if (types.length === 0) {
      console.log('Данные типов не получены, возвращаем тестовые данные');
      return mockData.types;
    }
    
    return types;
  } catch (error) {
    console.error('Error fetching types:', error);
    console.log('Returning mock data due to error');
    return mockData.types;
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
export const fetchProducts = async (categoryId, typeId, excludeProductId = null) => {
  try {
    let params = {};
    if (categoryId) params.category = categoryId;
    if (typeId) params.type = typeId;
    if (excludeProductId) params.exclude = excludeProductId;
    
    const response = await api.get("/products/", { params });
    
    if (response.status === 200) {
      console.log("Продукты успешно получены:", response.data);
      return response.data;
    }
    
    throw new Error("Не удалось получить продукты");
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error);
    throw error;
  }
};

export const fetchProductsByType = async (typeId, page = 1, limit = 12) => {
  try {
    const response = await api.get(`/products/?type_id=${typeId}&page=${page}&limit=${limit}`);
    
    // Проверяем структуру ответа
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      console.log('Получены данные продуктов по типу в формате пагинации:', response.data.results.length, 'продуктов');
      return {
        products: response.data.results,
        total: response.data.count,
        totalPages: Math.ceil(response.data.count / limit)
      };
    } 
    // Если ответ сам является массивом, используем его напрямую
    else if (Array.isArray(response.data)) {
      console.log('Получен массив продуктов по типу:', response.data.length, 'продуктов');
      return {
        products: response.data,
        total: response.data.length,
        totalPages: Math.ceil(response.data.length / limit)
      };
    }
    
    console.log('Формат данных продуктов по типу не распознан, возвращаем пустой массив');
    return { products: [], total: 0, totalPages: 0 };
  } catch (error) {
    console.error(`Error fetching products by type (${typeId}):`, error);
    return { products: [], total: 0, totalPages: 0 };
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
    
    // Проверяем структуру ответа
    let data = [];
    
    // Если ответ содержит поле results (пагинация), используем его
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      console.log('Получены данные в формате пагинации:', response.data.results.length, 'категорий');
      data = response.data.results;
    }
    // Если ответ сам является массивом, используем его напрямую
    else if (Array.isArray(response.data)) {
      console.log('Получен массив категорий:', response.data.length, 'категорий');
      data = response.data;
    }
    
    return data;
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
    
    // Проверяем структуру ответа
    let data = [];
    
    // Если ответ содержит поле results (пагинация), используем его
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      console.log('Получены данные типов (админ) в формате пагинации:', response.data.results.length, 'типов');
      data = response.data.results;
    }
    // Если ответ сам является массивом, используем его напрямую
    else if (Array.isArray(response.data)) {
      console.log('Получен массив типов (админ):', response.data.length, 'типов');
      data = response.data;
    }
    
    return data;
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
    const response = await adminApi.get("/products/", { params });
    
    if (response.status === 200) {
      console.log("Продукты успешно получены администратором:", response.data);
      
      // Проверяем структуру ответа и возвращаем массив продуктов
      if (response.data && response.data.results && Array.isArray(response.data.results)) {
        return response.data.results;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Если нет ни results, ни массива, возвращаем пустой массив
      return [];
    }
    
    throw new Error("Не удалось получить продукты");
  } catch (error) {
    console.error("Ошибка при получении продуктов администратором:", error);
    throw error;
  }
};

export const adminFetchProductById = async (id) => {
  try {
    const response = await adminApi.get(`/products/${id}/`);
    // Проверяем, что response.data существует
    if (!response.data) {
      throw new Error('Product data is empty');
    }
    
    // Убедимся, что colors всегда массив
    if (!Array.isArray(response.data.colors)) {
      response.data.colors = [];
    }
    
    // Убедимся, что images всегда массив
    if (!Array.isArray(response.data.images)) {
      response.data.images = [];
    }
    
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