import React from "react";

const emojis = [
{ label: "👍", type: "like" },
{ label: "❤️", type: "love" },
{ label: "😂", type: "laugh" },
{ label: "😮", type: "wow" },
{ label: "😢", type: "sad" },
{ label: "😡", type: "angry" },
];

const EmojiReactions = ({ counts = {}, onReact, points = 0 }) => {
return (
    <div className="flex flex-col gap-2">
    <div className="flex gap-3 text-xl">
        {emojis.map((emoji) => (
        <button
            key={emoji.type}
            onClick={() => onReact(emoji.type)}
            className="hover:scale-125 transition transform duration-150"
        >
            {emoji.label}
            {counts[emoji.type] > 0 && (
            <span className="ml-1 text-sm text-gray-600">
                {counts[emoji.type]}
            </span>
            )}
        </button>
        ))}
    </div>
    <div className="text-sm text-blue-700 font-semibold">
        Points: {points}
    </div>
    </div>
);
};

export default EmojiReactions;
