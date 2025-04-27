"use client"

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Layers, Tags, Plus, BarChart3, TrendingUp, Users } from "lucide-react";
import { adminFetchCategories, adminFetchProducts, adminFetchTypes } from "../../services/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const AdminDashboard = () => {
  const [counts, setCounts] = useState({
    categories: 0,
    types: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categories, types, products] = await Promise.all([
          adminFetchCategories(),
          adminFetchTypes(),
          adminFetchProducts(),
        ]);

        setCounts({
          categories: categories?.length || 0,
          types: types?.length || 0,
          products: products?.length || 0,
        });
      } catch (err) {
        setError("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-start">
            <div className="ml-3">
              <h3 className="text-red-700 font-medium">Ошибка</h3>
              <div className="text-red-600 mt-1">{error}</div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
        >
          <div className="mb-10">
            <motion.div 
              variants={fadeInUp} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <Layers className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Категории</p>
                    <p className="text-2xl font-semibold text-gray-900">{counts.categories}</p>
                  </div>
                </div>
                <Link 
                  to="/admin/categories" 
                  className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Управление категориями
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <Tags className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Типы продуктов</p>
                    <p className="text-2xl font-semibold text-gray-900">{counts.types}</p>
                  </div>
                </div>
                <Link 
                  to="/admin/types" 
                  className="mt-4 inline-block text-sm font-medium text-green-600 hover:text-green-800"
                >
                  Управление типами
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Продукты</p>
                    <p className="text-2xl font-semibold text-gray-900">{counts.products}</p>
                  </div>
                </div>
                <Link 
                  to="/admin/products" 
                  className="mt-4 inline-block text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  Управление продуктами
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Быстрые действия</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link 
                  to="/admin/categories" 
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
                >
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">Добавить категорию</span>
                </Link>
                
                <Link 
                  to="/admin/types" 
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200"
                >
                  <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">Добавить тип продукта</span>
                </Link>
                
                <Link 
                  to="/admin/products/new" 
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200"
                >
                  <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">Добавить продукт</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard; 