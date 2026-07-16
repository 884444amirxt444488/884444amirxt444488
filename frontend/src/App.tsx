import "./App.css"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Column from "./pages/Column"
import { Link, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./components/protectedRoute"
import logloimage from "./images.jpg"
import profileImagge from "./user-circles-set_78370-4704.jpg"
import ForgottenPassword from "./pages/forgottenPassword"
import EditProfile from "./pages/EditProfile"
import Profile from "./pages/Profile"
import { useState } from "react"
import Dashboard from "./pages/Dashboard"


function App() {

    const [profileTrue, setProfileTrue] = useState(false)


    return (
        <>
            <div>
                <div className="header">
                    <div className="logo">
                        <div className="valed">
                            <img src={logloimage} className="logoImage" />
                        </div>
                        <h4 className="ProfileT">884444XT444488</h4>
                    </div>
                    
                    <div className="fetures">
                        <Link className="link" to={"/signup"}>
                            Signup 
                        </Link>
                        <Link className="link" to={"/login"}>
                            Login 
                        </Link>
                        <Link className="link" to={"/"}>
                            about 
                        </Link>
                        <Link className="link" to={"/works"}>
                            works 
                        </Link>
                    </div>
                    
                    <div className="profile" onClick={() => {
                        setProfileTrue(true)
                    }}>
                        <img src={profileImagge} className="mark" />
                        <h3 className="ProfileT">Profile</h3>
                    </div>
                </div>
                {
                    profileTrue && (
                        <Profile setShowProfile={setProfileTrue} />
                    )
                }
            </div>
            
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgottenPassword" element={<ForgottenPassword />} />
                <Route path="/works" element={
                    <ProtectedRoute>
                        <Column />
                    </ProtectedRoute>
                } />
                <Route path="/editProfile" element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                } />
            </Routes>
        </>


    )


}






export default App
