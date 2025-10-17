import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageModalProps {
  title: string;
  image: string;
  nameClass: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ title, image, nameClass }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).classList.contains("overlay")) {
      handleClose();
    }
  };

  return (
    <div>
      <img
        src={image}
        alt={title}
        className={`cursor-pointer w-full object-cover ${nameClass}`}
        onClick={handleOpen}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overlay"
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-5/6 h-5/6 max-w-screen-lg mx-auto"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
            >
              <img
                src={image}
                alt={title}
                className="w-full h-full object-contain"
              />

              <button
                className="absolute top-0 right-0 m-2 shadow-lg bg-white/20 text-white p-2 rounded-full text-2xl"
                onClick={handleClose}
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageModal;
