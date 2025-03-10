"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import ProductCard from "../components/ProductCard";
import TypeSelector from "../components/TypeSelector";
import { fetchCategories, fetchTypes, fetchProducts } from "../services/api";


const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const CatalogPage = () => {
    const { categoryId, typeId } = useParams();
    const [activeCategory, setActiveCategory] = useState(categoryId || "all");
    const [activeType, setActiveType] = useState(typeId || null);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка категорий и типов при монтировании
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [categoryData, typeData] = await Promise.all([
                    fetchCategories(),
                    fetchTypes(),
                ]);

                const enrichedCategories = categoryData.map((category) => ({
                    ...category,
                    types: typeData
                        .filter((type) => type.category.id === category.id)
                        .map((type) => ({ id: type.id, name: type.type_name })),
                }));

                setCategories(enrichedCategories);
                setTypes(typeData);
            } catch (err) {
                setError(err.response?.data?.error || "Не удалось загрузить категории и типы.");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []); // Выполняется только один раз при монтировании

    // Загрузка продуктов при изменении activeCategory или activeType
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const productData = await fetchProducts(activeCategory, activeType);
                setProducts(productData);
            } catch (err) {
                setError(err.response?.data?.error || "Не удалось загрузить продукты.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [activeCategory, activeType]); // Зависит от activeCategory и activeType

    // Синхронизация с URL при изменении параметров
    useEffect(() => {
        setActiveCategory(categoryId || "all");
        setActiveType(typeId || null);
    }, [categoryId, typeId]);

    const getTitle = () => {
        if (loading) return "Загрузка...";
        if (error) return "Ошибка";
        if (activeType) {
            const category = categories.find((c) => c.id === activeCategory);
            const type = category?.types?.find((t) => t.id === parseInt(activeType));
            return type?.name || "Неизвестный тип";
        }
        const category = categories.find((c) => c.id === activeCategory);
        return category?.category_name || "Все товары";
    };

    return (
        <div>
            <section className="bg-blue-600 pt-24 py-20 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Каталог продукции</h1>
                        <p className="text-xl text-blue-100">
                            Широкий ассортимент ПЭТ-преформ, пластиковых колпачков, ручек и бутылок
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`lg:w-1/4 ${filtersOpen ? "block" : "hidden lg:block"}`}
                        >
                            <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                                <h2 className="text-xl font-semibold mb-6 text-gray-900">Категории</h2>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => {
                                                setActiveCategory("all");
                                                setActiveType(null);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategory === "all" ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                                            aria-label="Показать все товары"
                                        >
                                            Все товары
                                        </button>
                                    </li>
                                    {categories.map((category) => (
                                        <li key={category.id}>
                                            <button
                                                onClick={() => {
                                                    setActiveCategory(category.id);
                                                    setActiveType(null);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategory === category.id ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                                                aria-label={`Выбрать категорию ${category.category_name}`}
                                            >
                                                {category.category_name}
                                            </button>
                                            {activeCategory === category.id && (
                                                <TypeSelector
                                                    types={category.types}
                                                    activeType={activeType}
                                                    onSelectType={setActiveType}
                                                />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        <div className="lg:w-3/4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">{getTitle()}</h2>
                                <button
                                    onClick={() => setFiltersOpen(!filtersOpen)}
                                    className="flex items-center lg:hidden bg-gray-100 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Открыть/закрыть фильтры"
                                    aria-expanded={filtersOpen}
                                >
                                    <Filter className="h-5 w-5 mr-2" aria-hidden="true" />
                                    Фильтры
                                    {filtersOpen ? (
                                        <ChevronUp className="ml-2 h-4 w-4" aria-hidden="true" />
                                    ) : (
                                        <ChevronDown className="ml-2 h-4 w-4" aria-hidden="true" />
                                    )}
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-medium text-red-600 mb-2">Ошибка</h3>
                                    <p className="text-gray-500">{error}</p>
                                </div>
                            ) : products.length > 0 ? (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={staggerContainer}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-medium text-gray-700 mb-2">Товары не найдены</h3>
                                    <p className="text-gray-500">Проверьте наличие товаров в базе данных или фильтры.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CatalogPage;