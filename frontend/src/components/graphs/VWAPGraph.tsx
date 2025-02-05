// PriceGraph.jsx

import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PriceData } from "../Body";

// Volume-Weighted Average Price (VWAP) is a trading benchmark used by traders
// that gives the average price a security has traded at throughout the day,
// based on both volume and price.

// VWAP Graph Component
const VWAPGraph = ({ vwapData }: { vwapData: PriceData[] }) => {
  return (
    <div className="w-full flex flex-col">
      <h3 className="text-2xl dark:text-white mt-4 mb-2">
        Volume Weighted Average Price (VWAP)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={vwapData}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(unixTime) =>
              new Date(unixTime).toLocaleDateString()
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(unixTime) =>
              new Date(unixTime).toLocaleDateString()
            }
            formatter={(value: number) => [`${value} USD`, "VWAP"]}
          />
          <Line
            type="monotone"
            dataKey="vwap"
            stroke="#f6e05e"
            strokeWidth={7}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VWAPGraph;
