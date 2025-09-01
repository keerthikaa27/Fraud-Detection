import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [page, setPage] = useState("Home");
  const [demoCSVLoaded, setDemoCSVLoaded] = useState(false);

  const loadDemoCSV = () => {
    setDemoCSVLoaded(true);
    setPage("Dashboard");
  };

  return (
    <>
      {page === "Home" && <LandingPage setPage={setPage} loadDemoCSV={loadDemoCSV} />}
      {page === "Dashboard" && <Dashboard setPage={setPage} demoCSVLoaded={demoCSVLoaded} />}
    </>
  );
}

