"use client"

import { motion } from "framer-motion"

const TypeSelector = ({ types, activeType, onSelectType }) => {
  return (
    <ul className="ml-4 mt-2 space-y-1">
      {types.map((type) => (
        <li key={type.id}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectType(type.id)}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              activeType === type.id ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {type.name}
          </motion.button>
        </li>
      ))}
    </ul>
  )
}

export default TypeSelector

