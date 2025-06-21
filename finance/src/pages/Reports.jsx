import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Report = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Fetch monthly income and expenses
    fetch("http://localhost:8000/api/reports/monthly/")
      .then((res) => res.json())
      .then((data) => setMonthlyData(data))
      .catch((err) => console.error("Monthly report error:", err));

    // Fetch spending by category
    fetch("http://localhost:8000/api/reports/category/")
      .then((res) => res.json())
      .then((data) => setCategoryData(data))
      .catch((err) => console.error("Category report error:", err));
  }, []);

  const barData = {
    labels: monthlyData.map((m) => m.month), // e.g. ["Jan", "Feb"]
    datasets: [
      {
        label: "Expenses",
        data: monthlyData.map((m) => m.expense),
        backgroundColor: "#dc3545",
      },
      {
        label: "Income",
        data: monthlyData.map((m) => m.income),
        backgroundColor: "#198754",
      },
    ],
  };

  const doughnutData = {
    labels: categoryData.map((c) => c.category),
    datasets: [
      {
        label: "Spending Breakdown",
        data: categoryData.map((c) => c.total),
        backgroundColor: ["#0d6efd", "#6f42c1", "#20c997", "#ffc107", "#fd7e14", "#6610f2"],
      },
    ],
  };

  return (
    <div>
      <h2 className="mb-4">Monthly Report</h2>

      <div className="mb-5">
        <h5>Income vs Expenses</h5>
        <Bar data={barData} />
      </div>

      <div className="mx-auto" style={{ maxWidth: "400px" }}>
        <h5>Spending by Category</h5>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
};

export default Report;
