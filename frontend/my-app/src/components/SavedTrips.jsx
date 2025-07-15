import React, { useState } from "react";
import { Card, Empty } from "antd";
import { AnimatePresence } from "framer-motion";

const initialTrips = [
  {
    id: 1,
    title: "Paris Getaway",
    description: "A romantic trip to the city of lights.",
    imageUrl: "/images/paris.jpg",
    tag: "🌟 Most Viewed",
  },
  {
    id: 2,
    title: "Tokyo Adventure",
    description: "Explore Japan’s culture and cuisine.",
    imageUrl: "/images/tokyo.jpg",
    tag: "🆕 Recently Added",
  },
];

const SavedTrips = () => {
  const [trips, setTrips] = useState(initialTrips);

  const handleDelete = (id) => {
    setTrips((prev) => prev.filter((trip) => trip.id !== id));
  };

  return (
    <section className="px-4 md:px-8 pt-6 pb-10">
      <h2 className="text-2xl font-bold mb-4">💾 Saved Trips</h2>

      {trips.length === 0 ? (
        <Empty description="No saved trips yet" />
      ) : (
        <div className="flex flex-wrap gap-6">
          <AnimatePresence>
            {trips.map((trip) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <Card
                  hoverable
                  className="w-[280px] transition-transform duration-300 transform hover:scale-105"
                  cover={
                    <div className="relative">
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="rounded-t"
                      />
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow">
                        {trip.tag}
                      </span>
                    </div>
                  }
                >
                  <Card.Meta
                    title={trip.title}
                    description={trip.description}
                  />
                </Card>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
};

export default SavedTrips;
