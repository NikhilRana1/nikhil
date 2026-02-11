"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handlePointerChange = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y);
      if (hoveredElement) {
        const computedStyle = window.getComputedStyle(hoveredElement);
        setIsPointer(
          computedStyle.cursor === "pointer" ||
          hoveredElement.tagName === "A" ||
          hoveredElement.tagName === "BUTTON"
        );
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handlePointerChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handlePointerChange);
    };
  }, [position.x, position.y]);

  // Hide on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <>
      {/* Main cursor */}
      <div
        className={`fixed pointer-events-none z-[9999] transition-transform duration-100 ease-out mix-blend-difference ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        }}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transition-all duration-200 ${
            isPointer ? "scale-150" : ""
          }`}
        />
      </div>

      {/* Cursor trail */}
      <div
        className={`fixed pointer-events-none z-[9998] transition-all duration-300 ease-out mix-blend-difference ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className={`w-8 h-8 border border-white rounded-full transition-all duration-300 ${
            isPointer ? "scale-150 border-2" : ""
          }`}
        />
      </div>
    </>
  );
}
