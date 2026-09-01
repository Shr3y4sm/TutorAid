import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Line,
  Polyline,
  Text as SvgText,
} from "react-native-svg";

interface Point {
  label: string;
  value: number; // 0-100
}

interface Props {
  data: Point[];
  color?: string;
  height?: number;
  emptyText?: string;
}

/**
 * Lightweight score-trend line chart (0-100%) built on react-native-svg.
 * Shows at most the last `maxPoints` graded items in chronological order.
 */
const MAX_POINTS = 8;

export default function TrendLine({
  data,
  color = "#2563EB",
  height = 150,
  emptyText = "No graded assignments yet",
}: Props) {
  const shown = data.slice(-MAX_POINTS);

  if (shown.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  const width = 320;
  const padX = 20;
  const padBottom = 24;
  const chartH = height - padBottom - 12;
  const stepX =
    shown.length > 1 ? (width - padX * 2) / (shown.length - 1) : 0;

  const pts = shown.map((p, i) => ({
    x: padX + stepX * i,
    y: 12 + chartH - (p.value / 100) * chartH,
    ...p,
  }));

  const pointsAttr = pts
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* baseline */}
      <Line
        x1={padX}
        y1={12 + chartH}
        x2={width - padX}
        y2={12 + chartH}
        stroke="#E2E8F0"
        strokeWidth={1}
      />
      <Polyline
        points={pointsAttr}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map((p, i) => (
        <React.Fragment key={`${p.label}-${i}`}>
          <Circle cx={p.x} cy={p.y} r={4.5} fill={color} />
          <SvgText
            x={p.x}
            y={p.y - 10}
            fontSize={10}
            fontWeight="700"
            fill="#334155"
            textAnchor="middle"
          >
            {p.value}
          </SvgText>
          <SvgText
            x={p.x}
            y={height - 8}
            fontSize={8}
            fill="#64748B"
            textAnchor="middle"
          >
            {p.label.length > 8 ? `${p.label.slice(0, 7)}…` : p.label}
          </SvgText>
        </React.Fragment>
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 13,
  },
});
