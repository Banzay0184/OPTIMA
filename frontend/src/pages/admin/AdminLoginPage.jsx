"use client"

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User, AlertCircle } from "lucide-react";
import { adminLogin } from "../../services/api";
import axios from "axios";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Функция для определения правильного формата токена
const getTokenFormat = (token) => {
  // Проверяем, является ли токен JWT (формат: xxxx.yyyy.zzzz)
  if (token.split('.').length === 3) {
    try {
      // Попытка декодировать JWT
      JSON.parse(atob(token.split('.')[1]));
      // Для JWT используется формат "Bearer token"
      return "Bearer";
    } catch (e) {
      // Ошибка при проверке JWT токена
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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Пожалуйста, введите имя пользователя и пароль");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      // Очищаем старые токены перед входом
      localStorage.removeItem("adminToken");
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      
      const response = await adminLogin(username, password);
      
      // Проверка ответа от сервера
      const token = response?.token || 
                   response?.access || 
                   response?.access_token || 
                   response?.key || 
                   response?.auth_token || 
                   (response?.auth?.token) || 
                   (response?.user?.token) || 
                   (response?.data?.token) || 
                   (typeof response === 'string' ? response : null);
      
      if (token) {
        // Сохраняем токен во всех возможных форматах для максимальной совместимости
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
            baseURL: "http://127.0.0.1:8000/api/v1/",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${tokenFormat} ${token}`
            }
          });
          
          // Пробуем получить категории с новым токеном
          const testResponse = await testAxios.get("/categories/");
          
          // Если запрос прошел успешно, перенаправляем пользователя
          navigate("/admin");
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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start"
            >
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Имя пользователя
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <User className="h-5 w-5" />
                </span>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Введите имя пользователя"
                  autoComplete="username"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-3 px-4 pl-10 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Вход...
                </span>
              ) : "Войти"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage; 