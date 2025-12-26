// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
//   withCredentials: true, // Ensure cookies/session work if needed
// });

// // export default API;


// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // لینک بک‌اند روی Render
//   withCredentials: true, // Ensure cookies/session work if needed
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ❌ بدون /api
  withCredentials: true,
});

export default API;
