import api from "./api"
const logout = async() => {

    try {
        localStorage.removeItem("accessToken")
        await api.post("/logout")
    }
    catch (err) {
        alert(err)
    }
}


export default logout
