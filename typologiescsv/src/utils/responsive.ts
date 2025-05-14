/**
 * Utility functions for responsive design
 */

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  widescreen: 1200
};

/**
 * Determines if the current viewport is mobile-sized
 * @returns true if viewport width is less than or equal to the mobile breakpoint
 */
export const isMobile = (): boolean => {
  return window.innerWidth <= BREAKPOINTS.mobile;
};

/**
 * Determines if the current viewport is tablet-sized
 * @returns true if viewport width is less than or equal to the tablet breakpoint
 */
export const isTablet = (): boolean => {
  return window.innerWidth <= BREAKPOINTS.tablet && window.innerWidth > BREAKPOINTS.mobile;
};

/**
 * Determines if the current viewport is desktop-sized
 * @returns true if viewport width is less than or equal to the desktop breakpoint and greater than tablet
 */
export const isDesktop = (): boolean => {
  return window.innerWidth <= BREAKPOINTS.desktop && window.innerWidth > BREAKPOINTS.tablet;
};

/**
 * Determines if the current viewport is widescreen-sized
 * @returns true if viewport width is greater than the desktop breakpoint
 */
export const isWidescreen = (): boolean => {
  return window.innerWidth > BREAKPOINTS.desktop;
};

/**
 * Returns a value based on the current viewport size
 * @param mobileValue Value to return for mobile viewports
 * @param tabletValue Value to return for tablet viewports
 * @param desktopValue Value to return for desktop viewports
 * @param widescreenValue Value to return for widescreen viewports
 * @returns The appropriate value for the current viewport size
 */
export const responsiveValue = <T>(
  mobileValue: T,
  tabletValue: T = mobileValue,
  desktopValue: T = tabletValue,
  widescreenValue: T = desktopValue
): T => {
  if (isMobile()) return mobileValue;
  if (isTablet()) return tabletValue;
  if (isDesktop()) return desktopValue;
  return widescreenValue;
};