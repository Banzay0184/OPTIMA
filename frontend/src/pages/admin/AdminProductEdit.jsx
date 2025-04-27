"use client"

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  Trash2, 
  AlertTriangle, 
  Plus, 
  X,
  Camera
} from "lucide-react";
import {
  adminFetchProductById,
  adminUploadProductImage,
  adminAddProduct,
  adminUpdateProduct,
  adminFetchCategories,
  adminFetchTypes,
  adminDeleteProductImage,
} from "../../services/api";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewProduct = !id;

  // Состояние формы
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    article_number: "",
    weight: "",
    package_volume: "",
    throat_diameter: "",
    dimensions: "",
    compound: "",
    material: "",
    package: "",
    application: "",
    throat_standard: "",
    category: "",
    type: "",
    in_stock: true,
    colors: [],
  });

  // Вспомогательные состояния
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [images, setImages] = useState([]);
  const [tempImages, setTempImages] = useState([]); // Для временного хранения изображений нового продукта
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newColor, setNewColor] = useState("#000000");

  // Загрузка данных продукта и справочников
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загружаем справочники
        const [categoriesData, typesData] = await Promise.all([
          adminFetchCategories(),
          adminFetchTypes(),
        ]);
        
        setCategories(categoriesData);
        setTypes(typesData);
        
        // Если редактируем существующий продукт, загружаем его данные
        if (!isNewProduct) {
          const product = await adminFetchProductById(id);
          
          setFormData({
            product_name: product.product_name || "",
            description: product.description || "",
            article_number: product.article_number || "",
            weight: product.weight || "",
            package_volume: product.package_volume || "",
            throat_diameter: product.throat_diameter || "",
            dimensions: product.dimensions || "",
            compound: product.compound || "",
            material: product.material || "",
            package: product.package || "",
            application: product.application || "",
            throat_standard: product.throat_standard || "",
            category: product.category?.id || "",
            type: product.type?.id || "",
            in_stock: product.in_stock !== undefined ? product.in_stock : true,
            colors: product.colors || [],
          });
          
          setImages(product.images || []);
        } else if (categoriesData.length > 0) {
          // Для нового продукта устанавливаем первую категорию по умолчанию
          setFormData(prev => ({
            ...prev,
            category: categoriesData[0].id
          }));
        }
        
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке данных");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isNewProduct]);

  // Фильтрация типов при изменении категории
  useEffect(() => {
    if (formData.category) {
      const filtered = types.filter(
        type => parseInt(type.category.id) === parseInt(formData.category)
      );
      setFilteredTypes(filtered);
      
      // Если текущий выбранный тип не принадлежит категории, сбрасываем его
      if (formData.type && !filtered.some(t => parseInt(t.id) === parseInt(formData.type))) {
        setFormData(prev => ({
          ...prev,
          type: filtered.length > 0 ? filtered[0].id : ""
        }));
      } else if (filtered.length > 0 && !formData.type) {
        // Если тип не выбран, выбираем первый доступный
        setFormData(prev => ({
          ...prev,
          type: filtered[0].id
        }));
      }
    }
  }, [formData.category, types, formData.type]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Подготовка данных
      const productData = {
        ...formData,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        package_volume: formData.package_volume ? parseFloat(formData.package_volume) : null,
        throat_diameter: formData.throat_diameter ? parseFloat(formData.throat_diameter) : null,
        type_id: parseInt(formData.type),
      };
      
      // Не отправляем category - бэкенд принимает только type_id
      // Удаляем поля type и category, которые не нужны
      delete productData.type;
      delete productData.category;
      
      // Преобразуем colors - бэкенд ожидает только поле color без name
      if (productData.colors && Array.isArray(productData.colors)) {
        productData.colors = productData.colors.map(colorObj => ({
          color: colorObj.color
        }));
      }
      
      let response;
      
      if (isNewProduct) {
        // Создание нового продукта
        response = await adminAddProduct(productData);
        setSuccess("Продукт успешно создан");
        
        
        // Загружаем временные изображения для созданного продукта
        if (tempImages.length > 0 && response.id) {
          for (const image of tempImages) {
            try {
              const uploadResponse = await adminUploadProductImage(response.id, image.file);
            } catch (imgError) {
            }
          }
        } else {
        }
        
        // Перенаправляем на страницу со списком продуктов
        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      } else {
        // Обновление существующего продукта
        response = await adminUpdateProduct(id, productData);
        setSuccess("Продукт успешно обновлен");
        
        // Перенаправляем на страницу со списком продуктов после обновления
        setTimeout(() => {
          navigate("/admin/products");
        }, 1500);
      }
    } catch (err) {
      setError("Ошибка при сохранении продукта: " + (err.response?.data?.details?.non_field_errors || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Обработчик загрузки изображения для существующего продукта
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      
      if (isNewProduct) {
        // Для нового продукта сохраняем изображение временно
        const url = URL.createObjectURL(file);
        const tempImage = { id: Date.now(), url, file };
        setTempImages(prev => [...prev, tempImage]);
        setSuccess("Изображение добавлено и будет загружено после сохранения продукта");
      } else {
        // Для существующего продукта загружаем изображение сразу
        
        const response = await adminUploadProductImage(id, file);
        setImages(prev => [...prev, response]);
        
        setSuccess("Изображение успешно загружено");
      }
    } catch (err) {
      setError("Ошибка при загрузке изображения: " + (err.response?.data?.details?.non_field_errors || err.message));
    } finally {
      setUploadingImage(false);
      // Очищаем input
      e.target.value = "";
    }
  };

  // Обработчик удаления изображения
  const handleDeleteImage = async (imageId, isTemp = false) => {
    try {
      if (isTemp) {
        // Удаляем временное изображение из состояния
        setTempImages(prev => prev.filter(img => img.id !== imageId));
        setSuccess("Изображение удалено");
      } else {
        // Удаляем изображение с сервера
        await adminDeleteProductImage(imageId);
        setImages(prev => prev.filter(img => img.id !== imageId));
        setSuccess("Изображение удалено");
      }
    } catch (err) {
      setError("Ошибка при удалении изображения");
    }
  };

  // Добавление нового цвета
  const handleAddColor = () => {
    if (!newColor) return;
    
    const newColorObj = {
      color: newColor
    };
    
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, newColorObj]
    }));
    
    // Сброс полей цвета
    setNewColor("#000000");
  };

  // Удаление цвета
  const handleDeleteColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  // Верхняя часть формы (общая информация о продукте)
  const renderGeneralForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Основная информация</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="product_name" className="block text-sm font-medium text-gray-700 mb-1">
            Название продукта *
          </label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="article_number" className="block text-sm font-medium text-gray-700 mb-1">
            Артикул
          </label>
          <input
            type="text"
            id="article_number"
            name="article_number"
            value={formData.article_number}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Категория *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите категорию</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Тип продукта *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={filteredTypes.length === 0}
          >
            {filteredTypes.length === 0 ? (
              <option value="">Нет доступных типов для выбранной категории</option>
            ) : (
              filteredTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))
            )}
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>
    </div>
  );

  // Технические характеристики продукта
  const renderTechSpecs = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Технические характеристики</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="throat_standard" className="block text-sm font-medium text-gray-700 mb-1">
            Стандарт горла
          </label>
          <input
            type="text"
            id="throat_standard"
            name="throat_standard"
            value={formData.throat_standard}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="throat_diameter" className="block text-sm font-medium text-gray-700 mb-1">
            Диаметр горлышка (мм)
          </label>
          <input
            type="number"
            id="throat_diameter"
            name="throat_diameter"
            value={formData.throat_diameter}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Вес (г)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="package_volume" className="block text-sm font-medium text-gray-700 mb-1">
            Объем упаковки (мл/л)
          </label>
          <input
            type="number"
            id="package_volume"
            name="package_volume"
            value={formData.package_volume}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">
            Размеры
          </label>
          <input
            type="text"
            id="dimensions"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="Например: 10х20х30 см"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="compound" className="block text-sm font-medium text-gray-700 mb-1">
            Состав
          </label>
          <input
            type="text"
            id="compound"
            name="compound"
            value={formData.compound}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">
            Материал
          </label>
          <input
            type="text"
            id="material"
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="package" className="block text-sm font-medium text-gray-700 mb-1">
            Упаковка
          </label>
          <input
            type="text"
            id="package"
            name="package"
            value={formData.package}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="application" className="block text-sm font-medium text-gray-700 mb-1">
            Применение
          </label>
          <input
            type="text"
            id="application"
            name="application"
            value={formData.application}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="in_stock"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="in_stock" className="ml-2 text-sm font-medium text-gray-700">
              В наличии
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Управление цветами
  const renderColorsSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Цвета</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {formData.colors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {formData.colors.map((colorItem, index) => (
              <div key={index} className="flex items-center p-3 border rounded-md bg-gray-50">
                <div 
                  className="w-8 h-8 rounded mr-3" 
                  style={{ backgroundColor: colorItem.color }}
                  aria-label={`Цвет: ${colorItem.color}`}
                ></div>
                <span className="flex-grow text-gray-700">{colorItem.color}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteColor(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                  aria-label={`Удалить цвет ${colorItem.color}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-1">
            <label htmlFor="newColor" className="block text-sm font-medium text-gray-700 mb-1">
              Цвет
            </label>
            <input
              type="color"
              id="newColor"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-full h-10 p-0 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <button
              type="button"
              onClick={handleAddColor}
              className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              disabled={!newColor}
            >
              <Plus className="h-5 w-5 mr-1" />
              <span>Добавить цвет</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Секция загрузки изображений (теперь и для новых продуктов)
  const renderImagesSection = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Изображения</h3>
        
        <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isNewProduct ? (
              // Отображаем временные изображения для нового продукта
              tempImages.map(image => (
                <div key={image.id} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden rounded-md">
                    <img
                      src={image.url}
                      alt="Фото продукта (временное)"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id, true)}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 text-red-600 hover:text-red-800 p-1 rounded-full shadow-sm hover:bg-opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              // Отображаем существующие изображения для редактируемого продукта
              images.map(image => (
                <div key={image.id} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-100 overflow-hidden rounded-md">
                    <img
                      src={`https://optima.fly.dev${image.image}`}
                      alt="Фото продукта"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIzIiB5PSIzIiB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHJ4PSIyIiByeT0iMiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ij48L2NpcmNsZT48cG9seWxpbmUgcG9pbnRzPSIyMSAxNSAxNiAxMCA1IDIxIj48L3BvbHlsaW5lPjwvc3ZnPg==";
                        e.target.className = "object-contain w-full h-full p-2 text-gray-400";
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 text-red-600 hover:text-red-800 p-1 rounded-full shadow-sm hover:bg-opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
            
            <div className="aspect-w-1 aspect-h-1 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-700">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                  disabled={uploadingImage}
                />
                {uploadingImage ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                ) : (
                  <>
                    <Camera className="h-8 w-8 mb-2" />
                    <span className="text-xs text-center">{isNewProduct ? "Добавить временное фото" : "Добавить фото"}</span>
                    {isNewProduct && (
                      <span className="text-xs text-center mt-1 text-gray-500">Будет загружено после сохранения</span>
                    )}
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
        
        {isNewProduct && tempImages.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
            <p>Изображения будут загружены после создания продукта. Вы можете добавить до 10 изображений.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span>Назад к списку</span>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900">
          {isNewProduct ? "Новый продукт" : "Редактирование продукта"}
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <div className="flex">
            <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{success}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {renderGeneralForm()}
          {renderTechSpecs()}
          {renderColorsSection()}
          {renderImagesSection()}
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  <span>Сохранение...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  <span>Сохранить</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminProductEdit; 