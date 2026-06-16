import axios from "axios"


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken")
        if (accessToken) {
            config.headers.authorization = `Bearer ${accessToken}`
        }
        return config
    }, 
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalResponse = error.config
        if (error.response?.data?.code === "INVALID_LOGIN1" && !originalResponse._retry()) {
            try {
                originalResponse._retry = true
                const refreshToken = await api.post("/refreshToken")
                localStorage.setItem("accessToken", refreshToken.data.accessToken)
                originalResponse.headers.authorization = `Bearer ${refreshToken.data.accessToken}`
                return api(originalResponse)
            }
            catch (err) {
                localStorage.removeItem("accessToken")
            }
        }
        return Promise.reject(error)
    }
)


export default api

