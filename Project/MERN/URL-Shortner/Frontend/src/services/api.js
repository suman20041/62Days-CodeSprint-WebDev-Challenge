import axios from "axios";

const api = axios.create({
    baseURL: "https://trimly-back.vercel.app/api",
    withCredentials: false
})

export default api
