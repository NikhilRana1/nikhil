"use client";

import { useRef } from "react";

// Pixels per second the screenshot pans while hovered.
const SPEED = 220;

/**
 * Shows a tall full-page screenshot cropped to its frame. On hover the image
 * pans down to its bottom, like scrolling the live site; on leave it returns.
 * Touch devices have no hover, so they simply see the top of the page.
 */
export default function ScrollPreview({ src, alt, className = "" }) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);

  function pan(toBottom) {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return;

    const distance = Math.max(0, img.offsetHeight - frame.offsetHeight);
    const seconds = Math.max(1, distance / SPEED);
    img.style.transition = `transform ${toBottom ? seconds : 0.6}s ${
      toBottom ? "linear" : "ease-out"
    }`;
    img.style.transform = toBottom ? `translateY(-${distance}px)` : "translateY(0)";
  }

  return (
    <div
      ref={frameRef}
      onMouseEnter={() => pan(true)}
      onMouseLeave={() => pan(false)}
      className={`overflow-hidden bg-sunken ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        className="block h-auto min-h-full w-full object-cover object-top will-change-transform"
      />
    </div>
  );
}
