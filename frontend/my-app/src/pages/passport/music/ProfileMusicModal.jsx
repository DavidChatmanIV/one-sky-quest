import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Space,
  Typography,
  Input,
  Button,
  Segmented,
  message,
} from "antd";

const { Text } = Typography;

export const SKYRIO_PROFILE_MUSIC_KEY = "skyrio_profile_music_v1";

export default function ProfileMusicModal({ open, onClose, onSave }) {
  const [provider, setProvider] = useState("spotify");
  const [url, setUrl] = useState("");

  const placeholder = useMemo(() => {
    if (provider === "spotify")
      return "Paste Spotify track/playlist/album URL…";
    if (provider === "apple")
      return "Paste Apple Music song/album/playlist URL…";
    return "Paste YouTube / YouTube Music URL…";
  }, [provider]);

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(SKYRIO_PROFILE_MUSIC_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.provider) setProvider(saved.provider);
      if (saved?.url) setUrl(saved.url);
    } catch {
      // ignore
    }
  }, [open]);

  const save = () => {
    const trimmed = (url || "").trim();
    if (!trimmed) return message.error("Add a link first.");

    const payload = {
      provider,
      url: trimmed,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(SKYRIO_PROFILE_MUSIC_KEY, JSON.stringify(payload));
    message.success("Saved your profile music.");
    onSave?.(payload);
    onClose?.();
  };

  const clear = () => {
    localStorage.removeItem(SKYRIO_PROFILE_MUSIC_KEY);
    setUrl("");
    message.success("Cleared profile music.");
  };

  return (
    <Modal
      title="🎵 Profile Music"
      open={!!open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Text style={{ color: "rgba(255,255,255,.85)" }}>
          Soft launch: save one profile song link. Later we’ll add search +
          embeds.
        </Text>

        <Segmented
          value={provider}
          onChange={setProvider}
          options={[
            { label: "Spotify", value: "spotify" },
            { label: "Apple Music", value: "apple" },
            { label: "YouTube", value: "youtube" },
          ]}
        />

        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder}
          allowClear
        />

        <Space>
          <Button type="primary" onClick={save} className="btn-orange">
            Save
          </Button>
          <Button onClick={clear}>Clear</Button>
          <Button onClick={onClose} type="text">
            Cancel
          </Button>
        </Space>
      </Space>
    </Modal>
  );
}