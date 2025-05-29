import React from "react";

export default function TravelCard({ title, location, description }) {
return (
    <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-sm transition hover:scale-105 hover:shadow-lg">
    <h3 className="text-xl font-semibold text-blue-600">{title}</h3>
    <p className="text-sm text-gray-500 mb-2">{location}</p>
    <p className="text-gray-700">{description}</p>
    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        View Details
    </button>
    </div>
);
}
