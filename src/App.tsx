import { BrowserRouter as Router } from "react-router-dom";
import Layout from "./layouts/Layout";
import { ChatContext } from "./context/chatContext";
import { useEffect, useReducer } from "react";
import { reducer } from "./context/reducer";
import { initialState } from "./context/initialState";
import { getAllChats, getAllUsers } from "./context/api";
import { ActionTypes } from "./context/types";

export default function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    getAllChats().then(res =>
      dispatch({ type: ActionTypes.putChats, payload: res })
    );
    getAllUsers().then(res =>
      dispatch({ type: ActionTypes.putUsers, payload: res })
    );
  }, []);
  


  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      <Router>
        <Layout />
      </Router>
    </ChatContext.Provider>
  );
}
