import React from "react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-gray-900">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-700">One Sky Quest</h1>
        <div className="space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full">
            Follow
          </button>
          <button className="bg-gray-100 px-4 py-2 rounded-full">
            Message
          </button>
        </div>
      </header>

      {/* Profile Card */}
      <main className="max-w-6xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src="/images/user-avatar.jpg"
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-200 object-cover"
          />

          <div className="flex-1">
            <div className="flex justify-between flex-wrap items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  David Martienz <span className="text-sky-600">✔️</span>
                </h2>
                <p className="text-sm text-gray-600">Explorer • 2,175 points</p>
              </div>
              <button className="bg-gray-100 px-4 py-2 rounded-lg mt-4 md:mt-0">
                + Add New Trip
              </button>
            </div>

            {/* Navigation Tabs */}
            <nav className="mt-6 border-b border-gray-200">
              <ul className="flex space-x-6 text-sm font-medium text-gray-600">
                <li>
                  <a
                    href="#"
                    className="pb-2 border-b-2 border-sky-500 text-blue-600"
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 pb-2">
                    My Trips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 pb-2">
                    Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 pb-2">
                    Media
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 pb-2">
                    Reviews
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 pb-2">
                    Wishlist
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 pb-2">
                    Settings
                  </a>
                </li>
              </ul>
            </nav>

            {/* Overview Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold mb-2">Bio</h3>
                <p className="text-gray-600 mb-3">
                  Travel enthusiast and adventure seeker. Exploring the world
                  one destination at a time.
                </p>
                <p className="text-sm text-gray-500">📍 United States</p>
                <p className="mt-4">
                  🏅 <strong>Points:</strong> 2,175
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <p>
                  🧭 Last Trip: <strong>Japan 2024</strong>
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-2">Dream Destinations</h3>
              <div className="flex gap-4">
                <img
                  src="/images/italy.jpg"
                  alt="Italy"
                  className="w-24 h-16 rounded-md object-cover"
                />
                <img
                  src="/images/peru.jpg"
                  alt="Peru"
                  className="w-24 h-16 rounded-md object-cover"
                />
                <img
                  src="/images/nz.jpg"
                  alt="New Zealand"
                  className="w-24 h-16 rounded-md object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
