import React from "react";
import { Line } from "@ant-design/plots";

const LineChart = ({
  title = "Trend Analysis",
  data = [],
  height = 300,
  showGrid = true,
  animate = true,
}) => {
  // Default data if none provided
  const defaultData = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const config = {
    data: chartData,
    xField: "year",
    yField: "value",
    height,
    autoFit: true,
    animate: { enter: { animation: "wave-in" } },

    // Enhanced point configuration
    point: {
      shapeField: "circle",
      sizeField: 5,
      style: {
        fill: "#1677ff",
        lineWidth: 2,
        stroke: "#ffffff",
      },
    },

    // Smooth line
    smooth: true,

    // Grid configuration
    grid: {
      x: showGrid,
      y: showGrid,
    },

    // Enhanced tooltip
    interaction: {
      tooltip: {
        marker: true,
        render: (e, { title, items }) => {
          return (
            <div
              style={{
                padding: "8px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              <h4 style={{ margin: "0 0 4px", fontWeight: "bold" }}>{title}</h4>
              {items.map((item) => (
                <div key={item.name}>
                  <span style={{ color: item.color }}>{item.name}: </span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          );
        },
      },
    },

    // Styling improvements
    style: {
      lineWidth: 3,
      stroke: "#1677ff",
      opacity: 0.8,
    },

    // Axis configurations
    axis: {
      x: {
        title: "Year",
        titleFontSize: 12,
        labelFontSize: 11,
        labelRotate: -45,
        labelAutoRotate: true,
      },
      y: {
        title: "Value",
        titleFontSize: 12,
        labelFontSize: 11,
        gridLineDash: [4, 4],
        gridStroke: "#e5e7eb",
      },
    },

    // Legend configuration
    legend: {
      position: "top",
      itemName: {
        style: { fontSize: 12 },
      },
    },

    // Responsive configuration
    responsive: true,
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-sm p-4 mt-2">
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
        )}
        <Line {...config} />
      </div>
    </>
  );
};

export default LineChart;
