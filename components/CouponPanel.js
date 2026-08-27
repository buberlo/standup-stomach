"use client";

import { useMemo } from "react";

const getRewardName = (coupon) =>
  coupon.reward || coupon.name || "Breakfast Coupon";

const getBlockerText = (coupon) =>
  coupon.blockerText || coupon.blocker || coupon.description || "";

const getHunger = (coupon) => {
  const value =
    coupon.hunger ?? coupon.hungerTokens ?? coupon.blockerHunger ?? 0;
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatDate = (value) => {
  if (!value) return "date unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "date unknown";

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const truncate = (value, max = 92) => {
  const text = String(value || "").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
};

const hungerClass = (hunger) => {
  if (hunger >= 80) return "hunger-critical";
  if (hunger >= 50) return "hunger-high";
  return "hunger-moderate";
};

export default function CouponPanel({
  coupons = [],
  onRedeem,
  title = "Breakfast Coupons",
}) {
  const sortedCoupons = useMemo(() => {
    if (!Array.isArray(coupons)) return [];

    return coupons
      .filter(Boolean)
      .sort((a, b) => {
        const aTime = new Date(a.earnedAt || a.resolvedAt || 0).getTime();
        const bTime = new Date(b.earnedAt || b.resolvedAt || 0).getTime();
        return bTime - aTime;
      });
  }, [coupons]);

  const readyCount = sortedCoupons.filter((coupon) => !coupon.redeemed).length;
  const redeemedCount = sortedCoupons.length - readyCount;
  const hungerResolved = sortedCoupons.reduce(
    (total, coupon) => total + getHunger(coupon),
    0
  );

  return (
    <section className="panel coupon-panel" aria-labelledby="coupon-panel-title">
      <header className="panel-header">
        <div>
          <h2 id="coupon-panel-title">{title}</h2>
          <p className="panel-subtitle">
            {readyCount} ready · {redeemedCount} redeemed ·{" "}
            {Math.round(hungerResolved)} hunger resolved
          </p>
        </div>
        <span className="coupon-total" aria-hidden="true">
          🥐 {readyCount}
        </span>
      </