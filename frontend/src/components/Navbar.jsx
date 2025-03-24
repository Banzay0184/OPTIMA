"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"
import logo from "../assets/optima_logo.webp"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  }

  const linkVariants = {
    hover: { scale: 1.05, color: "#3B82F6", transition: { duration: 0.2 } },
  }

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.img whileHover={{ rotate: 10 }} className={`h-15 w-auto ${isScrolled ? "" : "brightness-800"}`} src={logo} alt="OPTIMA PET" width="300" height="100" loading="lazy"/>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isScrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}`}
              >
                Главная
              </Link>
            </motion.div>

            <div className="relative">
              <motion.div whileHover="hover" variants={linkVariants}>
                <Link
                    to="/catalog"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isScrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}`}
                >
                  Каталог
                </Link>
              </motion.div>
            </div>

            <motion.div whileHover="hover" variants={linkVariants}>
              <Link
                  to="/about"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isScrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}`}
              >
                О компании
              </Link>
            </motion.div>

            <motion.div whileHover="hover" variants={linkVariants}>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isScrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}`}
              >
                Контакты
              </Link>
            </motion.div>

            <motion.a
                type="button"
                href='tel:+998906111011'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Звонок
            </motion.a>
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${isScrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={menuVariants}
        className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Главная
          </Link>
          <Link
            to="/catalog"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Каталог
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            О компании
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          >
            Контакты
          </Link>
          <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">
            Заказать звонок
          </button>
        </div>
      </motion.div>
    </motion.nav>
  )
}

export default Navbar

