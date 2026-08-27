"use client";

import { useMemo } from "react";
import { HUNGER_THRESHOLDS, HUNGER_LABELS, STALE_DAYS } from "@/lib/constants";

const DAY_MS = 86_400_000;

function daysSince(dateStr) {
  if (!dateStr) return 0;
  const then = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(then.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - then.getTime()) / DAY_MS));
}

function hungerLevel(tokens) {
  const t = Number(tokens) || 0;
  if (t >= HUNGER_THRESHOLDS.high) return "high";
  if (t >= HUNGER_THRESHOLDS.medium) return "medium";
  return "low";
}

function couponName(blocker) {
  if (!blocker.coupon) return null;
  return typeof blocker.coupon === "string" ? blocker.coupon : blocker.coupon.name;
}

export default function BlockerPanel({ blockers = [], onResolve, onReopen }) {
  const sorted = useMemo(() => {
    return [...blockers].sort((a, b) => {
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      const hungerDiff = (b.hunger ?? 0) - (a.hunger ?? 0);
      if (hungerDiff !== 0) return hungerDiff;
      return daysSince(b.date) - daysSince(a.date);
    });
  }, [blockers]);

  const openCount = blockers.filter((b) => !b.resolved).length;

  return (
    <section className="panel blocker-panel" aria-labelledby="blocker-panel-title">
      <header className="panel-header">
        <h2 id="blocker-panel-title">Blockers</h2>
        <span className="panel-meta">
          {openCount} open · {blockers.length} total
        </span>
      </header>

      {sorted.length === 0 ? (
        <p className="panel-empty">
          No blockers on the menu. Paste a standup note to find some.
        </p>
      ) : (
        <ul className="blocker-list">
          {sorted.map((blocker) => {
            const level = hungerLevel(blocker.hunger);
            const age = daysSince(blocker.date);
            const stalled = !blocker.resolved && age >= STALE_DAYS;
            const highHunger = level === "high";
            const earned = couponName(blocker);

            return (
              <li
                key={blocker.id}
                className={[
                  "blocker-item",
                  `hunger-${level}`,
                  blocker.resolved ? "is-resolved" : "",
                  stalled ? "is-stalled" : ""
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="blocker-main">
                  <p className="blocker-text">{blocker.text}</p>
                  <p className="blocker-meta">
                    {blocker.contributor || "Unknown"} · {blocker.date || "undated"}
                    {age > 0 ? ` · ${age}d old` : ""}
                    {stalled ? " · stalled" : ""}
                  </p>
                </div>

                <div className="blocker-side">
                  <span className={`hunger-badge hunger-badge-${level}`}>
                    {HUNGER_LABELS[level]} · {Number(blocker.hunger) || 0} tokens
                  </span>

                  {blocker.resolved ? (
                    <div className="blocker-resolved">
                      <span className="resolved-check" aria-hidden="true">
                        ✓
                      </span>
                      <span className={`coupon-note${earned ? "" : " muted"}`}>
                        {earned ? `Earned: ${earned}` : "Resolved"}
                      </span>
                      {onReopen && (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => onReopen(blocker.id)}
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`btn ${highHunger ? "btn-coupon" : "btn-ghost"}`}
                      onClick={() => onResolve?.(blocker.id)}
                      aria-label={
                        highHunger
                          ? `Resolve blocker to earn a breakfast coupon: ${blocker.text}`
                          : `Resolve blocker: ${blocker.text}`
                      }
                    >
                      {highHunger ? "Resolve · earn coupon" : "Resolve"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}