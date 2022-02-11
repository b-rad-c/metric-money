import React from 'react';
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from "./App";
import HomePage from "./pages/Home";
import StreamingPage from "./pages/Streaming/StreamingPage"
import PayCyclePage from "./pages/PayCycle/PayCyclePage"

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="streaming" element={<StreamingPage />} />
        <Route path="pay-cycle" element={<PayCyclePage />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>Page not found!</p>
            </main>
          }
        />
      </Route>
    </Routes>

  </BrowserRouter>,
  rootElement
);