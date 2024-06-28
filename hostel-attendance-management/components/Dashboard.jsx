'use client'; 

import { useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import Link from 'next/link';

const Dashboard = () => {
  const attendanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Attendance',
      data: [75, 80, 78, 85],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const lateArrivalsData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Late Arrivals',
      data: [5, 7, 3, 4],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };

  const earlyDeparturesData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Early Departures',
      data: [2, 3, 4, 1],
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  useEffect(() => {
    // Any additional setup or side effects if necessary
  }, []);

  return (
    <div className="dashboardContainer">
      {/* <Link href="/">
        <img src="/assets/icons/main-menu.png" alt="Main Menu" className="menuIcon" />
      </Link> */}
      <div className="chartContainer">
        <h1><strong className='blue_gradient'>Attendance Dashboard</strong></h1>
        <Line data={attendanceData} options={chartOptions} />
      </div>
      <div className="chartContainer">
        {/* <h2>Late Arrivals</h2> */}
        <Bar data={lateArrivalsData} options={chartOptions} />
      </div>
      <div className="chartContainer">
        {/* <h2>Early Departures</h2> */}
        <Bar data={earlyDeparturesData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
