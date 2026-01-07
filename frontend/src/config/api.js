// API Base URL Configuration
const BASE_URL = "https://carsystem-backend.onrender.com/api";

// API Endpoints
export const API_ENDPOINTS = {
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
};

// Export base URL for image paths or other uses
export { BASE_URL };

export default API_ENDPOINTS;
