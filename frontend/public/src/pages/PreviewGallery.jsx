import React from "react";
import TravelCard from "../components/TravelCard";
import ProfilePage from "./ProfilePage";
import AdminLogin from "../components/AdminLogin";

export default function PreviewGallery() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-8 text-blue-600">
        🔍 One Sky Quest – Component Preview
      </h2>

      {/* Travel Cards */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">🌍 Travel Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TravelCard
            title="Paris Getaway"
            location="Paris, France"
            description="Explore the City of Light with rich culture and cuisine."
            image="https://source.unsplash.com/400x250/?paris"
          />
          <TravelCard
            title="Tokyo Adventure"
            location="Tokyo, Japan"
            description="Dive into high-tech life, anime, and sushi overload."
            image="https://source.unsplash.com/400x250/?tokyo"
          />
          <TravelCard
            title="Bali Retreat"
            location="Bali, Indonesia"
            description="Relax on the beach and embrace tropical serenity."
            image="https://source.unsplash.com/400x250/?bali"
          />
        </div>
      </section>

      {/* Profile Preview */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4">👤 Profile Page</h3>
        <ProfilePage
          user={{
            name: "Anna Santander",
            location: "Santa Fe, NM",
            avatar: "/images/anna.png",
            bio: "Travel enthusiast & sky kid",
            points: 230,
          }}
        />
      </section>

      {/* Admin Login Preview */}
      <section>
        <h3 className="text-xl font-semibold mb-4">🔐 Admin Login</h3>
        <AdminLogin onLoginSuccess={() => alert("✅ Logged in!")} />
      </section>
    </div>
  );
}
