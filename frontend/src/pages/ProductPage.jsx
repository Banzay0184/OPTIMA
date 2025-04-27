"use client";

import React, {useState, useEffect} from "react"; // Добавлен импорт React для memo
import {motion} from "framer-motion";
import {useParams, Link} from "react-router-dom";
import {ArrowLeft, Check, Download} from "lucide-react";
import {fetchProductById, fetchProducts} from "../services/api";
import ProductCard from "../components/ProductCard";

// Варианты анимации
const fadeIn = {
    hidden: {opacity: 0},
    visible: {opacity: 1, transition: {duration: 0.6}},
};

const staggerContainer = {
    hidden: {opacity: 0},
    visible: {opacity: 1, transition: {staggerChildren: 0.3}},
};

// Функция форматирования данных продукта
const formatProductData = (productData) => ({
    id: productData.id,
    name: productData.product_name,
    category: productData.type.category.id,
    categoryName: productData.type.category.category_name,
    type: productData.type.id,
    typeName: productData.type.type_name,
    description: productData.description,
    images: productData.images.map((img) => `https://optima.fly.dev${img.image}`),
    inStock: productData.in_stock,
    articleNumber: productData.article_number,
    specifications: [
        {name: "Вес", value: productData.weight ? `${productData.weight} г` : "Нет данных"},
        {
            name: "Объем",
            value: productData.package_volume
                ? `${productData.package_volume} ${productData.package_volume < 10 ? "л" : "мл"}`
                : "Нет данных",
        },
        {
            name: "Диаметр горла",
            value: productData.throat_diameter ? `${productData.throat_diameter} мм` : "Нет данных",
        },
        {name: "Размер", value: productData.dimensions || "Нет данных"},
        {name: "Материал", value: productData.material || "Нет данных"},
        {name: "Упаковка", value: productData.package || "Нет данных"},
        {name: "Стандарт горла", value: productData.throat_standard || "Нет данных"},
        {name: "Применение", value: productData.application || "Нет данных"},
        {name: "Состав", value: productData.compound || "Нет данных"},
        {
            name: "Цвета",
            value: (
                <div className="flex flex-wrap gap-2">
                    {productData.colors && productData.colors.length > 0 ? (
                        productData.colors.map((c, index) => (
                            <span key={index} className="flex items-center">
                                <span
                                    style={{backgroundColor: c.color}}
                                    className="w-4 h-4 rounded-full inline-block mr-1 border border-gray-300"
                                    aria-label={`Цвет ${c.color}`}
                                ></span>
                            </span>
                        ))
                    ) : (
                        "Нет данных"
                    )}
                </div>
            ),
        },
    ],
    features: [
        "Высокое качество материалов",
        "Удобство использования",
        "Экологичность",
        "Подходит для массового производства",
    ],
});

const ProductPage = () => {
    const {productId} = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);

            try {
                const productData = await fetchProductById(productId);
                if (!productData) throw new Error("Продукт не найден");

                const formattedProduct = formatProductData(productData);
                setProduct(formattedProduct);

                const relatedData = await fetchProducts(null, productData.type.id, productData.id);
                setRelatedProducts(relatedData.slice(0, 4)); // Ограничиваем до 4 товаров
            } catch (err) {
                setError(err.message || "Не удалось загрузить данные о продукте.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [productId]);

    if (loading) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="pt-16 flex justify-center items-center h-screen">
                <div className="text-center">
                    <h3 className="text-xl font-medium text-red-600 mb-2">Ошибка</h3>
                    <p className="text-gray-500">{error || "Продукт не найден"}</p>
                    <Link to="/catalog" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
                        <ArrowLeft className="h-4 w-4 mr-1"/>
                        Вернуться к каталогу
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Breadcrumbs */}
            <div className="bg-blue-800 pt-24 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex" aria-label="Навигация по хлебным крошкам">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link to="/" className="text-gray-100 hover:text-black">
                                    Главная
                                </Link>
                            </li>
                            <li className="text-gray-100">/</li>
                            <li>
                                <Link to="/catalog" className="text-gray-100 hover:text-black">
                                    Каталог
                                </Link>
                            </li>
                            <li className="text-gray-100">/</li>
                            <li>
                                <Link
                                    to={`/catalog/${product.category}`}
                                    className="text-gray-100 hover:text-black"
                                >
                                    {product.categoryName}
                                </Link>
                            </li>
                            <li className="text-gray-100">/</li>
                            <li>
                                <Link
                                    to={`/catalog/${product.category}/${product.type}`}
                                    className="text-gray-100 hover:text-black"
                                >
                                    {product.typeName}
                                </Link>
                            </li>
                            <li className="text-gray-100">/</li>
                            <li className="text-gray-400 font-medium">{product.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Product Details */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Product Images */}
                        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="lg:w-1/2">
                            <div className="mb-4">
                                <img
                                    src={product.images[selectedImage]}
                                    alt={`${product.name} - Изображение ${selectedImage + 1}`}
                                    className="w-full h-[600px] object-cover rounded-lg"
                                    onError={(e) => (e.target.src = "/placeholder.svg")}
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className="focus:outline-none"
                                        aria-label={`Выбрать изображение ${index + 1} для ${product.name}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} - Превью ${index + 1}`}
                                            className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === index ? "border-blue-600" : "border-gray-200"}`}
                                            onError={(e) => (e.target.src = "/placeholder.svg")}
                                        />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Product Info */}
                        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="lg:w-1/2">
                            <Link
                                to={`/catalog/${product.category}`}
                                className="inline-flex items-center text-blue-600 mb-4 hover:text-blue-800"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1"/>
                                Назад к каталогу
                            </Link>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                            <div className="flex items-center mb-6">
                                <div
                                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                >
                                    <Check className="h-4 w-4 mr-1"/>
                                    {product.inStock ? "В наличии" : "Нет в наличии"}
                                </div>
                                {product.articleNumber && (
                                    <div className="ml-4 text-sm text-gray-500">
                                        Артикул: {product.articleNumber}
                                    </div>
                                )}
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Описание</h3>
                                <p className="text-gray-600">{product.description}</p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Характеристики</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.specifications.map((spec, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col border-b border-gray-200 py-2"
                                        >
                                            <span className="text-gray-600 font-medium">{spec.name}</span>
                                            <span className="text-gray-900 break-words">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Преимущества</h3>
                                <ul className="space-y-2">
                                    {product.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"/>
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeIn}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Похожие товары</h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {relatedProducts.length > 0 ? (
                            relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct}/>
                            ))
                        ) : (
                            <p className="text-gray-600 col-span-full text-center">
                                Похожих товаров не найдено
                            </p>
                        )}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default React.memo(ProductPage);