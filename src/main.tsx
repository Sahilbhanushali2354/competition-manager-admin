import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Router } from "./common/config/router/router.config";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "./common/theme/ThemeProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider>
        <RouterProvider router={Router} />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
);
