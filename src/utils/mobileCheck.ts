import {
  isMobile as uaIsMobile,
  isAndroid,
  isIOS,
  isMobileOnly,
  isTablet,
  isDesktop,
} from "react-device-detect";

export type MobileType = "android" | "ios" | "unknown" | "not-mobile" | "desktop";

const STORAGE_KEY = "deviceType";

export function detectSmartphone(): MobileType {
  // 1️⃣ Try reading existing value from localStorage
  const saved = localStorage.getItem(STORAGE_KEY) as MobileType | null;
  if (saved) return saved;

  // 2️⃣ Library-based detection
  const libraryMobile = uaIsMobile || isMobileOnly || isAndroid || isIOS;

  // 3️⃣ Strict environment check
  const isSmallScreen = window.innerWidth <= 500;
  const isTouch = navigator.maxTouchPoints > 0;
  const environmentMobile = isSmallScreen && isTouch;

  // 4️⃣ Combine library + environment + tablet/desktop checks
  const isSmartphone =
    libraryMobile && environmentMobile && !isTablet && !isDesktop;

  let type: MobileType;

  if (!isSmartphone && isDesktop) {
    type = "desktop";
  } else if (!isSmartphone) {
    type = "not-mobile";
  } else if (isAndroid) {
    type = "android";
  } else if (isIOS) {
    type = "ios";
  } else if (isMobileOnly) {
    type = "unknown"; // mobile UA but unknown type
  } else {
    type = "unknown"; // fallback for rare cases
  }

  // 5️⃣ Save result for next load
  localStorage.setItem(STORAGE_KEY, type);
  
  return type;
}
