// API Base URL Configuration
const BASE_URL = "https://carsystem-backend.onrender.com/api";
// const BASE_URL = "http://localhost:8080/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Health check
  HEALTH: `${BASE_URL}/health`,

  // Auth endpoints
  AUTH: {
    LOGIN: `${BASE_URL}/v1/auth/login`,
    REGISTER: `${BASE_URL}/v1/auth/register`,
    GOOGLE_LOGIN: `${BASE_URL}/v1/auth/google-login`,
  },

  // Cars endpoints
  CARS: {
    ALL: `${BASE_URL}/v1/cars/all-cars`,
    SEARCH: `${BASE_URL}/v1/cars/search`,
    DETAILS: (id) => `${BASE_URL}/v1/cars/all-cars/${id}`,
    CREATE: `${BASE_URL}/v1/cars/car-listing`,
    EDIT: (id) => `${BASE_URL}/v1/cars/car-listing/edit/${id}`,
    DELETE: (id) => `${BASE_URL}/v1/cars/car-listing/${id}`,
  },

  // Reviews endpoints
  REVIEWS: {
    BY_CAR: (id) => `${BASE_URL}/v1/reviews/cars/${id}/reviews`,
    CREATE: (id) => `${BASE_URL}/v1/reviews/cars/${id}/reviews`,
    DELETE: (id) => `${BASE_URL}/v1/reviews/${id}`,
  },

  // Payment endpoints
  PAYMENT: {
    CREATE: `${BASE_URL}/v1/stripe/payment`,
  },

  // Feedback endpoints
  FEEDBACK: {
    CREATE: `${BASE_URL}/v1/feedbacks/create-feedback`,
  },

  // Favorites endpoints
  FAVORITES: {
    ADD: (carId) => `${BASE_URL}/v1/favorites/${carId}`,
    REMOVE: (carId) => `${BASE_URL}/v1/favorites/${carId}`,
    GET_ALL: `${BASE_URL}/v1/favorites/my-favorites`,
    CHECK: (carId) => `${BASE_URL}/v1/favorites/check/${carId}`,
    COUNT: (carId) => `${BASE_URL}/v1/favorites/count/${carId}`,
  },

  // Inquiry/Messaging endpoints
  INQUIRIES: {
    SEND: (carId) => `${BASE_URL}/v1/inquiries/car/${carId}`,
    SENT: `${BASE_URL}/v1/inquiries/sent`,
    RECEIVED: `${BASE_URL}/v1/inquiries/received`,
    REPLY: (inquiryId) => `${BASE_URL}/v1/inquiries/reply/${inquiryId}`,
    MARK_READ: (inquiryId) => `${BASE_URL}/v1/inquiries/read/${inquiryId}`,
    UNREAD_COUNT: `${BASE_URL}/v1/inquiries/unread-count`,
  },

  // Analytics endpoints
  ANALYTICS: {
    RECORD_VIEW: (carId) => `${BASE_URL}/v1/analytics/view/${carId}`,
    CAR_STATS: (carId) => `${BASE_URL}/v1/analytics/car/${carId}/stats`,
    DASHBOARD: `${BASE_URL}/v1/analytics/dashboard`,
    ACTIVITY: `${BASE_URL}/v1/analytics/activity`,
    PLATFORM: `${BASE_URL}/v1/analytics/platform`,
  },

  // Advanced Search endpoints
  SEARCH: {
    ADVANCED: `${BASE_URL}/v1/search/advanced`,
    FILTER_OPTIONS: `${BASE_URL}/v1/search/filter-options`,
    COMPARE: `${BASE_URL}/v1/search/compare`,
    SIMILAR: (carId) => `${BASE_URL}/v1/search/similar/${carId}`,
    TRENDING: `${BASE_URL}/v1/search/trending`,
  },
};

// Export base URL for image paths or other uses
export { BASE_URL };

export default API_ENDPOINTS;
