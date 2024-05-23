import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "tailwindcss/tailwind.css";
import { chartOptions } from "./chartConfig";

const App = () => {
  const [salaries, setSalaries] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "year",
    direction: "ascending",
  });
  const [selectedYear, setSelectedYear] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/salaries");
      setSalaries(response.data);
    };
    fetchData();
  }, []);

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedSalaries = [...salaries].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const handleRowClick = (year) => {
    setSelectedYear(year);
    const fetchJobTitles = async () => {
      const response = await axios.get(`/job-titles/${year}`);
      setJobTitles(response.data);
    };
    fetchJobTitles();
  };

  const lineData = {
    labels: salaries.map((salary) => salary.year),
    datasets: [
      {
        label: "Average Salary (USD)",
        data: salaries.map((salary) => salary.averageSalary),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
    ],
  };
  useEffect(()=>{
    console.log(sortedSalaries,'->sorted sal')
  },[sortedSalaries])

  return (
    <div className="App p-6">
      <h1 className="text-2xl font-bold mb-4">ML Engineer Salaries</h1>
      <div className="mb-6">
        <Line data={lineData} options={chartOptions} width={600} height={300} />
      </div>

      <div>
        <p className="mb-2 text-lg font-bold  text-cyan-800 p-2 rounded-md">
          Click on column headers to sort. Click on a year to see detailed job
          titles and counts.
        </p>
      </div>

      <table className="table-auto w-full mb-6">
        <thead>
          <tr>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => sortData("year")}
            >
              Year
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => sortData("totalJobs")}
            >
              Number of Jobs
            </th>
            <th
              className="px-4 py-2 cursor-pointer"
              onClick={() => sortData("averageSalary")}
            >
              Average Salary (USD)
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedSalaries.map((salary) => (
            <tr
              key={salary.year}
              onClick={() => handleRowClick(salary.year)}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="border px-4 py-2">{salary.year}</td>
              <td className="border px-4 py-2">{salary.totalJobs}</td>
              <td className="border px-4 py-2">{salary.averageSalary}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedYear && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Job Titles in {selectedYear}
          </h2>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Job Title</th>
                <th className="px-4 py-2">Number of Jobs</th>
              </tr>
            </thead>
            <tbody>
              {jobTitles.map((job) => (
                <tr key={job.title}>
                  <td className="border px-4 py-2">{job.title}</td>
                  <td className="border px-4 py-2">{job.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
