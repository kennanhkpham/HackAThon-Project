import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import SignUp from "./components/SignUp.jsx";
import AuthProvider from "./components/auth/AuthContext.jsx";
import Dashboard from "./components/Dashboard.jsx";

const router =createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "/dashboard",
        element: <Dashboard/>

    },
    {
        path: "/signup",
        element: <SignUp/>
    }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <AuthProvider>
          <RouterProvider router={router}/>
      </AuthProvider>
  </StrictMode>,
)
