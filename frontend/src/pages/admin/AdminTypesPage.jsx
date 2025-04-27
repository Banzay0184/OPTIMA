"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, X, Check, AlertTriangle } from "lucide-react";
import {
  adminGetTypes,
  adminAddType,
  adminUpdateType,
  adminDeleteType,
  adminGetCategories,
} from "../../services/api";

const AdminTypesPage = () => {
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // Состояния для новой записи
  const [newTypeName, setNewTypeName] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  
  // Состояния для редактирования
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState("");
  
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Загрузка типов и категорий
  const fetchData = async () => {
    try {
      setLoading(true);
      const [typesData, categoriesData] = await Promise.all([
        adminGetTypes(),
        adminGetCategories(),
      ]);
      setTypes(typesData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError("Ошибка при загрузке данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Добавление нового типа
  const handleAddType = async () => {
    if (!newTypeName.trim() || !newCategoryId) return;

    try {
      setLoading(true);
      await adminAddType({
        type_name: newTypeName,
        category: parseInt(newCategoryId),
      });
      setNewTypeName("");
      setNewCategoryId("");
      setIsAdding(false);
      await fetchData(); // Перезагружаем данные
    } catch (err) {
      // Получаем конкретное сообщение об ошибке для пользователя
      if (err.message) {
        setError(`Ошибка при добавлении типа: ${err.message}`);
      } else {
        setError("Ошибка при добавлении типа. Пожалуйста, проверьте введенные данные.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Начало редактирования типа
  const startEditing = (type) => {
    setEditingId(type.id);
    setEditingName(type.type_name);
    setEditingCategoryId(type.category.id.toString());
  };

  // Отмена редактирования
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
    setEditingCategoryId("");
  };

  // Сохранение изменений типа
  const saveType = async (id) => {
    if (!editingName.trim() || !editingCategoryId) return;

    try {
      setLoading(true);
      await adminUpdateType(id, {
        type_name: editingName,
        category: parseInt(editingCategoryId),
      });
      setEditingId(null);
      await fetchData(); // Перезагружаем данные
    } catch (err) {
      // Получаем конкретное сообщение об ошибке для пользователя
      if (err.message) {
        setError(`Ошибка при обновлении типа: ${err.message}`);
      } else {
        setError("Ошибка при обновлении типа. Пожалуйста, проверьте введенные данные.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Удаление типа
  const handleDeleteType = async (id) => {
    try {
      setLoading(true);
      await adminDeleteType(id);
      setDeleteConfirmId(null);
      await fetchData(); // Перезагружаем данные
    } catch (err) {
      setError("Ошибка при удалении типа");
    } finally {
      setLoading(false);
    }
  };

  // Получение имени категории по ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.category_name : "Неизвестная категория";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Типы продуктов</h2>
        <button
          onClick={() => {
            // Проверяем наличие категорий перед добавлением типа
            if (categories.length === 0) {
              setError("Сначала добавьте хотя бы одну категорию");
              return;
            }
            setIsAdding(true);
            setNewCategoryId(categories[0]?.id?.toString() || "");
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={isAdding || loading}
        >
          <Plus className="h-5 w-5 mr-1" />
          <span>Добавить тип</span>
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
          <h3 className="font-medium text-blue-800 mb-2">Новый тип продукта</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                value={newCategoryId}
                onChange={(e) => setNewCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Название типа</label>
              <input
                type="text"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Название типа"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={handleAddType}
                className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={!newTypeName.trim() || !newCategoryId || loading}
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewTypeName("");
                  setNewCategoryId("");
                }}
                className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
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
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Тип
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {types.length === 0 && !loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Нет доступных типов
                </td>
              </tr>
            ) : (
              types.map((type) => (
                <tr key={type.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {type.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === type.id ? (
                      <select
                        value={editingCategoryId}
                        onChange={(e) => setEditingCategoryId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      type.category?.category_name || "Неизвестная категория"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === type.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      type.type_name
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deleteConfirmId === type.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-red-600 mr-2">Удалить?</span>
                        <button
                          onClick={() => handleDeleteType(type.id)}
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
                    ) : editingId === type.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => saveType(type.id)}
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
                          onClick={() => startEditing(type)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(type.id)}
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

export default AdminTypesPage; 