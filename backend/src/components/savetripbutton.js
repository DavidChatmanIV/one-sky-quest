import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { saveTrip } from "../api";

export default function SaveTripButton() {
const { getAccessTokenSilently, isAuthenticated } = useAuth0();

const handleSaveTrip = async () => {
    if (!isAuthenticated) return alert("Please log in to save trips.");

    try {
    const token = await getAccessTokenSilently();
    const tripData = {
        destination: "Paris", // Replace with actual trip data
        date: "2025-08-01",
        notes: "Birthday vacation",
    };

    const response = await saveTrip(tripData, token);
    console.log("Trip saved:", response);
    alert("Trip saved successfully!");
    } catch (err) {
    console.error(" Error saving trip:", err);
    alert("Failed to save trip.");
    }
};

return (
    <button
    onClick={handleSaveTrip}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
    Save Trip
    </button>
);
}
