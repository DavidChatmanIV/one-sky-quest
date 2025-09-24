import React, { useEffect, useRef, useState } from "react";
import { Empty } from "antd";
import PostItem from "./PostItem";
import { posts as MOCK_POSTS, FEED_DATA } from "./feedMock";

const FALLBACK_POSTS =
  (Array.isArray(FEED_DATA) && FEED_DATA.length && FEED_DATA) ||
  (Array.isArray(MOCK_POSTS) && MOCK_POSTS.length && MOCK_POSTS) ||
  [];

export default function PostList({ initialPosts = [] }) {
  const listRef = useRef(null);

  const [allPosts, setAllPosts] = useState(
    initialPosts.length ? initialPosts : FALLBACK_POSTS
  );
  const [activeTag, setActiveTag] = useState(null);
  const [posts, setPosts] = useState(allPosts);

  useEffect(() => {
    setAllPosts(initialPosts.length ? initialPosts : FALLBACK_POSTS);
  }, [initialPosts]);

  useEffect(() => {
    if (!activeTag) setPosts(allPosts);
    else setPosts(allPosts.filter((p) => p?.tags?.includes(activeTag)));
  }, [activeTag, allPosts]);

  const clearTag = () => setActiveTag(null);

  return (
    <div className="feed-list" ref={listRef}>
      {posts && posts.length > 0 ? (
        posts.map((post, idx) => (
          <PostItem key={post?.id || post?._id || idx} data={post} />
        ))
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              No posts yet
              {activeTag ? (
                <>
                  {" "}
                  for <strong>#{activeTag}</strong>.{" "}
                  <button
                    type="button"
                    onClick={clearTag}
                    style={{
                      border: "none",
                      background: "transparent",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: 0,
                      marginLeft: 4,
                    }}
                  >
                    Clear filter
                  </button>
                </>
              ) : (
                "."
              )}
            </span>
          }
        />
      )}
    </div>
  );
}
