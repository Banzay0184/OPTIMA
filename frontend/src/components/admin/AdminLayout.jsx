"use client"

import React, { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  PanelLeft, 
  Package, 
  Layers, 
  Tags, 
  ShoppingBag, 
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

// Функция для определения правильного формата токена и проверки его валидности
const validateToken = (token) => {
  if (!token) return false;
  
  // Проверяем, является ли токен JWT (формат: xxxx.yyyy.zzzz)
  if (token.split('.').length === 3) {
    try {
      // Декодируем JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Проверяем срок действия токена
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        return false;
      }
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Для не-JWT токенов просто проверяем наличие
  return true;
};

// Получение токена из различных возможных мест хранения
const getAdminToken = () => {
  // Пробуем получить токен из разных мест в localStorage
  const tokenKeys = ["adminToken", "token", "access_token"];
  
  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);
    if (token && validateToken(token)) {
      return token;
    }
  }
  
  return null;
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // При монтировании компонента проверяем наличие токена
  useEffect(() => {
    const token = getAdminToken();
    
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Функция для выхода из панели администратора
  const handleLogout = () => {
    // Удаляем все возможные токены
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    navigate("/admin/login");
  };

  // Если не авторизован, ничего не рендерим (перенаправление произойдет в useEffect)
  if (!getAdminToken()) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Мобильный сайдбар */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed z-50 bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white shadow-lg"
          aria-label={sidebarOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Десктопный сайдбар */}
      <motion.aside
        initial={{ x: sidebarOpen ? 0 : "-100%" }}
        animate={{ x: sidebarOpen ? 0 : (window.innerWidth >= 1024 ? 0 : "-100%") }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-5 border-b">
            <Link to="/admin" className="flex items-center space-x-2">
              <PanelLeft className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-semibold text-gray-900">Админ панель</span>
            </Link>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <Link
              to="/admin"
              className={`flex items-center px-4 py-3 rounded-md ${
                location.pathname === "/admin"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <Package className="mr-3 h-5 w-5" />
              <span>Панель управления</span>
            </Link>

            <Link
              to="/admin/categories"
              className={`flex items-center px-4 py-3 rounded-md ${
                location.pathname === "/admin/categories"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <Layers className="mr-3 h-5 w-5" />
              <span>Категории</span>
            </Link>

            <Link
              to="/admin/types"
              className={`flex items-center px-4 py-3 rounded-md ${
                location.pathname === "/admin/types"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <Tags className="mr-3 h-5 w-5" />
              <span>Типы продуктов</span>
            </Link>

            <Link
              to="/admin/products"
              className={`flex items-center px-4 py-3 rounded-md ${
                location.pathname.includes("/admin/products")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
            >
              <ShoppingBag className="mr-3 h-5 w-5" />
              <span>Продукты</span>
            </Link>
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Основной контент */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm z-10">
          <div className="py-6 px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {location.pathname === "/admin" && "Панель управления"}
              {location.pathname === "/admin/categories" && "Управление категориями"}
              {location.pathname === "/admin/types" && "Управление типами продуктов"}
              {location.pathname === "/admin/products" && "Управление продуктами"}
              {location.pathname === "/admin/products/new" && "Добавление нового продукта"}
              {location.pathname.includes("/admin/products/edit/") && "Редактирование продукта"}
            </h1>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 