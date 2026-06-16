import logout from "./logout"
import ProtectedRoute from "./components/protectedRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import Tasks from "./pages/Tasks"

import {Link, Route, Routes, useNavigate} from "react-router-dom"
import "./App.css"



function App() {

    const navigate = useNavigate()
    

    return (
        <>
        <div>
            <h1>WELCOM TO MY SITE</h1>
            <button onClick={() => {
                logout()
                navigate("/login")
            }}>
                Logout
            </button>
            <Link to={"/signup"} className="ll">
                Signup
            </Link>
            <Link to={"/login"} className="ll">
                Login
            </Link>
            <Link to={"/profile"} className="ll">
                profile
            </Link>
            <Link to={"/tasks"} className="ll">
                tasks
            </Link>
        </div>
        <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
            <Route path="/tasks" element={
                <ProtectedRoute>
                    <Tasks />
                </ProtectedRoute>
            } />
        </Routes>
        </>
    )
}

export default App




