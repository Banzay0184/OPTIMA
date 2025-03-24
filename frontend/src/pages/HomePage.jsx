"use client";

import {useState, useEffect} from "react";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import {ArrowRight, TrendingUp, Award, Recycle} from "lucide-react";
import ProductFeatures from "../components/ProductFeatures";
import CertificatesSection from "../components/CertificatesSection";
import UzbekistanMap from "../components/UzbekistanMap";
import TruckJourney from "../components/TruckJourney"; // Обновлённый компонент
import {fetchCategories} from "../services/api.js";
import bgImg from "../assets/container_bg.jpg";

// Переиспользуемый компонент кнопки
const MotionButton = ({children, className, to, ...props}) => (
    <Link to={to}>
        <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            className={`px-8 py-3 rounded-md text-lg font-medium transition-colors ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    </Link>
);

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setError("Не удалось загрузить категории. Попробуйте позже.");
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    const fadeInUp = {
        hidden: {opacity: 0, y: 60},
        visible: {opacity: 1, y: 0, transition: {duration: 0.6}},
    };

    const staggerContainer = {
        hidden: {opacity: 0},
        visible: {opacity: 1, transition: {staggerChildren: 0.2}},
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-screen flex items-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <video
                        className="w-full h-full object-cover"
                        id="myVideo"
                        preload="auto"
                        playsInline
                        autoPlay
                        loop
                        muted
                        onError={() => console.error("Ошибка загрузки видео")}
                    >
                        <img src={bgImg} alt="Fallback изображение" className="w-full h-full object-cover"/>
                    </video>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.8}}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Инновационные решения для упаковки
                        </h1>
                        <p className="text-xl md:text-2xl mb-8">
                            Производство высококачественных ПЭТ-преформ, колпачков и бутылок для различных отраслей
                            промышленности
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <MotionButton to="/catalog" className="bg-blue-600 text-white hover:bg-blue-700">
                                Наша продукция
                            </MotionButton>
                            <MotionButton
                                to="/contact"
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900"
                            >
                                Связаться с нами
                            </MotionButton>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, delay: 1}}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
                >
                    <motion.div
                        animate={{y: [0, 10, 0]}}
                        transition={{repeat: Infinity, duration: 1.5}}
                    >
                        <ArrowRight className="h-10 w-10 text-white transform rotate-90"/>
                    </motion.div>
                </motion.div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">О компании</h1>
                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">OPTIMA PLAST INVEST</h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        <p className="max-w-3xl mx-auto text-lg text-gray-600">
                            Мы специализируемся на производстве высококачественных ПЭТ-преформ, пластиковых колпачков и
                            бутылок, используя современное оборудование и инновационные технологии.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <motion.div
                                whileHover={{scale: 1.1, rotate: 5}}
                                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <TrendingUp className="h-8 w-8 text-blue-600"/>
                            </motion.div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Современное производство</h3>
                            <p className="text-gray-600">
                                Наше предприятие оснащено современным оборудованием от ведущих мировых производителей,
                                что позволяет нам выпускать продукцию высочайшего качества.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <motion.div
                                whileHover={{scale: 1.1, rotate: 5}}
                                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <Award className="h-8 w-8 text-blue-600"/>
                            </motion.div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Контроль качества</h3>
                            <p className="text-gray-600">
                                Мы осуществляем строгий контроль качества на всех этапах производства, что гарантирует
                                соответствие нашей продукции международным стандартам.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-lg shadow-lg text-center">
                            <motion.div
                                whileHover={{scale: 1.1, rotate: 5}}
                                className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <Recycle className="h-8 w-8 text-blue-600"/>
                            </motion.div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Экологичность</h3>
                            <p className="text-gray-600">
                                Мы заботимся об окружающей среде, используя экологически чистые материалы и внедряя
                                безотходные технологии производства.
                            </p>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="text-center mt-12"
                    >
                        <MotionButton
                            to="/about"
                            className="inline-flex items-center bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Узнать больше о компании
                            <ArrowRight className="ml-2 h-5 w-5"/>
                        </MotionButton>
                    </motion.div>
                </div>
            </section>

            {/* Uzbekistan Map Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                            Наше присутствие в Узбекистане
                        </h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        <p className="max-w-3xl mx-auto text-lg text-gray-600">
                            Мы располагаем современными производственными мощностями в ключевых городах страны
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                    >
                        <UzbekistanMap/>

                    </motion.div>


                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="mt-12 text-center"
                    >
                        <p className="text-lg text-gray-700">
                            Наши заводы оснащены современным оборудованием и соответствуют международным стандартам
                            качества. Это позволяет нам обеспечивать высокое качество продукции и оперативную доставку
                            по всей стране.
                        </p>
                    </motion.div>
                </div>
                <TruckJourney/>
            </section>
            {/* Truck Journey Section */}


            {/* Products Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Наша продукция</h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
                        <p className="max-w-3xl mx-auto text-lg text-gray-600">
                            Мы предлагаем широкий ассортимент продукции для различных отраслей промышленности
                        </p>
                    </motion.div>

                    {error ? (
                        <p className="text-center text-red-600">{error}</p>
                    ) : loading ? (
                        <p className="text-center text-gray-600">Загрузка категорий...</p>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{once: true}}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {categories.slice(0, 4).map((category) => (
                                <motion.div
                                    key={category.id}
                                    variants={fadeInUp}
                                    whileHover={{y: -10}}
                                    className="bg-white rounded-lg overflow-hidden shadow-lg"
                                >
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2 text-gray-900">
                                            {category.category_name}
                                        </h3>
                                        <Link to={`/catalog/${category.id}`}>
                                            <motion.button
                                                whileHover={{scale: 1.05}}
                                                whileTap={{scale: 0.95}}
                                                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                                            >
                                                Подробнее
                                                <ArrowRight className="ml-1 h-4 w-4"/>
                                            </motion.button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="text-center mt-12"
                    >
                        <MotionButton
                            to="/catalog"
                            className="inline-flex items-center bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Перейти в каталог
                            <ArrowRight className="ml-2 h-5 w-5"/>
                        </MotionButton>
                    </motion.div>
                </div>
            </section>

            <ProductFeatures/>
            <CertificatesSection/>

            {/* Call to Action */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{once: true}}
                        variants={fadeInUp}
                        className="bg-gray-900 rounded-2xl overflow-hidden"
                    >
                        <div className="grid md:grid-cols-2">
                            <div className="p-12 flex items-center">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                        Готовы начать сотрудничество?
                                    </h2>
                                    <p className="text-lg text-gray-300 mb-8">
                                        Свяжитесь с нами сегодня, чтобы обсудить ваши потребности и получить
                                        индивидуальное предложение.
                                    </p>
                                    <MotionButton
                                        to="/contact"
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        Связаться с нами
                                    </MotionButton>
                                </div>
                            </div>
                            <div className="relative h-96 md:h-auto">
                                <img
                                    src={bgImg}
                                    alt="Производство ПЭТ-преформ"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default HomePage;