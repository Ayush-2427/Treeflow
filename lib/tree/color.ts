// lib/tree/color.ts
import type React from "react";

export const isHexColor = (v: unknown): v is string =>
  typeof v === "string" && /^#[0-9A-F]{6}$/i.test(v);

export const withAlpha = (hex: string, alphaHex: string) =>
  `${hex}${alphaHex}`.toUpperCase();

/**
 * Premium node styling:
 * - Base: medium tint (2E) + border (99)
 * - Hover: slightly stronger tint + soft glow
 * - Selected: stronger tint + stronger border + glow ring
 */
export function getNodeColorStyle(
  color: unknown,
  opts?: { selected?: boolean }
): {
  cardStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  badgeStyle?: React.CSSProperties;
  topBorderStyle?: React.CSSProperties;
  intensifyClassName: string;
} {
  const selected = !!opts?.selected;

  // Premium hover motion for all nodes (named colors too)
  const baseClasses =
    "transition-all duration-200 ease-out will-change-transform " +
    "hover:-translate-y-[2px] hover:scale-[1.01] hover:shadow-lg";

  if (!isHexColor(color)) {
    return {
      cardStyle: undefined,
      titleStyle: undefined,
      badgeStyle: undefined,
      topBorderStyle: undefined,
      intensifyClassName: baseClasses + (selected ? " ring-2 ring-slate-900/10 ring-offset-2" : ""),
    };
  }

  const hex = String(color).toUpperCase();

  const baseBg = withAlpha(hex, "2E");
  const baseBorder = withAlpha(hex, "99");

  const hoverBg = withAlpha(hex, "3D");
  const hoverBorder = withAlpha(hex, "B3");

  const selectedBg = withAlpha(hex, "4D");
  const selectedBorder = withAlpha(hex, "CC");

  // Premium glow using boxShadow, looks better than ring for colored nodes
  const glowSoft = `0 10px 30px ${withAlpha(hex, "33")}`;
  const glowHover = `0 14px 40px ${withAlpha(hex, "40")}`;
  const glowSelected = `0 0 0 4px ${withAlpha(hex, "26")}, 0 18px 48px ${withAlpha(
    hex,
    "4D"
  )}`;

  return {
    cardStyle: {
      backgroundColor: selected ? selectedBg : baseBg,
      borderColor: selected ? selectedBorder : baseBorder,
      boxShadow: selected ? glowSelected : glowSoft,
    },
    titleStyle: { color: hex },
    badgeStyle: { backgroundColor: hex },
    topBorderStyle: { borderTopColor: hex },
    // hover uses a real glow by switching via group-hover in node code, so we keep class here only for motion
    intensifyClassName:
      "group " + baseClasses + (selected ? " " : ""),
  };
}
