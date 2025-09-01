import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { DataFrame } from "danfojs";
import Plot from "react-plotly.js";

export default function Dashboard({ setPage }) {
  const [df, setDf] = useState(null);
  const [filteredDf, setFilteredDf] = useState(null);
  const [filters, setFilters] = useState({
    merchant: [],
    category: [],
    startDate: "",
    endDate: "",
    showFraudOnly: false,
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data.map((row) => ({
            Transaction_ID: row.Transaction_ID,
            Date: row.Date,
            Amount: parseFloat(row.Amount) || 0,
            Merchant: row.Merchant || "Unknown",
            Category: row.Category || "Other",
            Time: row.Time || "00:00",
            Hour: parseInt((row.Time || "00:00").split(":")[0]),
          }));

          const dfObj = new DataFrame(data);

          // Compute fraud and reasons
          const fraudArr = dfObj.values.map((row) => {
            const Amount = row[dfObj.columns.indexOf("Amount")];
            const Hour = row[dfObj.columns.indexOf("Hour")];
            const Category = row[dfObj.columns.indexOf("Category")];

            const reasons = [];
            let fraud = 0;
            if (Amount > 50000) {
              reasons.push("High-value transaction");
              fraud = 1;
            }
            if (Hour < 6 || Hour > 22) {
              reasons.push("Odd transaction hour");
              fraud = 1;
            }
            if (["Luxury", "Gambling"].includes(Category)) {
              reasons.push("Risky category");
              fraud = 1;
            }

            return { fraud, reasons: reasons.join(", ") || "Legitimate" };
          });

          const fraudFlags = fraudArr.map((f) => f.fraud);
          const fraudReasons = fraudArr.map((f) => f.reasons);

          dfObj.addColumn("Fraud", fraudFlags, { inplace: true });
          dfObj.addColumn("Fraud_Reason", fraudReasons, { inplace: true });

          setDf(dfObj);
          setFilteredDf(dfObj);
        } catch (error) {
          console.error("Failed to process CSV", error);
          alert("CSV format is invalid. Please check the file.");
        }
      },
    });
  };

  const applyFilters = () => {
    if (!df) return;
    let tempDf = df;

    if (filters.merchant.length > 0)
      tempDf = tempDf.query(df["Merchant"].isin(filters.merchant));
    if (filters.category.length > 0)
      tempDf = tempDf.query(df["Category"].isin(filters.category));
    if (filters.startDate) tempDf = tempDf.query(df["Date"].ge(filters.startDate));
    if (filters.endDate) tempDf = tempDf.query(df["Date"].le(filters.endDate));
    if (filters.showFraudOnly) tempDf = tempDf.query(df["Fraud"].eq(1));

    setFilteredDf(tempDf);
    setSelectedTransaction(null);
  };

  if (!df) {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#1e293b)",
        color: "#f5f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* Heading */}
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: 800,
          marginBottom: "20px",
          textShadow: "3px 3px 15px rgba(0,0,0,0.7)",
          animation: "fadeIn 1s ease-in",
        }}
      >
        Fraud Detection Dashboard
      </h1>

      {/* Subheading */}
      <p
        style={{
          fontSize: "1.3rem",
          marginBottom: "50px",
          color: "#cbd5e1",
          maxWidth: "700px",
          animation: "fadeIn 1.5s ease-in",
        }}
      >
        Upload your transaction CSV to get instant insights and detect suspicious activity.
      </p>

      {/* Get Started / Upload Button */}
      <label
        htmlFor="csv-upload"
        style={{
          padding: "15px 40px",
          background: "linear-gradient(135deg,#1e40af,#2563eb)",
          borderRadius: "12px",
          fontWeight: 700,
          cursor: "pointer",
          color: "white",
          boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Upload CSV
      </label>
      <input
        type="file"
        accept=".csv"
        id="csv-upload"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      <button
          onClick={() => setPage("Home")}
          style={{
            marginTop: "30px",
            padding: "10px 20px",
            background: "#2563eb",
            borderRadius: "10px",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ← Back to Landing
        </button>

      {/* Fade-in Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}



  // KPIs
  const totalTx = filteredDf.shape[0];
  const fraudTx = filteredDf["Fraud"].values.filter((v) => v === 1).length;
  const fraudPct = ((fraudTx / totalTx) * 100).toFixed(2);
  const fraudCounts = [totalTx - fraudTx, fraudTx];

  // Fraud by category
  let fraudByCategory = { Category: [], Fraud: [] };
  try {
    const groupedDf = filteredDf.groupby(["Category"]).col(["Fraud"]).sum();
    fraudByCategory.Category = groupedDf["Category"].values;
    fraudByCategory.Fraud = groupedDf["Fraud_sum"].values;
  } catch (err) {
    console.error("Failed to compute fraud by category:", err);
  }

  const merchants = Array.from(new Set(df["Merchant"].values));
  const categories = Array.from(new Set(df["Category"].values));

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "'Segoe UI', sans-serif",
        background: "linear-gradient(135deg,#0f172a,#1e293b)",
        color: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "260px",
          padding: "20px",
          borderRight: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Filters</h2>

        <label>Merchant</label>
        <select
          multiple
          value={filters.merchant}
          onChange={(e) =>
            setFilters({
              ...filters,
              merchant: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
          style={{ width: "100%", marginBottom: "10px" }}
        >
          {merchants.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <label>Category</label>
        <select
          multiple
          value={filters.category}
          onChange={(e) =>
            setFilters({
              ...filters,
              category: Array.from(
                e.target.selectedOptions,
                (option) => option.value
              ),
            })
          }
          style={{ width: "100%", marginBottom: "10px" }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Start Date</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>End Date</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={filters.showFraudOnly}
              onChange={(e) =>
                setFilters({ ...filters, showFraudOnly: e.target.checked })
              }
            />{" "}
            Show Only Fraud
          </label>
        </div>

        <button
          onClick={applyFilters}
          style={{
            width: "100%",
            padding: "10px",
            background: "#2563eb",
            color: "white",
            borderRadius: "8px",
            marginTop: "10px",
            fontWeight: 600,
          }}
        >
          Apply Filters
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "30px" }}>
          📊 Fraud Detection Dashboard
        </h1>

        {/* KPI Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <AnimatedKpi title="Total Transactions" value={totalTx} />
          <AnimatedKpi title="Fraudulent Transactions" value={fraudTx} />
          <AnimatedKpi title="Fraud Percentage" value={fraudPct} />
        </div>

        {/* Charts */}
<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "50px",
    marginBottom: "30px",
  }}
>
  {/* Pie Chart */}
  <Plot
    data={[
      {
        values: fraudCounts,
        labels: ["Legitimate", "Fraud"],
        type: "pie",
        hole: 0.4,
        marker: { colors: ["#1e40af", "#f87171"] },
      },
    ]}
    layout={{
      width: 400,
      height: 400,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      title: { text: "Fraud vs Legit Transactions", font: { color: "white", size: 18 } },
    }}
  />

  {/* Bar Chart */}
  <Plot
    data={[
      {
        x: fraudByCategory.Category || [],
        y: fraudByCategory.Fraud || [],
        type: "bar",
        marker: { color: "#2563eb" },
      },
    ]}
    layout={{
      width: 500,
      height: 400,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      xaxis: { title: "Category", color: "white" },
      yaxis: { title: "Fraud Count", color: "white" },
      title: { text: "Fraud by Category", font: { color: "white", size: 18 } },
    }}
  />

  {/* Fraud Heatmap */}
  <Plot
    data={[
      {
        z: (() => {
          if (!filteredDf) return [];
          const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
          const heatmap = Array(7).fill(0).map(() => Array(24).fill(0));
          filteredDf.values.forEach((row) => {
            if (row[filteredDf.columns.indexOf("Fraud")] === 1) {
              const date = new Date(row[filteredDf.columns.indexOf("Date")]);
              const day = date.getDay();
              const hour = row[filteredDf.columns.indexOf("Hour")];
              heatmap[day][hour] += 1;
            }
          });
          return heatmap;
        })(),
        x: Array.from({ length: 24 }, (_, i) => i),
        y: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
        type: "heatmap",
        colorscale: "YlOrRd",
      },
    ]}
    layout={{
      width: 500,
      height: 400,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      title: { text: "Fraud Heatmap (Hour vs Day)", font: { color: "white", size: 18 } },
      xaxis: { title: "Hour of Day", color: "white" },
      yaxis: { title: "Day of Week", color: "white" },
    }}
  />
</div>


        {/* Table */}
        <div style={{ overflowX: "auto", width: "100%", maxWidth: "1000px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <thead style={{ background: "#1e293b", position: "sticky", top: 0 }}>
              <tr>
                {df.columns.map((col) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px",
                      borderBottom: "2px solid #2563eb",
                      textAlign: "left",
                      color: "white",
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDf.values.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    background:
                      row[df.columns.indexOf("Fraud")] === 1
                        ? "#f87171"
                        : i % 2 === 0
                        ? "#111827"
                        : "#1e293b",
                    cursor:
                      row[df.columns.indexOf("Fraud")] === 1 ? "pointer" : "default",
                  }}
                  onClick={() =>
                    row[df.columns.indexOf("Fraud")] === 1
                      ? setSelectedTransaction(row)
                      : null
                  }
                >
                  {row.map((val, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "10px",
                        color:
                          row[df.columns.indexOf("Fraud")] === 1 ? "white" : "#f5f7fa",
                      }}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Insights Panel */}
<div
  style={{
    marginTop: "40px",
    padding: "20px",
    borderRadius: "12px",
    background: "#1e293b",
    width: "100%",
    maxWidth: "800px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
  }}
>
  <h2 style={{ marginBottom: "15px" }}>💡 Insights & Tips</h2>
  {filteredDf && filteredDf.shape[0] > 0 ? (
    <ul style={{ listStyleType: "disc", paddingLeft: "20px", color: "#cbd5e1" }}>
      {/* Most fraud hours */}
      {(() => {
        const hours = filteredDf["Hour"].values.filter(
          (_, i) => filteredDf["Fraud"].values[i] === 1
        );
        if (hours.length > 0) {
          const counts = {};
          hours.forEach((h) => (counts[h] = (counts[h] || 0) + 1));
          const maxHour = Object.keys(counts).reduce((a, b) =>
            counts[a] > counts[b] ? a : b
          );
          return <li>Most fraud occurs around {maxHour}:00 hours.</li>;
        }
        return null;
      })()}

      {/* Category with highest fraud */}
      {(() => {
        const categories = filteredDf["Category"].values;
        const frauds = filteredDf["Fraud"].values;
        const counts = {};
        categories.forEach((c, i) => {
          if (frauds[i] === 1) counts[c] = (counts[c] || 0) + 1;
        });
        if (Object.keys(counts).length > 0) {
          const topCat = Object.keys(counts).reduce((a, b) =>
            counts[a] > counts[b] ? a : b
          );
          return <li>{topCat} category has the highest fraud occurrences.</li>;
        }
        return null;
      })()}

      {/* High-value transactions */}
      {(() => {
        const amounts = filteredDf["Amount"].values;
        const frauds = filteredDf["Fraud"].values;
        const highValueCount = amounts.filter((amt, i) => amt > 50000 && frauds[i] === 1)
          .length;
        if (highValueCount > 0)
          return <li>Several high-value transactions (>50,000) were flagged as fraud.</li>;
        return null;
      })()}
    </ul>
  ) : (
    <p style={{ color: "#94a3b8" }}>Upload your CSV to get insights.</p>
  )}
</div>


        {/* Fraud Inspector */}
        {selectedTransaction && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              borderRadius: "12px",
              background: "#1e293b",
              width: "100%",
              maxWidth: "600px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
            }}
          >
            <h2 style={{ marginBottom: "15px" }}>🚨 Fraud Inspector</h2>
            {df.columns.map((col, idx) => (
              <p key={idx}>
                <strong>{col}:</strong> {selectedTransaction[idx]}
                {col === "Fraud_Reason" &&
                  selectedTransaction[df.columns.indexOf("Fraud")] === 1 && (
                    <span style={{ color: "#f87171", fontWeight: "600" }}>
                      {" "}
                      ⚠ {selectedTransaction[idx]}
                    </span>
                  )}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// KPI Card Component
function AnimatedKpi({ title, value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    const duration = 800;
    const increment = end / (duration / 30);

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(counter);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 30);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <div
      style={{
        background: "linear-gradient(145deg,#111827,#1e293b)",
        padding: "20px 30px",
        borderRadius: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
        textAlign: "center",
        minWidth: "180px",
        transition: "transform 0.3s",
      }}
    >
      <p style={{ fontSize: "1rem", marginBottom: "10px", color: "#cbd5e1" }}>
        {title}
      </p>
      <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
        {displayValue}
        {title === "Fraud Percentage" ? "%" : ""}
      </h2>
    </div>
  );
}
