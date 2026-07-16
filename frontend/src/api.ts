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
        if (error.response?.data?.code === "INVALID_ACCESSTOKEN" && !originalResponse._retry) {
            originalResponse._retry = true
            try {
                const response2 = await api.post("/refreshToken")
                localStorage.setItem("accessToken", response2.data.accessToken)
                originalResponse.headers.authorization = `Bearer ${response2.data.accessToken}`
                return api(originalResponse)
            }
            catch (err) {
                localStorage.removeItem("accessToken")
                return Promise.reject(err)
            }
        }
        return Promise.reject(error)
    }
)



export default api




