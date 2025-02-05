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

const PriceGraph = ({ chartData }: any) => {
  return (
    <div className="w-full flex flex-col">
      <h3 className="text-2xl dark:text-white mt-4 mb-2">Price Graph</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
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
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#8884d8"
            strokeWidth={7}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceGraph;
