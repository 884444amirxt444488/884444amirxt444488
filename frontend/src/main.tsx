import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { UserProvider } from "./context/UserContext"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <UserProvider>
            <App />
        </UserProvider>
    </BrowserRouter>
)