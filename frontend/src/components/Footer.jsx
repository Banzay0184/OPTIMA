"use client"

import {motion} from "framer-motion"
import {Phone, Mail, MapPin,} from "lucide-react"
import {Link} from "react-router-dom"
import logo from "../assets/optima_logo.png"
import {useEffect, useState} from "react";
import {fetchCategories} from "../services/api.js";


const Footer = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategories();
            setCategories(data);
            setLoading(false);
        };
        loadCategories();
    }, []);

    const footerVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {opacity: 1, y: 0},
    }

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{once: true}}
            variants={footerVariants}
            className="bg-gray-900 text-white"
        >
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <motion.div variants={itemVariants} className="space-y-4">
                        <img src={logo} alt="OPTIMA PET" className="h-10 brightness-800"/>
                        <p className="text-gray-300">
                            Производство высококачественных ПЭТ-преформ, пластиковых колпачков и бутылок для различных
                            отраслей
                            промышленности.
                        </p>
                        <div className="flex space-x-4">
                            <motion.a
                                href="#"
                                whileHover={{scale: 1.2, color: "#4267B2"}}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="h-6 w-6 text-primary" fill="blue" viewBox="0 0 24 24">
                                    <path
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{scale: 1.2, color: "#E1306C"}}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="h-6 w-6 text-primary" fill="red" viewBox="0 0 24 24">
                                    <path
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                </svg>
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{scale: 1.2, color: "#0077B5"}}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="#fff"
                                     viewBox="0 0 240 240" id="telegram">
                                    <defs>
                                        <linearGradient id="a" x1="160.01" x2="100.01" y1="40.008" y2="180"
                                                        gradientUnits="userSpaceOnUse">
                                            <stop offset="0" color=""></stop>
                                            <stop offset="1" color=""></stop>
                                        </linearGradient>
                                    </defs>
                                    <circle cx="120" cy="120" r="120" fill="#0088cc"></circle>
                                    <path fill="#fff"
                                          d="M44.691 125.87c14.028-7.727 29.687-14.176 44.318-20.658 25.171-10.617 50.442-21.05 75.968-30.763 4.966-1.655 13.89-3.273 14.765 4.087-.48 10.418-2.45 20.775-3.802 31.132-3.431 22.776-7.398 45.474-11.265 68.175-1.333 7.561-10.805 11.476-16.866 6.637-14.566-9.84-29.244-19.582-43.624-29.65-4.71-4.786-.342-11.66 3.864-15.078 11.997-11.823 24.72-21.868 36.09-34.302 3.067-7.406-5.995-1.164-8.984.749-16.424 11.318-32.446 23.327-49.762 33.274-8.845 4.869-19.154.708-27.995-2.01-7.927-3.281-19.543-6.588-12.708-11.592z"></path>
                                </svg>
                            </motion.a>
                        </div>
                    </motion.div>


                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-lg font-semibold">Компания</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                                    О нас
                                </Link>
                            </li>
                            <li>
                                <Link to="/about#production"
                                      className="text-gray-300 hover:text-blue-400 transition-colors">
                                    Производство
                                </Link>
                            </li>
                            <li>
                                <Link to="/about#quality"
                                      className="text-gray-300 hover:text-blue-400 transition-colors">
                                    Контроль качества
                                </Link>
                            </li>
                            <li>
                                <Link to="/about#certificates"
                                      className="text-gray-300 hover:text-blue-400 transition-colors">
                                    Сертификаты
                                </Link>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-lg font-semibold">Контакты</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 mr-2 text-blue-400"/>
                                <a href="tel:+78001234567"
                                   className="text-gray-300 hover:text-blue-400 transition-colors">
                                    +998 (90) 611 10 11
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Phone className="h-5 w-5 mr-2 text-blue-400"/>
                                <a href="tel:+78001234567"
                                   className="text-gray-300 hover:text-blue-400 transition-colors">
                                    +998 (97) 300 10 09
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="h-5 w-5 mr-2 text-blue-400"/>
                                <a href="mailto:info@optimapet.ru"
                                   className="text-gray-300 hover:text-blue-400 transition-colors">
                                    info@optimaplast.uz
                                </a>
                            </li>
                        </ul>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <h3 className="text-lg font-semibold">Склад</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-2 text-blue-400 mt-1"/>
                                <span
                                    className="text-gray-300">Каганский район, улица Адолат, дом 1</span>
                            </li>
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-2 text-blue-400 mt-1"/>
                                <span
                                    className="text-gray-300">Самаркандский район, махалля Охалик Сой, дом 1,</span>
                            </li>
                            <li className="flex items-start">
                                <MapPin className="h-5 w-5 mr-2 text-blue-400 mt-1"/>
                                <span
                                    className="text-gray-300">Ташкентская область, улица Ахмад Яссавий Сигатгох,
дом 17А,</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                <motion.div variants={itemVariants}
                            className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} OPTIMA PLAST INVEST Все права защищены.</p>
                </motion.div>
            </div>
        </motion.footer>
    )
}

export default Footer

