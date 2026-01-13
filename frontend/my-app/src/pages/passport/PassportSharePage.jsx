import React, { useEffect, useState, useCallback } from "react";
import { Card, Typography, Button, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function PassportSharePage() {
  const { shareId } = useParams();
  const navigate = useNavigate();

  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const res = await fetch(`/api/passport/share/${shareId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (ignore) return;

        if (data?.ok) setOwner(data.owner);
        else setOwner(null);
      } catch {
        if (!ignore) setOwner(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [shareId]);

  const join = useCallback(async () => {
    try {
      const res = await fetch(`/api/inner-circle/join/${shareId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!data?.ok) throw new Error("join failed");

      message.success("Added to Inner Circle ✅");
      navigate("/passport");
    } catch {
      message.error("Could not join (login may be required)");
    }
  }, [shareId, navigate]);

  return (
    <div className="passport-scope" style={{ padding: 18 }}>
      <Card className="osq-surface" bordered={false}>
        <Title level={3} style={{ marginTop: 0 }}>
          {loading
            ? "Loading..."
            : owner
            ? `${owner.name}'s Passport`
            : "Invalid link"}
        </Title>

        {owner ? (
          <>
            <Text type="secondary">
              You were invited to join their Inner Circle.
            </Text>

            <div style={{ marginTop: 14 }}>
              <Button type="primary" onClick={join}>
                Join Inner Circle
              </Button>
            </div>
          </>
        ) : (
          <Text type="secondary">This share link is invalid or expired.</Text>
        )}
      </Card>
    </div>
  );
}