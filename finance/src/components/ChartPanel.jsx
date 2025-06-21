import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, Tooltip, Legend, CategoryScale, LinearScale } from "chart.js";
import api from "../api/axios";

// Register chart.js components
ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

const ChartPanel = () => {
  const [data, setData] = useState({ labels: [], values: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("transactions/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const grouped = {};

        res.data.forEach((txn) => {
          if (txn.type === 'expense') {
            grouped[txn.category] = (grouped[txn.category] || 0) + parseFloat(txn.amount);
          }
        });

        setData({
          labels: Object.keys(grouped),
          values: Object.values(grouped),
        });
      } catch (error) {
        console.error("Failed to fetch transaction data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Expenses by Category",
        data: data.values,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="card p-3 shadow">
      <h5 className="mb-3">Spending by Category</h5>
      <Bar data={chartData} />
    </div>
  );
};

export default ChartPanel;
