import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChatContext } from "./context/chatContext";
import { JSX, useEffect, useReducer } from "react";
import { reducer } from "./context/reducer";
import { initialState } from "./context/initialState";
import { getAllChats, getAllUsers } from "./context/api";
import { ActionTypes } from "./context/types";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Layout from "./layouts/Layout";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = sessionStorage.getItem("token");
  return token ? children : <Navigate to="/Easy-Chat/login" replace />;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getAllChats().then((res) =>
      dispatch({ type: ActionTypes.putChats, payload: res })
    );
    getAllUsers().then((res) =>
      dispatch({ type: ActionTypes.putUsers, payload: res })
    );
  }, []);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/Easy-Chat/register" element={<Register />} />
          <Route path="/Easy-Chat/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ChatContext.Provider>
  );
}
