/**
 * Platform Detection Utility
 * Detects iOS, Android, or Desktop devices
 */

export type DeviceType = 'ios' | 'android' | 'desktop';

// App Store URL for Mindsnack
export const APP_STORE_URL = 'https://apps.apple.com/in/app/mindsnack-daily-microlearning/id6752513248';

/**
 * Detects the current platform based on user agent
 */
export function detectDeviceType(): DeviceType {
  if (typeof navigator === 'undefined') return 'desktop';

  const userAgent = navigator.userAgent.toLowerCase();

  // iOS detection (iPhone, iPad, iPod)
  const isIOS = /iphone|ipad|ipod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad detection for newer iPads

  if (isIOS) return 'ios';

  // Android detection
  if (/android/.test(userAgent)) return 'android';

  // Everything else is desktop
  return 'desktop';
}

/**
 * Checks if the device is running iOS
 */
export function isIOS(): boolean {
  return detectDeviceType() === 'ios';
}

/**
 * Checks if the device is running Android
 */
export function isAndroid(): boolean {
  return detectDeviceType() === 'android';
}

/**
 * Checks if the device is a desktop/laptop
 */
export function isDesktop(): boolean {
  return detectDeviceType() === 'desktop';
}

/**
 * Opens the App Store URL
 * On iOS: Opens App Store app directly
 * On other devices: Opens in browser
 */
export function openAppStore(): void {
  window.location.href = APP_STORE_URL;
}
