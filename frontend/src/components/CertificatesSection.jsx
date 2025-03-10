"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

// Статические данные (можно вынести в отдельный файл или получать через API)
const certificates = [
    {
        id: 1,
        title: "ISO 9001:2015",
        description: "Система менеджмента качества",
        icon: <FileText className="h-8 w-8 text-blue-500" />,
        link: "/certificates/iso-9001-2015.pdf", // Пример ссылки
    },
    {
        id: 2,
        title: "ISO 14001:2015",
        description: "Система экологического менеджмента",
        icon: <FileText className="h-8 w-8 text-green-500" />, // Разный цвет для примера
        link: "/certificates/iso-14001-2015.pdf",
    },
    {
        id: 3,
        title: "ГОСТ Р ИСО 22000-2019",
        description: "Система менеджмента безопасности пищевой продукции",
        icon: <FileText className="h-8 w-8 text-purple-500" />, // Разный цвет для примера
        link: "/certificates/gost-22000-2019.pdf",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Плавное появление карточек
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CertificatesSection = () => {
    const handleCertificateClick = (link) => {
        // Открытие сертификата в новом окне
        window.open(link, "_blank", "noopener,noreferrer");
    };

    return (
        <section id="certificates" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">Сертификаты и стандарты</h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600">
                        Наша продукция соответствует международным стандартам качества и безопасности
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {certificates.map((certificate) => (
                        <motion.div
                            key={certificate.id}
                            variants={itemVariants}
                            className="bg-white p-6 rounded-lg shadow-md text-center"
                        >
                            <div className="flex items-center justify-center mb-4" aria-hidden="true">
                                {certificate.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">{certificate.title}</h3>
                            <p className="text-gray-600">{certificate.description}</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleCertificateClick(certificate.link)}
                                className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label={`Посмотреть сертификат ${certificate.title}`}
                            >
                                Посмотреть сертификат
                                <svg
                                    className="ml-2 w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default CertificatesSection;