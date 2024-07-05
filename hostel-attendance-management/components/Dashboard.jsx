'use client';

import React, { useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

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

  const dashboardRef = useRef();
  const buttonRef = useRef();

  const generatePDF = () => {
    const input = dashboardRef.current;
    const button = buttonRef.current;

    // Hide the button and the blue bar before taking the screenshot
    button.style.display = 'none';
    document.querySelector('.blue_gradient').style.display = 'none';

    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('attendance-report.pdf');

      // Show the button and the blue bar again after the screenshot is taken
      button.style.display = 'block';
      document.querySelector('.blue_gradient').style.display = 'block';
    });
  };

  return (
    <div className="dashboardContainer" ref={dashboardRef}>
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
      <button ref={buttonRef} onClick={generatePDF} className="pdfButton">Generate PDF Report</button>
    </div>
  );
};

export default Dashboard;
