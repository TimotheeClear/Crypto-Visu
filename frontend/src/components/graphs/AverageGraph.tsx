// AverageGraph.jsx

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

const AverageGraph = ({ movingAverageData }: any) => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={movingAverageData}
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
            dataKey="average"
            strokeWidth={7}
            stroke="#82ca9d"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AverageGraph;
