"use client";

import { motion } from "framer-motion";
import trackimg from "../assets/trackimg.png";

const TruckJourney = () => {
    // Варианты анимации для грузовика
    const truckVariants = {
        animate: {
            x: ["-110%", "450%"], // Едет от -110% (слева за экраном) до 450% (справа за экраном)
            transition: {
                x: {
                    repeat: Infinity, // Бесконечный повтор
                    repeatType: "loop", // Зацикливание
                    duration: 8, // Длительность одного цикла (в секундах)
                    ease: "linear", // Плавное линейное движение
                },
            },
        },
    };

    return (
        <section className="relative h-[30vh] sm:h-[20vh] md:h-[30vh]  overflow-hidden">
            {/* Дорога */}
            <div className="absolute bottom-0 w-full h-24 md:h-24 sm:h-24 bg-gray-700">
                <div className="h-1 bg-white w-full absolute top-1/2 transform -translate-y-1/2 dashed-line" />
            </div>

            {/* Грузовик */}
            <motion.div
                variants={truckVariants}
                animate="animate"
                className="absolute bottom-12 sm:bottom-10 sm:w-80 flex items-center justify-center"
            >
                <img
                    src={trackimg}
                    alt="Грузовик OPTIMA PET"
                    className="w-full h-full object-contain"
                />
            </motion.div>
        </section>
    );
};

export default TruckJourney;