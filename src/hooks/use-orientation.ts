"use client";

import { useState, useEffect } from "react";
import { 
  getOrientationStatus, 
  type OrientationStatus 
} from "@/config/orientation";

export function useOrientation() {
  const [status, setStatus] = useState<OrientationStatus>("checking");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      setStatus(getOrientationStatus(width, height));
    }

    // Initial check
    handleResize();

    // Listen to resize events
    window.addEventListener("resize", handleResize);
    
    // Listen to orientation change (mobile)
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return {
    status,
    isLandscape: status === "landscape-ok" || status === "landscape-small",
    isPortrait: status === "portrait",
    isReady: status === "landscape-ok",
    width: dimensions.width,
    height: dimensions.height,
  };
}