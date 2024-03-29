import React from "react";
import * as ReactDOM from "react-dom/client";
import "./index.css";
import { MyContextProvider } from "./MainContext";
import App from './App'
import { token } from "./helpers/getCookie";
import  { API_URL } from './constants'

const fetchUserSession = async (token) => {
  try {
    const response = await fetch(`${API_URL}/get_session?id=${token}`, {
      method: "GET",
    });

    if (response.ok) {
      const userData = await response.json();
      return userData;
    } else {
      throw new Error("Failed to fetch user session");
    }
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
};

const initializeApp = async () => {

  let userData = null;

  if (token) {
    userData = await fetchUserSession(token);
  }

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <MyContextProvider userData={userData}>
        <App /> 
      </MyContextProvider>
    </React.StrictMode>
  );
  
};

initializeApp();


