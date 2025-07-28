import React, { useState } from "react";
import { Input, Button } from "antd";

const { TextArea } = Input;

const NewPostForm = ({ onPost }) => {
  const [text, setText] = useState("");

  const handlePost = () => {
    if (text.trim()) {
      onPost(text);
      setText("");
    }
  };

  return (
    <div className="mb-4">
      <TextArea
        rows={3}
        placeholder="Share your adventure..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="primary" className="mt-2" onClick={handlePost}>
        Post
      </Button>
    </div>
  );
};

export default NewPostForm;
