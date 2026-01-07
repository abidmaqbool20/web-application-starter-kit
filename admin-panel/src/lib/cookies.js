/**
 * Cookie utility functions for managing user preferences
 * Cookies are set to never expire (max 10 years)
 */

const COOKIE_MAX_AGE = 10 * 365 * 24 * 60 * 60; // 10 years in seconds

/**
 * Set a cookie that never expires
 */
export function setCookie(name, value) {
    if (typeof document === 'undefined') return;

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + COOKIE_MAX_AGE);

    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value
 */
export function getCookie(name) {
    if (typeof document === 'undefined') return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return decodeURIComponent(parts.pop().split(';').shift());
    }

    return null;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name) {
    if (typeof document === 'undefined') return;

    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Get all cookies as an object
 */
export function getAllCookies() {
    if (typeof document === 'undefined') return {};

    const cookies = {};
    const cookieStrings = document.cookie.split(';');

    cookieStrings.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name) {
            cookies[name] = decodeURIComponent(value || '');
        }
    });

    return cookies;
}

/**
 * Set user preferences in a single cookie as JSON
 */
export function setPreferences(preferences) {
    setCookie('user_preferences', JSON.stringify(preferences));
}

/**
 * Get user preferences from cookie
 */
export function getPreferences() {
    const prefsString = getCookie('user_preferences');
    if (!prefsString) return null;

    try {
        return JSON.parse(prefsString);
    } catch (e) {
        console.error('Failed to parse preferences cookie:', e);
        return null;
    }
}
