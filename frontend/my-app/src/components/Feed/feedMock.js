// Simple mock data for the Quest Feed.
// Feel free to replace with API results later.

export const posts = [
  {
    id: "p-001",
    author: { name: "Questy", handle: "@questy" },
    text: "Welcome to One Sky Quest! Drop your dream trip below ✈️",
    createdAt: "2026-09-23T18:20:00Z",
    tags: ["welcome", "announcements"],
    likes: 12,
    replies: 3,
  },
  {
    id: "p-002",
    author: { name: "Sora", handle: "@sora" },
    text: "Budget-friendly weekend in Lisbon: trams, pasteis, and sunset at Miradouro!",
    createdAt: "2026-09-23T17:10:00Z",
    tags: ["europe", "budget"],
    likes: 28,
    replies: 7,
  },
  {
    id: "p-003",
    author: { name: "Traveler Jay", handle: "@jay" },
    text: "Tokyo in fall hits different 🍁—any must-try ramen spots?",
    createdAt: "2026-09-22T21:45:00Z",
    tags: ["asia", "foodie", "japan"],
    likes: 41,
    replies: 10,
  },
];

// Keep a second named export if you want a generic fallback name.
export const FEED_DATA = posts;
