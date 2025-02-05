import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StackedAreaGraph = ({ chartData }: { chartData: any[] }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // Extract open and close from the openClose array
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
          <p className="text-[#8884d8]">Open: {data.open}</p>
          <p className="text-[#82ca9d]">Close: {data.close}</p>
          <p className="text-[#ffc658]">High: {data.high}</p>
          <p className="text-[#ff7300]">Low: {data.low}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full flex flex-col">
      <h3 className="text-2xl dark:text-white mt-4 mb-2">Stacked Area Graph</h3>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
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
            cursor={{ fill: "transparent" }}
            content={<CustomTooltip />}
          />

          <Area
            type="monotone"
            dataKey="low"
            stackId="1"
            stroke="#ff7300"
            fill="#ff7300"
          />
          <Area
            type="monotone"
            dataKey="high"
            stackId="1"
            stroke="#ffc658"
            fill="#ffc658"
          />
          <Area
            type="monotone"
            dataKey="close"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
          />
          <Area
            type="monotone"
            dataKey="open"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedAreaGraph;
