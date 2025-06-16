import React from "react";

const ProfilePage = ({ user }) => {
  if (!user) {
    return <p className="text-center text-gray-600">Loading profile...</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">🎒 Welcome, {user.name}!</h2>

      <section className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-28 h-28 rounded-full mx-auto shadow"
          />
          <h3 className="text-xl font-bold mt-2">{user.name}</h3>
          <p className="text-gray-600">{user.location}</p>
          <p className="text-blue-600">{user.bio}</p>
          <p className="mt-2 text-sm text-yellow-500 font-semibold">
            🏆 Points: {user.points}
          </p>
        </div>

        <div className="text-center">
          <img
            src="/images/sunset-photo.jpg"
            alt="Travel"
            className="rounded shadow mx-auto"
          />
          <button className="text-blue-600 hover:underline mt-2">
            View more photos
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">🌟 Interests</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <img
              src="/images/friend1.png"
              alt="Zoe"
              className="w-16 h-16 rounded-full mx-auto"
            />
            <p className="text-sm mt-1">Zoe</p>
          </div>
          {/* Add more friends here */}
        </div>
      </section>
    </main>
  );
};

export default ProfilePage;
