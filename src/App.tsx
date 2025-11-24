import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { logout } from "./API/usersApi";
import { DeviceType, detectSmartphone } from "./utils/mobileCheck";

function AppRoutes() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const location = useLocation();
  const [deviceType, setDeviceType] = useState<DeviceType>(''as DeviceType);

  // BroadcastChannel listener (login/logout across tabs)
  useEffect(() => {
    const bc = new BroadcastChannel("auth");

    bc.onmessage = (event) => {
      if (event.data.type === "login") {
        setIsAuthenticated(true);
      }
      if (event.data.type === "logout") {
        setIsAuthenticated(false);
      }
    };

    return () => bc.close();
  }, []);

  useEffect(() => {
    const type = detectSmartphone();
    setDeviceType(type)
  }, [!localStorage.getItem('deviceType')]);

  // 🔥 GLOBAL SESSION CHECK
  const checkSession = () => {
    const sessionTime = sessionStorage.getItem("sessionTime")
    const sessionTimeNum = Number(sessionTime);

    if (sessionTime == 'null') {
      setIsAuthenticated(false);
      return;
    }

    const maxSessionDays = 7// your session limit
    const timeConverter = 1000 * 60 * 60 * 24 * 7 //
    const elapsedHours = (Date.now() - sessionTimeNum) / timeConverter


    if (elapsedHours >= maxSessionDays) {
      logout();

      const bc = new BroadcastChannel("auth");
      bc.postMessage({ type: "logout" });
      bc.close();

      setIsAuthenticated(false);
    }
  };

  // Run check ON LOAD
  useEffect(() => {
    checkSession();
  }, []);

  // Run check on every location change
  useEffect(() => {
    checkSession();
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  // Run check when other tabs modify storage
  useEffect(() => {
    const handleStorageChange = () => {
      checkSession();
      setIsAuthenticated(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Run check EVERY 20 seconds (optional but ensures realtime logout)
  useEffect(() => {
    const interval = setInterval(checkSession, 20000);
    return () => clearInterval(interval);
  }, []);


  return (
    <Routes>
      {/* Public pages */}
      <Route
        path="/Easy-Chat/login"
        element={isAuthenticated ? <Navigate to="/Easy-Chat/" /> : <Login deviceType = {deviceType}/>}
      />
      <Route
        path="/Easy-Chat/register"
        element={isAuthenticated ? <Navigate to="/Easy-Chat/" /> : <Register deviceType = {deviceType}/>}
      />

      {/* Protected pages */}
      <Route
        path="/Easy-Chat/*"
        element={
          isAuthenticated ? <Layout /> : <Navigate to="/Easy-Chat/login" />
        }
      />

      <Route path="*" element={<Navigate to="/Easy-Chat/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
