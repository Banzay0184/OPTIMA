"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

// Статические данные (можно вынести в отдельный файл или получать через API)
const features = [
    {
        id: 1,
        title: "Высокое качество",
        description:
            "Наша продукция изготавливается из высококачественных материалов с соблюдением всех технологических норм",
        icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
    },
    {
        id: 2,
        title: "Экологичность",
        description: "Мы используем экологически чистые материалы и технологии производства",
        icon: <CheckCircle className="h-8 w-8 text-green-500" />, // Разный цвет для примера
    },
    {
        id: 3,
        title: "Индивидуальный подход",
        description: "Возможность изготовления продукции по индивидуальным требованиям заказчика",
        icon: <CheckCircle className="h-8 w-8 text-purple-500" />, // Разный цвет для примера
    },
    {
        id: 4,
        title: "Соответствие стандартам",
        description: "Вся продукция соответствует международным стандартам качества и безопасности",
        icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
    },
];

// Варианты анимации
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Плавное появление элементов
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ProductFeatures = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">Преимущества нашей продукции</h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600">
                        Мы гарантируем высокое качество и надежность всей нашей продукции
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            variants={itemVariants}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-center mb-4" aria-hidden="true">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-center text-gray-900">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 text-center">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ProductFeatures;