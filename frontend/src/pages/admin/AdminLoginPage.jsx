"use client"

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import { adminLogin } from "../../services/api";
import axios from "axios";
import { toast } from "react-toastify";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Функция для проверки JWT токена
const validateJWT = (token) => {
  try {
    // Проверяем, что token является строкой
    if (typeof token !== 'string') {
      return { valid: false, error: "Токен должен быть строкой" };
    }
    
    // Проверяем формат JWT (xxxx.yyyy.zzzz)
    if (!token || token.split('.').length !== 3) {
      return { valid: false, error: "Неверный формат JWT токена" };
    }
    
    // Декодируем payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Проверяем срок действия
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return { valid: false, error: "JWT токен истек" };
    }
    
    return { valid: true, payload };
  } catch (e) {
    console.error("Ошибка при проверке JWT:", e);
    return { valid: false, error: "Ошибка при проверке JWT: " + e.message };
  }
};

// Функция для определения правильного формата токена
const getTokenFormat = (token) => {
  // Проверяем, что token является строкой
  if (typeof token !== 'string') {
    console.warn("Токен должен быть строкой");
    return "Token"; // Возвращаем значение по умолчанию
  }
  
  // Проверяем, является ли токен JWT (формат: xxxx.yyyy.zzzz)
  if (token && token.split('.').length === 3) {
    try {
      // Попытка декодировать JWT
      JSON.parse(atob(token.split('.')[1]));
      // Для JWT используется формат "Bearer token"
      return "Bearer";
    } catch (e) {
      // Ошибка при проверке JWT токена
      console.warn("Ошибка при проверке JWT формата:", e);
    }
  }
  
  // Для прочих токенов используем формат "Token token" (DRF)
  return "Token";
};

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  // Проверяем, если пользователь уже залогинен
  useEffect(() => {
    const checkAuth = () => {
      // Проверяем наличие токена во всех возможных местах хранения
      const token = localStorage.getItem("adminToken") || 
                   localStorage.getItem("token") || 
                   localStorage.getItem("access_token");
      
      console.log("AdminLoginPage: Проверка авторизации, токен существует:", !!token);
      
      if (token) {
        // Проверяем JWT
        if (typeof token === 'string' && token.split('.').length === 3) {
          const { valid, error } = validateJWT(token);
          if (valid) {
            // Токен действителен, перенаправляем на панель администратора
            const redirectPath = localStorage.getItem('adminRedirectPath') || '/admin';
            console.log("AdminLoginPage: Перенаправление на", redirectPath);
            navigate(redirectPath);
            localStorage.removeItem('adminRedirectPath');
            return;
          } else {
            console.warn("Ошибка валидации JWT:", error);
            // Токен недействителен - удаляем все возможные токены
            localStorage.removeItem("adminToken");
            localStorage.removeItem("token");
            localStorage.removeItem("access_token");
            return;
          }
        }
        
        // Если не JWT формат, просто проверяем наличие
        if (token) {
          const redirectPath = localStorage.getItem('adminRedirectPath') || '/admin';
          console.log("AdminLoginPage: Перенаправление на", redirectPath);
          navigate(redirectPath);
          localStorage.removeItem('adminRedirectPath');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Пожалуйста, введите имя пользователя и пароль");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await adminLogin(username, password);
      
      // Извлекаем токен из ответа сервера, обрабатывая разные форматы ответа
      const token = response?.token || 
                   response?.access_token || 
                   response?.access || 
                   response?.key || 
                   response?.auth_token || 
                   (response?.auth?.token) || 
                   (response?.user?.token);
      
      if (token) {
        // Безопасно выводим токен (только начало)
        const tokenPreview = typeof token === 'string' && token.length > 10 ? 
                           token.substring(0, 10) + "..." : 
                           "Token received";
        console.log("Токен получен:", tokenPreview);
        
        // Сохраняем токен во всех возможных местах хранения для совместимости
        localStorage.setItem("adminToken", token);
        localStorage.setItem("token", token);
        localStorage.setItem("access_token", token);
        
        // Проверяем работоспособность токена
        try {
          // Определяем формат токена
          const tokenFormat = getTokenFormat(token);
          
          // Выполняем тестовый запрос к API с новым токеном
          
          // Создаем тестовый экземпляр axios с токеном
          const testAxios = axios.create({
            baseURL: "https://optima.fly.dev/api/v1/",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${tokenFormat} ${token}`
            }
          });
          
          // Пробуем получить категории с новым токеном
          await testAxios.get("/categories/");
          
          // Если запрос прошел успешно, показываем уведомление и перенаправляем
          toast.success("Вход выполнен успешно!");
          
          // Перенаправляем на предыдущий путь или на панель администратора
          const redirectPath = localStorage.getItem('adminRedirectPath') || '/admin';
          console.log("Перенаправление после входа на:", redirectPath);
          navigate(redirectPath);
          localStorage.removeItem('adminRedirectPath');
        } catch (testError) {
          // Детализируем ошибку для пользователя
          if (testError.response?.status === 401) {
            setError("Токен авторизации не принят сервером. Проверьте настройки API.");
          } else if (testError.response?.status === 403) {
            setError("У вас недостаточно прав для доступа. Обратитесь к администратору.");
          } else if (testError.response?.status >= 500) {
            setError("Ошибка сервера при проверке токена. Попробуйте позже.");
          } else {
            setError("Авторизация успешна, но токен не работает с API. Обратитесь к администратору.");
          }
        }
      } else {
        setError("Не удалось получить токен доступа из ответа сервера. Проверьте консоль для деталей.");
      }
    } catch (err) {
      // Проверка деталей ошибки для более точного сообщения
      let errorMessage = "Ошибка авторизации. Проверьте имя пользователя и пароль.";
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          errorMessage = "Неверное имя пользователя или пароль.";
        } else if (err.response.status === 400) {
          const responseData = err.response.data;
          if (responseData.username) {
            errorMessage = `Ошибка в имени пользователя: ${responseData.username}`;
          } else if (responseData.password) {
            errorMessage = `Ошибка в пароле: ${responseData.password}`;
          } else if (responseData.non_field_errors) {
            errorMessage = responseData.non_field_errors[0];
          } else {
            errorMessage = "Неверный формат данных.";
          }
        } else if (err.response.status >= 500) {
          errorMessage = "Ошибка сервера. Пожалуйста, попробуйте позже.";
        }
        
        // Используем детали ошибки, если они есть
        if (err.response.data) {
          if (err.response.data.detail) {
            errorMessage = err.response.data.detail;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          } else if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          }
        }
      } else if (err.request) {
        // Запрос был сделан, но ответ не получен
        errorMessage = "Нет ответа от сервера. Проверьте сетевое соединение.";
      } else {
        // Произошла ошибка при настройке запроса
        errorMessage = `Ошибка при отправке запроса: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="bg-blue-600 py-6">
          <h2 className="text-center text-xl text-white font-bold">OPTIMA - Панель администратора</h2>
        </div>
        
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Вход в систему</h1>
          
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-300 text-red-700 rounded">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <User size={18} />
                Имя пользователя
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите имя пользователя"
              />
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Lock size={18} />
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите пароль"
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 ${
                loading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage; 