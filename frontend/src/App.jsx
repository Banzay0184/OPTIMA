"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import CatalogPage from "./pages/CatalogPage"
import ProductPage from "./pages/ProductPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import AdminLayout from "./components/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage"
import AdminTypesPage from "./pages/admin/AdminTypesPage"
import AdminProductsPage from "./pages/admin/AdminProductsPage"
import AdminProductEdit from "./pages/admin/AdminProductEdit"

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          {/* Публичные маршруты */}
          <Route 
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <HomePage />
                  </AnimatePresence>
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/catalog" 
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <CatalogPage />
                  </AnimatePresence>
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/catalog/:categoryId" 
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <CatalogPage />
                  </AnimatePresence>
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/catalog/:categoryId?/:typeId?" 
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <CatalogPage />
                  </AnimatePresence>
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/product/:productId" 
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <ProductPage />
                  </AnimatePresence>
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/about" 
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <AboutPage />
                  </AnimatePresence>
                </main>
                <Footer />
              </>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <AnimatePresence mode="wait">
                    <ContactPage />
                  </AnimatePresence>
                </main>
                <Footer />
              </>
            } 
          />
          
          {/* Маршруты админ-панели */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="types" element={<AdminTypesPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="products/new" element={<AdminProductEdit />} />
            <Route path="products/edit/:id" element={<AdminProductEdit />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App

