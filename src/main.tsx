// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <ThemeContextProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeContextProvider>
  // </React.StrictMode>
);