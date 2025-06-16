import React, { useState } from "react";

const ReportUserButton = ({ reportedUserId, reporterUserId }) => {
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const handleReport = async () => {
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reporterUserId, reportedUserId, reason, comment }),
    });
    const data = await res.json();
    alert(data.message);
    setShowForm(false);
  };

  return (
    <>
      <button
        className="text-red-600 underline text-sm"
        onClick={() => setShowForm(!showForm)}
      >
        Report User
      </button>
      {showForm && (
        <div className="mt-2 space-y-2">
          <select
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Reason</option>
            <option value="abuse">Harassment</option>
            <option value="spam">Spam</option>
            <option value="impersonation">Impersonation</option>
          </select>
          <textarea
            placeholder="Details (optional)"
            className="w-full p-2 border rounded"
            onChange={(e) => setComment(e.target.value)}
        />
        <button
            onClick={handleReport}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Submit Report
          </button>
        </div>
      )}
    </>
  );
};

export default ReportUserButton;
