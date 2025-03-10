"use client";

import React from "react"; // Добавлен для memo
import {motion} from "framer-motion";
import {CheckCircle, Award, Factory, Users, TrendingUp, FileText} from "lucide-react";
import aboutbg from "../assets/aboutbg.jpg";
import aboutimg from "../assets/aboutimg.jpg";
import aboutimg2 from "../assets/aboutimg2.jpg";

// Повторяющиеся стили для контейнера
const containerStyles = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

// Варианты анимаций
const fadeInUp = {
    hidden: {opacity: 0, y: 60},
    visible: {opacity: 1, y: 0, transition: {duration: 0.6}},
};

const staggerContainer = {
    hidden: {opacity: 0},
    visible: {opacity: 1, transition: {staggerChildren: 0.2}},
};

const AboutPage = () => {
    return (
        <div className="">
            {/* Hero Section */}
            <section className="relative min-h-[600px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <img
                        src={aboutbg}
                        alt="О компании OPTIMA PET"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className={`relative z-10 ${containerStyles} text-white`}>
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 pt-16">О компании OPTIMA PET</h1>
                        <p className="text-xl md:text-2xl max-w-3xl">
                            Мы специализируемся на производстве высококачественных ПЭТ-преформ, пластиковых колпачков и
                            бутылок
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Company Overview */}
            <section className="py-20">
                <div className={containerStyles}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={fadeInUp}
                        >
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">Наша история</h2>
                            <div className="w-20 h-1 bg-blue-600 mb-6"></div>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Компания OPTIMA PET была основана в 2005 году группой профессионалов с многолетним
                                    опытом работы в индустрии производства пластиковой упаковки. С самого начала нашей
                                    целью было создание высококачественной продукции, отвечающей самым строгим
                                    требованиям рынка.
                                </p>
                                <p>
                                    За годы работы мы значительно расширили производственные мощности, внедрили
                                    современные технологии и оборудование, что позволило нам стать одним из лидеров на
                                    рынке ПЭТ-преформ и пластиковых колпачков в России.
                                </p>
                                <p>
                                    Сегодня OPTIMA PET — это современное предприятие с полным циклом производства,
                                    оснащенное высокотехнологичным оборудованием от ведущих мировых производителей.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={fadeInUp}
                            className="relative"
                        >
                            <img
                                src="/placeholder.svg?height=600&width=800" // Заменить на реальное изображение
                                alt="История компании OPTIMA PET"
                                className="rounded-lg shadow-xl w-full h-auto"
                            />
                            <div
                                className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                                <div className="text-4xl font-bold">15+</div>
                                <div className="text-lg">лет опыта</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-20 bg-gray-50">
                <div className={containerStyles}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Миссия и ценности</h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        <p className="max-w-3xl mx-auto text-lg text-gray-600">
                            Наша миссия — обеспечивать клиентов высококачественной продукцией, которая соответствует
                            международным стандартам качества и безопасности
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        role="list"
                    >
                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="h-8 w-8 text-blue-600" aria-hidden="true"/>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Качество</h3>
                            <p className="text-gray-600">
                                Мы стремимся к постоянному совершенствованию качества нашей продукции, внедряя
                                инновационные технологии и строгий контроль на всех этапах производства.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Users className="h-8 w-8 text-blue-600" aria-hidden="true"/>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Клиентоориентированность</h3>
                            <p className="text-gray-600">
                                Мы ставим потребности наших клиентов на первое место, предлагая индивидуальные решения и
                                высокий уровень сервиса.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <TrendingUp className="h-8 w-8 text-blue-600" aria-hidden="true"/>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Инновации</h3>
                            <p className="text-gray-600">
                                Мы постоянно инвестируем в новые технологии и оборудование, чтобы предлагать нашим
                                клиентам самые современные и эффективные решения.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Production */}
            <section id="production" className="py-20">
                <div className={containerStyles}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Производство</h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        <p className="max-w-3xl mx-auto text-lg text-gray-600">
                            Наше производство оснащено современным оборудованием от ведущих мировых производителей
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={fadeInUp}
                            className="order-2 lg:order-1"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Современное оборудование</h3>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Наше предприятие оснащено высокотехнологичным оборудованием от ведущих мировых
                                    производителей, таких как Husky, Netstal, KraussMaffei и других. Это позволяет нам
                                    производить продукцию высочайшего качества с минимальными допусками и отклонениями.
                                </p>
                                <p>
                                    Мы используем автоматизированные линии производства, которые обеспечивают высокую
                                    производительность и стабильное качество продукции. Все процессы контролируются
                                    компьютерными системами, что позволяет минимизировать влияние человеческого фактора.
                                </p>
                            </div>
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true"/>
                                    <span className="text-gray-700">Автоматизированные линии производства</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true"/>
                                    <span className="text-gray-700">Компьютерный контроль всех процессов</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true"/>
                                    <span className="text-gray-700">Высокая производительность</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true"/>
                                    <span className="text-gray-700">Минимальные допуски и отклонения</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={fadeInUp}
                            className="order-1 lg:order-2"
                        >
                            <img
                                src={aboutimg} // Заменить на реальное изображение
                                alt="Производственное оборудование OPTIMA PET"
                                className="rounded-lg shadow-xl w-full h-auto"
                            />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={fadeInUp}
                        >
                            <img
                                src={aboutimg2} // Заменить на реальное изображение
                                alt="Контроль качества на производстве OPTIMA PET"
                                className="rounded-lg shadow-xl w-full h-auto"
                            />
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={fadeInUp}
                        >
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Полный цикл производства</h3>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Мы осуществляем полный цикл производства: от разработки дизайна и изготовления
                                    пресс-форм до производства готовой продукции и ее доставки клиентам.
                                </p>
                                <p>
                                    Такой подход позволяет нам контролировать качество на всех этапах и оперативно
                                    реагировать на изменения требований рынка и потребностей наших клиентов.
                                </p>
                            </div>
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true"/>
                                    <span className="text-gray-700">Разработка дизайна и конструкции</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true"/>
                                    <span className="text-gray-700">Изготовление пресс-форм</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true"/>
                                    <span className="text-gray-700">Производство продукции</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true"/>
                                    <span className="text-gray-700">Контроль качества</span>
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" aria-hidden="true"/>
                                    <span className="text-gray-700">Логистика и доставка</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Quality Control */}
            <section id="quality" className="py-20 bg-gray-50">
                <div className={containerStyles}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">Контроль качества</h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        <p className="max-w-3xl mx-auto text-lg text-gray-600">
                            Мы осуществляем строгий контроль качества на всех этапах производства
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        role="list"
                    >
                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Factory className="h-8 w-8 text-blue-600" aria-hidden="true"/>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Входной контроль сырья</h3>
                            <p className="text-gray-600">
                                Мы тщательно проверяем все поступающее сырье на соответствие требованиям качества и
                                безопасности. Это позволяет нам гарантировать высокое качество конечной продукции.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Award className="h-8 w-8 text-blue-600" aria-hidden="true"/>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                Контроль в процессе производства
                            </h3>
                            <p className="text-gray-600">
                                На каждом этапе производства мы осуществляем контроль параметров продукции. Это
                                позволяет нам своевременно выявлять и устранять любые отклонения.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <FileText className="h-8 w-8 text-blue-600" aria-hidden="true"/>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                Контроль готовой продукции
                            </h3>
                            <p className="text-gray-600">
                                Перед отправкой клиентам каждая партия продукции проходит финальную проверку, чтобы
                                убедиться в её соответствии стандартам качества и требованиям заказчика.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default React.memo(AboutPage);