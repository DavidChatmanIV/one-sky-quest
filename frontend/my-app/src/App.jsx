import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages (already wrapped in PageLayout)
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
// import other pages as needed...

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
};

export default App;
