import React from "react";
import { Card, Tag, Tooltip, Button, Typography, Input } from "antd";
import {
  FireOutlined,
  TagOutlined, 
  CompassOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const DEFAULT_TOPICS = [
  { tag: "#Japan", hits: 128 },
  { tag: "#Kyoto", hits: 96 },
  { tag: "#HiddenGem", hits: 75 },
  { tag: "#Weekend", hits: 64 },
  { tag: "#Sunsets", hits: 58 },
  { tag: "#Foodie", hits: 51 },
];

const DEFAULT_HOTSPOTS = [
  { label: "Kyoto", emoji: "🎋", trend: "+42%" },
  { label: "Santorini", emoji: "🌅", trend: "+31%" },
  { label: "Puerto Rico", emoji: "🌴", trend: "+24%" },
  { label: "Seoul", emoji: "🛍️", trend: "+18%" },
];

export default function TrendingTopics({
  onTagSelect,
  topics = DEFAULT_TOPICS,
  hotspots = DEFAULT_HOTSPOTS,
  showSearch = false,
}) {
  return (
    <aside aria-label="Trending topics" className="space-y-4">
      <Card
        bordered={false}
        className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
        title={
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-400 text-white">
              <FireOutlined />
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              Trending
            </span>
          </div>
        }
        extra={
          onTagSelect && (
            <Button
              size="small"
              type="text"
              icon={<CloseOutlined />}
              onClick={() => onTagSelect(null)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-300"
            >
              Clear
            </Button>
          )
        }
      >
        {showSearch && (
          <Input
            allowClear
            placeholder="Search tags"
            prefix={<SearchOutlined />}
            className="!mb-3 rounded-full"
            onPressEnter={(e) => onTagSelect?.(e.currentTarget.value)}
          />
        )}

        <div className="flex flex-wrap gap-2">
          {topics.map(({ tag, hits }) => (
            <Tooltip key={tag} title={`${hits} mentions today`}>
              <Tag
                bordered
                onClick={() => onTagSelect?.(tag)}
                className="cursor-pointer rounded-full px-3 py-1 text-[12px] bg-white/60 dark:bg-white/5 border-slate-200/70 dark:border-white/10 hover:!border-slate-400/70 hover:!bg-white/80 dark:hover:!bg-white/10"
              >
                <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200">
                  <TagOutlined className="opacity-70" />
                  {/* was HashOutlined */}
                  {tag.replace(/^#/, "")}
                  <Text type="secondary" className="ml-1 text-[11px]">
                    {hits}
                  </Text>
                </span>
              </Tag>
            </Tooltip>
          ))}
        </div>
      </Card>

      <Card
        bordered={false}
        className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
        title={
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
              <CompassOutlined />
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              Today’s hotspots
            </span>
          </div>
        }
      >
        <ul className="space-y-2">
          {hotspots.map((h) => (
            <li key={h.label}>
              <button
                className="w-full text-left rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] hover:bg-white/90 dark:hover:bg-white/[0.08] px-3 py-2 transition flex items-center justify-between"
                onClick={() => onTagSelect?.(`#${h.label.replace(/\s+/g, "")}`)}
              >
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <span className="text-lg">{h.emoji}</span>
                  {h.label}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  {h.trend}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card
        bordered={false}
        className="rounded-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-1 ring-black/5"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              Submit a tip
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share a hidden gem and earn XP.
            </p>
          </div>
          <Button type="primary" size="small" className="rounded-full">
            Add tip
          </Button>
        </div>
      </Card>
    </aside>
  );
}
