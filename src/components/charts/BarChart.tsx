import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Rect, Text as SvgText } from "react-native-svg";

interface Bar {
  label: string;
  value: number; // 0-100 (pct)
  sublabel?: string;
}

interface Props {
  data: Bar[];
  color?: string;
  height?: number;
  emptyText?: string;
}

/**
 * Lightweight vertical bar chart (0-100%) built on react-native-svg.
 * Shows at most the last `maxBars` items, newest on the right.
 */
const MAX_BARS = 8;

export default function BarChart({
  data,
  color = "#2563EB",
  height = 160,
  emptyText = "No data yet",
}: Props) {
  const shown = data.slice(-MAX_BARS);

  if (shown.length === 0) {
    return (
      <View style={[styles.empty, { height }]}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  const width = 320;
  const padLeft = 8;
  const padBottom = 28;
  const chartH = height - padBottom;
  const slot = (width - padLeft * 2) / shown.length;
  const barW = Math.min(28, slot * 0.6);

  return (
    <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
      {shown.map((bar, i) => {
        const h = Math.max(2, (bar.value / 100) * (chartH - 16));
        const x = padLeft + slot * i + (slot - barW) / 2;
        const y = chartH - h;
        return (
          <React.Fragment key={`${bar.label}-${i}`}>
            <Rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={5}
              fill={color}
              opacity={0.9}
            />
            <SvgText
              x={x + barW / 2}
              y={y - 5}
              fontSize={10}
              fontWeight="700"
              fill="#334155"
              textAnchor="middle"
            >
              {bar.value}
            </SvgText>
            <SvgText
              x={x + barW / 2}
              y={height - 14}
              fontSize={8.5}
              fill="#64748B"
              textAnchor="middle"
            >
              {bar.label.length > 10
                ? `${bar.label.slice(0, 9)}…`
                : bar.label}
            </SvgText>
          </React.Fragment>
        );
      })}
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
