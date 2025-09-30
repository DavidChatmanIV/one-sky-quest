import React from "react";
import { Button } from "antd";
import "./index.css"; // Tailwind styles

import TravelCard from "./components/travelCard";
// import AdminDashboard from "./pages/AdminDashboard"; // Uncomment if testing dashboard instead

function App() {
return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white text-gray-900">
    <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
        Welcome to One Sky Quest ✈️
        </h1>
        <p className="text-lg mt-2">Plan. Personalize. Pack.</p>

        {/* Tailwind Button */}
        <button className="mt-6 mr-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow-md transition-all duration-300">
        Build My Dream Trip
        </button>

        {/* Ant Design Button */}
        <Button type="primary" className="mt-6">
        AntD Button
        </Button>
    </header>

      {/* Travel Cards Section */}
    <section className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TravelCard
        title="Paris Getaway"
        location="Paris, France"
        description="Explore the City of Light with rich culture and cuisine."
        />
        <TravelCard
        title="Tokyo Adventure"
        location="Tokyo, Japan"
        description="Dive into high-tech life, anime, and sushi overload."
        />
    </section>

      {/* Uncomment this if testing admin dashboard view instead */}
      {/* <AdminDashboard /> */}
    </div>
);
}

export default App;
