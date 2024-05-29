import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ weeklyData }) => {
  const chartData = {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    datasets: [
      {
        label: "Sales",
        data: weeklyData,
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(54,162,235,1)",
        borderWidth: 1,
      },
    ],
  };
  return <Bar data={chartData}></Bar>;
};

export default BarChart;
