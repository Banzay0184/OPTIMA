"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import React from "react";

// Базовые стили для повторяющихся элементов
const infoTextStyles = "text-sm text-gray-600";

// Варианты анимации
const cardVariants = {
    hover: { y: -5, transition: { duration: 0.3 } },
};

const imageVariants = {
    hover: { scale: 1.1, transition: { duration: 0.5 } },
};

const ProductCard = ({ product }) => {
    // Проверка на наличие продукта
    if (!product || !product.id) {
        return (
            <div className="bg-white rounded-lg overflow-hidden shadow-md p-6 text-center">
                <p className="text-gray-500">Данные о продукте отсутствуют</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-white rounded-lg overflow-hidden shadow-md h-full flex flex-col"
        >
            <Link
                to={`/product/${product.id}`}
                className="flex flex-col h-full"
                aria-label={`Перейти к продукту ${product.product_name}`}
            >
                <div className="relative overflow-hidden">
                    <motion.img
                        variants={imageVariants}
                        src={
                            product.images && product.images.length > 0
                                ? `https://optima.fly.dev${product.images[0].image}`
                                : "/placeholder.svg"
                        }
                        alt={product.product_name}
                        className="w-full h-64 object-cover"
                        onError={(e) => (e.target.src = "/placeholder.svg")}
                    />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{product.product_name}</h3>

                    <div className="space-y-1 mb-4 flex-grow">
                        {product.weight && (
                            <p className={infoTextStyles}>Вес: {product.weight} г</p>
                        )}
                        {product.package_volume && (
                            <p className={infoTextStyles}>
                                Объем: {product.package_volume}{" "}
                                {product.package_volume < 10 ? "л" : "мл"}
                            </p>
                        )}
                        {product.throat_diameter && (
                            <p className={infoTextStyles}>Диаметр: {product.throat_diameter} мм</p>
                        )}
                        {product.dimensions && (
                            <p className={infoTextStyles}>Размер: {product.dimensions}</p>
                        )}
                        {product.colors && product.colors.length > 0 && (
                            <p className={`${infoTextStyles} flex items-center gap-1`}>
                                Цвет:{" "}
                                {product.colors.map((color, index) => (
                                    <span
                                        key={index}
                                        style={{ backgroundColor: color.color }}
                                        className="w-4 h-4 rounded-full inline-block mr-1"
                                        aria-label={`Цвет ${color.color}`}
                                    />
                                ))}
                            </p>
                        )}
                        <p className={infoTextStyles}>
                            Наличие: {product.in_stock ? "В наличии" : "Нет в наличии"}
                        </p>
                        {product.article_number && (
                            <p className={infoTextStyles}>Артикул: {product.article_number}</p>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default React.memo(ProductCard);