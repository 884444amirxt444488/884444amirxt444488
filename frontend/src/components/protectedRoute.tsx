import { Navigate } from "react-router-dom"

type Props = {
    children: React.ReactNode
}

function ProtectedRoute({children}: Props) {
    const token = localStorage.getItem("accessToken")
    if (!token) {
        return <Navigate to={"/login"} />
    }
    return children
}




export default ProtectedRoute





