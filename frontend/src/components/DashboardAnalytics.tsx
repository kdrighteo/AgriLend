import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "../styles/DashboardAnalytics.css";
import API_BASE_URL from "../config/api";

interface LoanData {
  _id: string;
  amount: number;
  status: string;
  purpose: string;
  createdAt: string;
  totalRepaid?: number;
}

interface AnalyticsData {
  statusDistribution: { name: string; value: number; color: string }[];
  monthlyApplications: {
    month: string;
    applications: number;
    approved: number;
  }[];
  loanPurposes: { name: string; value: number }[];
  repaymentProgress: { name: string; repaid: number; remaining: number }[];
}

const DashboardAnalytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    statusDistribution: [],
    monthlyApplications: [],
    loanPurposes: [],
    repaymentProgress: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"6months" | "1year">("6months");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/loans/my-loans`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const loans: LoanData[] = response.data;
      processAnalyticsData(loans);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (loans: LoanData[]) => {
    // Status distribution
    const statusCounts = loans.reduce(
      (acc, loan) => {
        acc[loan.status] = (acc[loan.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const statusColors: Record<string, string> = {
      pending: "#f59e0b",
      approved: "#10b981",
      funded: "#3b82f6",
      repaid: "#8b5cf6",
      rejected: "#ef4444",
    };

    const statusDistribution = Object.entries(statusCounts).map(
      ([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: statusColors[name] || "#6b7280",
      }),
    );

    // Monthly applications
    const months = timeRange === "6months" ? 6 : 12;
    const monthlyData: Record<
      string,
      { applications: number; approved: number }
    > = {};

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      monthlyData[monthKey] = { applications: 0, approved: 0 };
    }

    loans.forEach((loan) => {
      const loanDate = new Date(loan.createdAt);
      const monthKey = loanDate.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].applications++;
        if (
          loan.status === "approved" ||
          loan.status === "funded" ||
          loan.status === "repaid"
        ) {
          monthlyData[monthKey].approved++;
        }
      }
    });

    const monthlyApplications = Object.entries(monthlyData).map(
      ([month, stats]) => ({
        month,
        applications: stats.applications,
        approved: stats.approved,
      }),
    );

    // Loan purposes
    const purposeCounts = loans.reduce(
      (acc, loan) => {
        acc[loan.purpose] = (acc[loan.purpose] || 0) + loan.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const loanPurposes = Object.entries(purposeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Repayment progress
    const repaymentProgress = loans
      .filter(
        (loan) => loan.status === "funded" && loan.totalRepaid !== undefined,
      )
      .slice(0, 5)
      .map((loan) => ({
        name: loan.purpose.substring(0, 15) + "...",
        repaid: loan.totalRepaid || 0,
        remaining: loan.amount - (loan.totalRepaid || 0),
      }));

    setData({
      statusDistribution,
      monthlyApplications,
      loanPurposes,
      repaymentProgress,
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>📊 Dashboard Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as "6months" | "1year")}
          className="time-range-select"
        >
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      <div className="analytics-grid">
        {/* Status Distribution */}
        <div className="chart-card">
          <h3>Loan Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  value !== undefined ? value.toString() : "0"
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Applications */}
        <div className="chart-card">
          <h3>Monthly Applications</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.monthlyApplications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  value !== undefined ? value.toString() : "0"
                }
              />
              <Legend />
              <Bar dataKey="applications" fill="#166534" name="Applications" />
              <Bar dataKey="approved" fill="#22c55e" name="Approved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loan Purposes */}
        <div className="chart-card">
          <h3>Top Loan Purposes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.loanPurposes} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatCurrency} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip
                formatter={(value) =>
                  formatCurrency(
                    typeof value === "number"
                      ? value
                      : parseFloat(String(value)),
                  )
                }
              />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Repayment Progress */}
        <div className="chart-card">
          <h3>Repayment Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.repaymentProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Legend />
              <Bar dataKey="repaid" fill="#10b981" name="Repaid" stackId="a" />
              <Bar
                dataKey="remaining"
                fill="#e5e7eb"
                name="Remaining"
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
