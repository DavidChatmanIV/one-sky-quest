import { useEffect, useMemo, useState } from "react";

/**
 * useSkystreamFeed
 * - tab: "forYou" | "following" | "deals" | "news"
 * - search: string (client filter for MVP)
 * - userId: used via x-user-id header until JWT middleware is final
 */
export function useSkystreamFeed({ tab, search, userId, pageSize = 20 }) {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const endpoint = useMemo(() => {
    if (tab === "following") return "/api/skystream/following";
    return `/api/skystream/feed?category=${encodeURIComponent(tab)}`;
  }, [tab]);

  const headers = useMemo(() => {
    const h = {};
    if (userId) h["x-user-id"] = userId;
    return h;
  }, [userId]);

  function buildUrl({ cursor }) {
    // ✅ Works whether endpoint already has "?" or not
    const url = new URL(endpoint, window.location.origin);
    url.searchParams.set("limit", String(pageSize));
    if (cursor) url.searchParams.set("cursor", cursor);
    return url.pathname + url.search;
  }

  async function fetchPage({ cursor, append }) {
    const url = buildUrl({ cursor });

    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!res.ok || data?.ok === false) {
      throw new Error(data?.error || "Failed to load feed");
    }

    const newItems = data.items || [];
    const newCursor = data.nextCursor || null;

    setNextCursor(newCursor);
    setItems((prev) => (append ? [...prev, ...newItems] : newItems));
  }

  // Initial load / tab change
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        setItems([]);
        setNextCursor(null);

        await fetchPage({ cursor: null, append: false });
      } catch (e) {
        if (!cancelled) setError(e.message || "Error loading feed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, pageSize, userId]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      await fetchPage({ cursor: nextCursor, append: true });
    } catch (e) {
      setError(e.message || "Error loading more");
    } finally {
      setLoadingMore(false);
    }
  }

  // Client-side search filter (fast MVP)
  const filteredItems = useMemo(() => {
    const q = String(search || "")
      .trim()
      .toLowerCase();
    const qc = q.replace(/^#/, "");
    if (!qc) return items;

    return items.filter((p) => {
      const title = String(p.title || "").toLowerCase();
      const body = String(p.body || "").toLowerCase();
      const author = String(
        p.authorId?.username || p.authorId?.name || ""
      ).toLowerCase();
      const tags = (p.tags || []).map((t) => String(t).toLowerCase());

      return (
        title.includes(qc) ||
        body.includes(qc) ||
        author.includes(qc) ||
        tags.some((t) => t.replace(/^#/, "").includes(qc))
      );
    });
  }, [items, search]);

  return {
    items: filteredItems,
    rawItems: items,
    loading,
    loadingMore,
    error,
    nextCursor,
    loadMore,
    hasMore: !!nextCursor,
  };
}