import React, { useState } from "react";

const ReplyThread = ({ replies }) => (
<div className="ml-4 mt-2 space-y-2">
    {replies.map((reply, i) => (
    <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
        <p className="text-sm">{reply.text}</p>
    </div>
    ))}
<<<<<<< HEAD
</div>
=======
  </div>
>>>>>>> origin/fresh-start
);

export default ReplyThread;
