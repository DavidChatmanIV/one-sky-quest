import React, { useEffect, useState } from "react";
import { Avatar, Input, Button } from "antd";
import { LikeOutlined, LikeFilled } from "@ant-design/icons";

const DashboardContent = () => {
  const [settings, setSettings] = useState({
    layoutType: "card",
    showFeed: true,
    showTrips: true,
  });
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("osq_dashboard_settings"));
    if (saved) setSettings(saved);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const dummyTrips = [
    { id: 1, destination: "Tokyo", date: "2025-07-15" },
    { id: 2, destination: "Paris", date: "2025-08-03" },
  ];

  const dummyFeed = [
    {
      id: 1,
      user: "Anna",
      avatar: "/avatars/anna.png",
      activity: "booked a trip to Rome!",
    },
    {
      id: 2,
      user: "David",
      avatar: "/avatars/david.png",
      activity: "shared an itinerary to Iceland.",
    },
  ];

  const toggleLike = (id) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addComment = (id, text) => {
    if (!text.trim()) return;
    setComments((prev) => ({ ...prev, [id]: [...(prev[id] || []), text] }));
  };

  const startEdit = (feedId, index) => {
    setEditingComment({ feedId, index });
    setEditText(comments[feedId][index]);
  };

  const saveEdit = () => {
    const { feedId, index } = editingComment;
    const updated = [...comments[feedId]];
    updated[index] = editText;
    setComments((prev) => ({ ...prev, [feedId]: updated }));
    setEditingComment(null);
    setEditText("");
  };

  const deleteComment = (feedId, index) => {
    const updated = [...comments[feedId]];
    updated.splice(index, 1);
    setComments((prev) => ({ ...prev, [feedId]: updated }));
  };

  if (loading) return <p className="text-center">Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      {settings.showFeed && (
        <section>
          <h2 className="text-xl font-bold mb-3">🧭 Quest Feed</h2>
          <div className="space-y-4">
            {dummyFeed.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-xl shadow text-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Avatar src={item.avatar} />
                  <strong>{item.user}</strong> {item.activity}
                </div>
                <Button
                  icon={likes[item.id] ? <LikeFilled /> : <LikeOutlined />}
                  onClick={() => toggleLike(item.id)}
                  size="small"
                  className="mr-2"
                >
                  {likes[item.id] ? "Liked" : "Like"}
                </Button>
                <div className="mt-3 space-y-1">
                  {(comments[item.id] || []).map((c, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-2 text-gray-700"
                    >
                      {editingComment?.feedId === item.id &&
                      editingComment.index === i ? (
                        <div className="flex-1 flex gap-2">
                          <Input
                            size="small"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <Button size="small" onClick={saveEdit}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex-1">• {c}</div>
                      )}
                      {editingComment?.feedId !== item.id && (
                        <div className="text-xs flex gap-1">
                          <button
                            onClick={() => startEdit(item.id, i)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteComment(item.id, i)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Input.Search
                  placeholder="Write a comment"
                  enterButton="Post"
                  size="small"
                  onSearch={(val) => addComment(item.id, val)}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {settings.showTrips && (
        <section>
          <h2 className="text-xl font-bold mb-3">📌 Saved Trips</h2>
          <div
            className={
              settings.layoutType === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                : "space-y-3"
            }
          >
            {dummyTrips.map((trip) => (
              <div key={trip.id} className="p-4 bg-white rounded-xl shadow">
                <h3 className="text-lg font-semibold">{trip.destination}</h3>
                <p className="text-gray-500 text-sm">{trip.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default DashboardContent;
