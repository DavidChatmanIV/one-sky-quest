import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import ProfileForm from "./components/ProfileForm";
import SavedTrips from "./components/SavedTrips";
import Explore from "./components/Explore";
import Dashboard from "./components/Dashboard";
import QuestFeed from "./components/QuestFeed";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/explore" element={<Explore />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfileForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/saved-trips"
            element={
              <PrivateRoute>
                <SavedTrips />
              </PrivateRoute>
            }
          />
          <Route
            path="/quest-feed"
            element={
              <PrivateRoute>
                <QuestFeed />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
