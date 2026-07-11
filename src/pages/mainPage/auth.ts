// auth.js - Shared module for managing access token in memory
let accessToken: string | null = null;

export async function getAccessToken() {
    if (accessToken) return accessToken;

    try {
        const response = await fetch('https://videostreamingbackend-dxgv.onrender.com/refresh', {
            credentials: 'include',
            headers: { Accept: 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            accessToken = data?.accessToken || null;
            return accessToken;
        }
    } catch (error) {
        console.warn('Refresh failed, no access token available', error);
    }

    return null;
}

export function setAccessToken(token: string | null) {
    accessToken = token;
}// what this does is it sets the access token in memory so that it can be used for authenticated requests. The `getAccessToken` function retrieves the access token, either from memory or by making a request to refresh it. The `setAccessToken` function allows you to set the access token manually, and the `clearAccessToken` function clears the access token from memory.

export function clearAccessToken() {
    accessToken = null;
}