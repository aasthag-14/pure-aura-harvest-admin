import axios from "axios";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiUrl: any;
  }
}

const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests to dynamically set the `baseURL`
service.interceptors.request.use(
  (config) => {
    config.baseURL = window?.apiUrl; // Ensure the latest baseURL is used for each request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
