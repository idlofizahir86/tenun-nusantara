/**
 * Orientation Configuration
 * Menentukan aturan landscape-only untuk aplikasi game
 */

export const ORIENTATION_CONFIG = {
  // Minimum aspect ratio untuk landscape (16:9 = 1.77)
  MIN_ASPECT_RATIO: 1.5,
  
  // Minimum width untuk dianggap "desktop landscape"
  MIN_LANDSCAPE_WIDTH: 1024,
  
  // Minimum height untuk memastikan ruang vertikal cukup
  MIN_LANDSCAPE_HEIGHT: 600,
  
  // Breakpoint untuk mobile landscape (tablet横屏)
  MOBILE_LANDSCAPE_BREAKPOINT: 768,
} as const;

export type OrientationStatus = 
  | "landscape-ok"           // Landscape dengan ukuran cukup
  | "landscape-small"        // Landscape tapi layar kecil (tablet)
  | "portrait"               // Portrait (harus rotate)
  | "checking";              // Masih mendeteksi

export function getOrientationStatus(
  width: number,
  height: number
): OrientationStatus {
  const aspectRatio = width / height;
  
  // Portrait mode
  if (height > width) {
    return "portrait";
  }
  
  // Landscape tapi terlalu kecil
  if (width < ORIENTATION_CONFIG.MIN_LANDSCAPE_WIDTH) {
    return "landscape-small";
  }
  
  // Aspect ratio terlalu kecil (hampir kotak)
  if (aspectRatio < ORIENTATION_CONFIG.MIN_ASPECT_RATIO) {
    return "landscape-small";
  }
  
  return "landscape-ok";
}