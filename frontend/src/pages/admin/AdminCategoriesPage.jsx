"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, AlertTriangle } from "lucide-react";
import {
  adminFetchCategories,
  adminAddCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "../../services/api";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Загрузка категорий
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminFetchCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке категорий");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Добавление новой категории
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setLoading(true);
      // Проверяем наличие токена перед отправкой запроса
      const token = localStorage.getItem("adminToken") || 
                   localStorage.getItem("token") || 
                   localStorage.getItem("access_token");
                   
      if (!token) {
        setError("Отсутствует токен авторизации. Выполните вход заново.");
        setLoading(false);
        return;
      }
      
      // Выводим отладочную информацию
      console.log("Отправка запроса на добавление категории:", { category_name: newCategoryName });
      
      const response = await adminAddCategory({ category_name: newCategoryName });
      console.log("Ответ сервера при добавлении категории:", response);
      
      setNewCategoryName("");
      setIsAdding(false);
      await fetchCategories(); // Перезагружаем категории
      setError(null);
    } catch (err) {
      console.error("Ошибка при добавлении категории:", err);
      
      // Получаем понятное сообщение об ошибке для пользователя
      if (err.response) {
        if (err.response.status === 401) {
          setError("Ошибка авторизации. Пожалуйста, выполните вход заново.");
        } else if (err.response.status === 400 && err.response.data) {
          if (err.response.data.category_name) {
            setError(`Ошибка: ${err.response.data.category_name[0]}`);
          } else {
            setError("Некорректные данные категории. Проверьте название.");
          }
        } else if (err.message.includes("Категория с таким названием уже существует")) {
          setError(`Категория "${newCategoryName}" уже существует. Пожалуйста, используйте другое название.`);
        } else {
          setError(`Ошибка при добавлении категории: ${err.message}`);
        }
      } else {
        setError(`Ошибка при добавлении категории: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Начало редактирования категории
  const startEditing = (category) => {
    setEditingId(category.id);
    setEditingName(category.category_name);
  };

  // Отмена редактирования
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  // Сохранение изменений категории
  const saveCategory = async (id) => {
    if (!editingName.trim()) return;

    try {
      setLoading(true);
      await adminUpdateCategory(id, { category_name: editingName });
      setEditingId(null);
      await fetchCategories(); // Перезагружаем категории
    } catch (err) {
      // Получаем понятное сообщение об ошибке для пользователя
      if (err.message.includes("Категория с таким названием уже существует")) {
        setError(`Категория "${editingName}" уже существует. Пожалуйста, используйте другое название.`);
      } else {
        setError(`Ошибка при обновлении категории: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Удаление категории
  const handleDeleteCategory = async (id) => {
    try {
      setLoading(true);
      await adminDeleteCategory(id);
      setDeleteConfirmId(null);
      await fetchCategories(); // Перезагружаем категории
    } catch (err) {
      setError("Ошибка при удалении категории");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Категории</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={isAdding || loading}
        >
          <Plus className="h-5 w-5 mr-1" />
          <span>Добавить категорию</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading && !isAdding && !editingId && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      )}

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 rounded-lg"
        >
          <h3 className="font-medium text-blue-800 mb-2">Новая категория</h3>
          <div className="flex items-center">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Название категории"
            />
            <button
              onClick={handleAddCategory}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
              disabled={!newCategoryName.trim() || loading}
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewCategoryName("");
              }}
              className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {!Array.isArray(categories) || categories.length === 0 && !loading ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  Нет доступных категорий
                </td>
              </tr>
            ) : (
              Array.isArray(categories) && categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === category.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      category.category_name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deleteConfirmId === category.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-red-600 mr-2">Удалить?</span>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-white bg-red-600 hover:bg-red-700 p-1 rounded"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-gray-700 bg-gray-200 hover:bg-gray-300 p-1 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : editingId === category.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => saveCategory(category.id)}
                          className="text-white bg-green-600 hover:bg-green-700 p-1 rounded"
                          disabled={loading}
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-gray-700 bg-gray-200 hover:bg-gray-300 p-1 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => startEditing(category)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(category.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoriesPage; 