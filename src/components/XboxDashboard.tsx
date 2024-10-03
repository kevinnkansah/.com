import React, { useState, useEffect, useRef } from 'react';

const slides = [
  { id: 'marketplace', title: '1 | MARKETPLACE', bgClass: 'marketplace-slide' },
  { id: 'xboxlive', title: '2 | XBOXLIVE', bgClass: 'xboxlive-slide' },
  { id: 'games', title: '3 | GAMES', bgClass: 'games-slide' },
  { id: 'media', title: '4 | MEDIA', bgClass: 'media-slide' },
  { id: 'system', title: '5 | SYSTEM', bgClass: 'system-slide' },
];

const XboxDashboard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(2); // Default at 'games'
  const sliderWrapperRef = useRef<HTMLDivElement>(null);

  // Handle the first page load animation
  useEffect(() => {
    moveButtons(currentIndex); // Move buttons to their positions
  }, [currentIndex]);

  // Move to the selected slide with smooth scrolling
  const scrollToSlide = (index: number) => {
    if (sliderWrapperRef.current) {
      const slideWidth = sliderWrapperRef.current.offsetWidth;
      sliderWrapperRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth',
      });
    }
  };

  // Re-arrange the buttons when a new slide is selected
  const moveButtons = (index: number) => {
    const leftButtonsContainer = document.querySelector('.left-slider-buttons');
    const rightButtonsContainer = document.querySelector('.right-slider-buttons');
    const buttonElements = Array.from(document.querySelectorAll('.slider-button'));

    if (leftButtonsContainer && rightButtonsContainer) {
      leftButtonsContainer.innerHTML = '';
      rightButtonsContainer.innerHTML = '';

      for (let i = 0; i <= index; i++) {
        leftButtonsContainer.appendChild(buttonElements[i]);
      }
      for (let i = index + 1; i < buttonElements.length; i++) {
        rightButtonsContainer.appendChild(buttonElements[i]);
      }
    }
  };

  // Handle the button click event to switch slides
  const handleButtonClick = (index: number) => {
    setCurrentIndex(index); // Set the new current slide index
    scrollToSlide(index); // Smoothly scroll to the new slide
  };

  return (
    <div className="dashboard">
      {/* Left Buttons */}
      <div className="left-slider-buttons">
        {slides.slice(0, 3).map((slide, index) => (
          <button
            key={slide.id}
            className="slider-button"
            onClick={() => handleButtonClick(index)}
          >
            <span className="button-label">{slide.id}</span>
          </button>
        ))}
      </div>

      {/* Slider Section */}
      <div className="slider-wrapper" ref={sliderWrapperRef}>
        {slides.map((slide) => (
          <div key={slide.id} className={`slide ${slide.bgClass}`}>
            <h1>{slide.title}</h1>
          </div>
        ))}
      </div>

      {/* Right Buttons */}
      <div className="right-slider-buttons">
        {slides.slice(3).map((slide, index) => (
          <button
            key={slide.id}
            className="slider-button"
            onClick={() => handleButtonClick(index + 3)}
          >
            <span className="button-label">{slide.id}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default XboxDashboard;
