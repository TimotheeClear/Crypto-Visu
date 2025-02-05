// MoreInfoGraph.tsx
import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  Bar,
  BarChart,
  Cell,
} from "recharts";

const CustomCandlestick = (props: {
  x: number;
  y: number;
  width: number;
  height: number;
  low: number;
  high: number;
  openClose: [number, number];
}) => {
  const {
    x,
    y,
    width,
    height,
    low,
    high,
    openClose: [open, close],
  } = props;
  const isGrowing = open < close;
  const color = isGrowing ? "#4caf50" : "#f44336";
  const ratio = Math.abs(height / (open - close));
  return (
    <g stroke={color} fill={color} strokeWidth="2">
      <path
        d={`
            M ${x},${y}
            L ${x},${y + height}
            L ${x + width},${y + height}
            L ${x + width},${y}
            L ${x},${y}
          `}
      />
      {/* bottom line */}
      {isGrowing ? (
        <path
          d={`
              M ${x + width / 2}, ${y + height}
              v ${(open - low) * ratio}
            `}
        />
      ) : (
        <path
          d={`
              M ${x + width / 2}, ${y}
              v ${(close - low) * ratio}
            `}
        />
      )}
      {/* top line */}
      {isGrowing ? (
        <path
          d={`
              M ${x + width / 2}, ${y}
              v ${(close - high) * ratio}
            `}
        />
      ) : (
        <path
          d={`
              M ${x + width / 2}, ${y + height}
              v ${(open - high) * ratio}
            `}
        />
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    // Extract open and close from the openClose array
    const [open, close] = data.openClose;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p>Date: {new Date(data.date).toLocaleDateString()}</p>
        <p>Open: {open}</p>
        <p>Close: {close}</p>
        <p>High: {data.high}</p>
        <p>Low: {data.low}</p>
      </div>
    );
  }

  return null;
};

const prepareData = (data: any) => {
  return data.map(({ open, close, ...other }: any) => {
    return {
      ...other,
      openClose: [open, close],
    };
  });
};

const MoreInfoGraph = ({ chartData }: any) => {
  const data = prepareData(chartData);
  const minValue = data.reduce(
    (minValue: number, { low, openClose: [open, close] }: any) => {
      const currentMin = Math.min(low, open, close);
      return minValue === null || currentMin < minValue ? currentMin : minValue;
    },
    null
  );
  const maxValue = data.reduce(
    (maxValue: number, { high, openClose: [open, close] }: any) => {
      const currentMax = Math.max(high, open, close);
      return currentMax > maxValue ? currentMax : maxValue;
    },
    minValue
  );

  return (
    <div className="w-full flex flex-col">
      <h3 className="text-2xl dark:text-white mt-4 mb-2">
        Detailed Candlestick Graph
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(unixTime) =>
              new Date(unixTime).toLocaleDateString()
            }
          />
          <YAxis domain={[minValue, maxValue]} />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={<CustomTooltip />}
          />
          <Bar
            dataKey="openClose"
            shape={(props) => <CustomCandlestick {...props} />}
          >
            {data.map((entry: any, index: any) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.open < entry.close ? "green" : "red"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoreInfoGraph;
