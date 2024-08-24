
/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} [days=7] - Number of days until the cookie expires
 */
export const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; secure; HttpOnly`;
};

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

/**
 * Delete a cookie
 * @param {string} name - Cookie name
 */
export const deleteCookie = (name) => {
  setCookie(name, "", -1);
};
