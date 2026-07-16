import { Navigate } from "react-router-dom"


type Props ={
    children: React.ReactNode
}

function ProtectedRoute({children}: Props) {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
        return <Navigate to={"/login"} />
    }
    return children
}


export default ProtectedRoute



