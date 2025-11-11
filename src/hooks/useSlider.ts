import { sliderData } from "@/components/Carousel/data";
import { useEffect, useState, useRef } from "react";

const useSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = sliderData.length;

  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const autoScroll = true;
  const intervalTime = 7000;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slideLength - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideLength - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (autoScroll) {
      slideInterval.current = setInterval(nextSlide, intervalTime);
    }

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [currentSlide]);

  return { nextSlide, prevSlide, goToSlide, currentSlide, sliderData };
};

export default useSlider;
