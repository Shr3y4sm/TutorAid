import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

interface Props {
  pct: number | null; // 0-100
  size?: number;
  color?: string;
  caption?: string;
  emptyText?: string;
}

/**
 * Attendance / performance ring. Renders an empty grey ring when pct is null.
 */
export default function ProgressRing({
  pct,
  size = 110,
  color = "#10B981",
  caption = "Attendance",
  emptyText = "—",
}: Props) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = pct == null ? 0 : Math.max(0, Math.min(100, pct));
  const dash = (filled / 100) * c;

  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size}>
        {/* track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#E2E8F0"
          strokeWidth={stroke}
          fill="none"
        />
        {/* value */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={pct == null ? "#CBD5E1" : color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <SvgText
          x={size / 2}
          y={size / 2 + 6}
          fontSize={size * 0.22}
          fontWeight="800"
          fill="#111827"
          textAnchor="middle"
        >
          {pct == null ? emptyText : `${pct}%`}
        </SvgText>
      </Svg>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
});
