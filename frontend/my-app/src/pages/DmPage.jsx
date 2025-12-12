import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Typography,
  Input,
  Button,
  Avatar,
  Tooltip,
  Spin,
  Empty,
  Badge,
  Modal,
  message,
} from "antd";
import {
  SmileOutlined,
  SendOutlined,
  UserOutlined,
  MessageOutlined,
  UserAddOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import io from "socket.io-client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useAuth } from "../hooks/useAuth";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

// Base API URL for REST + sockets
const API_BASE = import.meta.env.VITE_API_URL || "";
const SOCKET_URL = API_BASE || window.location.origin;

// helper to add auth header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// small helper for "last seen" style text
function timeAgoString(dateLike) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "";

  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "yesterday";
  return `${diffDay}d ago`;
}

const DmPage = () => {
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [inputMsg, setInputMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  // image file for this message
  const [imageFile, setImageFile] = useState(null);

  // New Conversation modal state
  const [showNewConvoModal, setShowNewConvoModal] = useState(false);
  const [receiverIdInput, setReceiverIdInput] = useState("");
  const [creatingConvo, setCreatingConvo] = useState(false);

  // ---- Socket.io client (single connection) ----
  const socket = useMemo(
    () =>
      io(SOCKET_URL, {
        withCredentials: true,
      }),
    []
  );

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      try {
        socket.disconnect();
      } catch (e) {
        console.error("Socket disconnect error:", e);
      }
    };
  }, [socket]);

  // ---- Load conversations for current user ----
  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchConversations = async () => {
      try {
        setLoadingConvos(true);
        const res = await fetch(
          `${API_BASE}/api/dm/conversations/${currentUser._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load DMs");

        setConversations(data || []);
        // auto-select first conversation if none selected
        if (!selectedConversation && data.length > 0) {
          setSelectedConversation(data[0]);
        }
      } catch (err) {
        console.error("DM conversations load error:", err);
        message.error(err.message || "Could not load conversations.");
      } finally {
        setLoadingConvos(false);
      }
    };

    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?._id]);

  // ---- Load messages when a conversation is selected ----
  useEffect(() => {
    if (!selectedConversation?._id) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const res = await fetch(
          `${API_BASE}/api/dm/messages/${selectedConversation._id}?limit=100`,
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeaders(),
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load messages");
        setMessages(data || []);
      } catch (err) {
        console.error("DM messages load error:", err);
        message.error(err.message || "Could not load messages.");
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation?._id]);

  // ---- Socket join + listeners ----
  useEffect(() => {
    if (!selectedConversation?._id || !currentUser?._id) return;

    const conversationId = selectedConversation._id;

    // Join DM room (your server listens on "dm:join" and also generic "join_conversation")
    socket.emit("dm:join", { conversationId });
    socket.emit("join_conversation", {
      conversationId,
      userId: currentUser._id,
    });

    const handleNewMessage = (msg) => {
      if (String(msg.conversationId) === String(conversationId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleMessageReceived = (msg) => {
      if (String(msg.conversationId) === String(conversationId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleDmTyping = ({ fromUserId }) => {
      if (String(fromUserId) !== String(currentUser._id)) {
        setIsPartnerTyping(true);
        setTimeout(() => setIsPartnerTyping(false), 1500);
      }
    };

    const handleGenericTyping = ({ conversationId: cid, user }) => {
      if (!cid || String(cid) !== String(conversationId)) return;
      if (!user || String(user._id) === String(currentUser._id)) return;
      setIsPartnerTyping(true);
      setTimeout(() => setIsPartnerTyping(false), 1500);
    };

    socket.on("dm:newMessage", handleNewMessage);
    socket.on("message_received", handleMessageReceived);
    socket.on("dm:typing", handleDmTyping);
    socket.on("typing", handleGenericTyping);

    return () => {
      socket.off("dm:newMessage", handleNewMessage);
      socket.off("message_received", handleMessageReceived);
      socket.off("dm:typing", handleDmTyping);
      socket.off("typing", handleGenericTyping);
    };
  }, [socket, selectedConversation?._id, currentUser?._id]);

  // ---- Send typing event ----
  const handleTypingChange = (e) => {
    const value = e.target.value;
    setInputMsg(value);

    if (!selectedConversation?._id || !currentUser?._id) return;

    // DM-specific typing event
    socket.emit("dm:typing", {
      conversationId: selectedConversation._id,
      fromUserId: currentUser._id,
    });

    // Generic typing event for compatibility
    socket.emit("typing", {
      conversationId: selectedConversation._id,
      user: {
        _id: currentUser._id,
        name: currentUser.name || currentUser.username,
      },
    });
  };

  // ---- Image change handler ----
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  // ---- Send message (text and/or image) ----
  const handleSend = async () => {
    if (!selectedConversation?._id || !currentUser?._id) return;

    const trimmed = inputMsg.trim();
    if (!trimmed && !imageFile) return; // nothing to send

    try {
      let imageUrl;

      // 1) Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch(`${API_BASE}/api/uploads/image`, {
          method: "POST",
          headers: {
            // don't set Content-Type manually for FormData
            ...getAuthHeaders(),
          },
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.message || "Image upload failed");
        }

        imageUrl = uploadData.url;
      }

      // 2) Send DM message (text and/or image)
      const payload = {
        conversationId: selectedConversation._id,
        text: trimmed,
        imageUrl,
      };

      const res = await fetch(`${API_BASE}/api/dm/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const saved = await res.json();
      if (!res.ok) throw new Error(saved.error || "Failed to send message");

      // We rely on Socket.io (dm:newMessage or message_received) to append,
      // but we can also optimistically add:
      // setMessages((prev) => [...prev, saved]);

      // Also emit generic send_message so older listeners see it
      socket.emit("send_message", saved);

      setInputMsg("");
      setImageFile(null);
      setShowEmojiPicker(false);
    } catch (err) {
      console.error("Send DM error:", err);
      message.error(err.message || "Could not send message.");
    }
  };

  // ---- New Conversation flow ----
  const handleCreateConversation = async () => {
    if (!receiverIdInput.trim() || !currentUser?._id) return;

    try {
      setCreatingConvo(true);
      const payload = { receiverId: receiverIdInput.trim() };

      const res = await fetch(`${API_BASE}/api/dm/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to create conversation");

      // Add to list if it's not already there
      setConversations((prev) => {
        const exists = prev.find((c) => String(c._id) === String(data._id));
        if (exists) return prev;
        return [data, ...prev];
      });

      setSelectedConversation(data);
      setReceiverIdInput("");
      setShowNewConvoModal(false);
    } catch (err) {
      console.error("Create DM convo error:", err);
      message.error(err.message || "Could not create conversation.");
    } finally {
      setCreatingConvo(false);
    }
  };

  // ---- Helpers ----
  const getOtherParticipant = (convo) => {
    if (!convo?.participants || !currentUser?._id) return null;
    return (
      convo.participants.find(
        (p) => String(p._id) !== String(currentUser._id)
      ) || convo.participants[0]
    );
  };

  const renderMessageBubble = (msg, idx) => {
    // Support both schemas: senderId or sender
    const rawSender = msg.senderId !== undefined ? msg.senderId : msg.sender;

    const senderId =
      typeof rawSender === "object" && rawSender !== null
        ? rawSender._id
        : rawSender;

    const fromMe = String(senderId) === String(currentUser?._id);

    return (
      <div
        key={msg._id || idx}
        className={`flex ${fromMe ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`px-4 py-2 rounded-lg max-w-xs shadow-sm ${
            fromMe ? "bg-indigo-600 text-white" : "bg-white border"
          }`}
        >
          {/* Text (if any) */}
          {msg.text && (
            <div className="whitespace-pre-wrap break-words">{msg.text}</div>
          )}

          {/* Image (if any) */}
          {msg.imageUrl && (
            <div className={msg.text ? "mt-2" : ""}>
              <img
                src={msg.imageUrl}
                alt="attachment"
                className="max-w-[220px] rounded-lg"
              />
            </div>
          )}

          {/* Timestamp */}
          {msg.createdAt && (
            <div className="text-[10px] mt-1 opacity-70 text-right">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin tip="Loading user..." />
      </div>
    );
  }

  return (
    <>
      <Layout className="min-h-screen">
        {/* Sidebar – conversations list */}
        <Sider width={260} className="bg-white p-4 border-r">
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <Title level={4} className="!mb-0">
                💬 Direct Messages
              </Title>
              <MessageOutlined style={{ opacity: 0.6 }} />
            </div>
            <Tooltip title="Start a new conversation">
              <Button
                size="small"
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setShowNewConvoModal(true)}
              />
            </Tooltip>
          </div>

          {loadingConvos ? (
            <div className="flex items-center justify-center h-40">
              <Spin />
            </div>
          ) : conversations.length === 0 ? (
            <Empty
              description="No conversations yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <div className="space-y-2 mt-2">
              {conversations.map((convo) => {
                const other = getOtherParticipant(convo);
                const isActive =
                  selectedConversation &&
                  String(selectedConversation._id) === String(convo._id);

                const isOnline = other?.isOnline || other?.online;
                const lastSeen =
                  other?.lastSeen || convo.lastActivity || convo.updatedAt;

                return (
                  <div
                    key={convo._id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                      isActive ? "bg-gray-200" : ""
                    }`}
                    onClick={() => setSelectedConversation(convo)}
                  >
                    <Badge
                      dot={!!isOnline}
                      status={isOnline ? "success" : "default"}
                      offset={[-2, 40]}
                    >
                      <Avatar
                        src={other?.avatar}
                        icon={<UserOutlined />}
                        size="large"
                      />
                    </Badge>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">
                        {other?.username || "Traveler"}
                      </span>
                      {convo.lastMessage && (
                        <span className="text-xs text-gray-500 truncate max-w-[150px]">
                          {convo.lastMessage}
                        </span>
                      )}
                      {lastSeen && (
                        <span className="text-[11px] text-gray-400">
                          {isOnline
                            ? "Online now"
                            : `Last seen ${timeAgoString(lastSeen)}`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Sider>

        {/* Chat Area */}
        <Layout>
          <Content className="bg-gray-50 p-6 flex flex-col justify-between">
            {/* Header + messages */}
            <div className="mb-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <Title level={4} className="!mb-0">
                  {selectedConversation
                    ? `🧑‍💬 Chatting with ${
                        getOtherParticipant(selectedConversation)?.username ||
                        "Traveler"
                      }`
                    : "Select a conversation"}
                </Title>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 mt-4 max-h-[65vh] flex-1 overflow-y-auto pr-2">
                {loadingMessages && (
                  <div className="flex justify-center my-4">
                    <Spin />
                  </div>
                )}
                {!loadingMessages &&
                  messages.length === 0 &&
                  selectedConversation && (
                    <Text type="secondary">No messages yet. Say hi 👋</Text>
                  )}
                {!loadingMessages &&
                  messages.map((msg, idx) => renderMessageBubble(msg, idx))}

                {isPartnerTyping && (
                  <div className="text-xs text-gray-500 mt-1">✍️ Typing…</div>
                )}
              </div>
            </div>

            {/* Message Input + Image + Emoji */}
            <div className="relative">
              {/* Image preview (if selected) */}
              {imageFile && (
                <div className="mb-2 flex items-center gap-3 p-2 rounded-lg bg-white border shadow-sm max-w-sm">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="max-h-24 rounded-md"
                  />
                  <Button size="small" onClick={() => setImageFile(null)}>
                    Remove
                  </Button>
                </div>
              )}

              <Input.TextArea
                rows={2}
                value={inputMsg}
                onChange={handleTypingChange}
                placeholder="Type a message..."
                className="rounded-lg"
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={!selectedConversation}
              />
              <div className="absolute bottom-3 left-3 flex gap-2">
                {/* Emoji */}
                <Tooltip title="Emoji">
                  <Button
                    icon={<SmileOutlined />}
                    shape="circle"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    disabled={!selectedConversation}
                  />
                </Tooltip>

                {/* Image upload */}
                <Tooltip title="Attach image">
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                      disabled={!selectedConversation}
                    />
                    <Button
                      icon={<PictureOutlined />}
                      shape="circle"
                      disabled={!selectedConversation}
                    />
                  </label>
                </Tooltip>

                {/* Send */}
                <Tooltip title="Send">
                  <Button
                    icon={<SendOutlined />}
                    shape="circle"
                    type="primary"
                    onClick={handleSend}
                    disabled={
                      (!inputMsg.trim() && !imageFile) || !selectedConversation
                    }
                  />
                </Tooltip>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-20 left-3 z-50 max-w-xs rounded-xl border border-gray-300 shadow-md bg-white">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji) => {
                      setInputMsg((prev) => prev + emoji.native);
                      setShowEmojiPicker(false);
                    }}
                    theme="light"
                    emojiSize={20}
                    maxFrequentRows={2}
                    previewPosition="none"
                  />
                </div>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>

      {/* New Conversation Modal */}
      <Modal
        title="Start a new conversation"
        open={showNewConvoModal}
        onOk={handleCreateConversation}
        onCancel={() => setShowNewConvoModal(false)}
        okText="Create"
        confirmLoading={creatingConvo}
      >
        <p className="mb-2 text-sm text-gray-500">
          MVP: paste your friend&apos;s user ID here. Later we can upgrade this
          to a username / search UI.
        </p>
        <Input
          placeholder="Receiver user ID"
          value={receiverIdInput}
          onChange={(e) => setReceiverIdInput(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default DmPage;
