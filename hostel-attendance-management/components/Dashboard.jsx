'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const Dashboard = () => {
  const { data: session } = useSession();
  const [attendanceData, setAttendanceData] = useState(null);
  const [lateArrivalsData, setLateArrivalsData] = useState(null);
  const [earlyDeparturesData, setEarlyDeparturesData] = useState(null);
  const dashboardRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    if (session) {
      const fetchAttendanceData = async () => {
        try {
          const response = await fetch(`/api/attendance/log?email=${session.user.email}`);
          const logs = await response.json();
          processData(logs);
        } catch (error) {
          console.error('Error fetching attendance data:', error);
        }
      };

      const processData = (logs) => {
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const attendance = [0, 0, 0, 0];
        const lateArrivals = [0, 0, 0, 0];
        const earlyDepartures = [0, 0, 0, 0];

        logs.forEach(log => {
          const logDate = new Date(log.date);
          const weekIndex = Math.floor(logDate.getDate() / 7);
          const markedAt = new Date(log.markedAt);
          const markedHour = markedAt.getHours();

          if (markedHour >= 23 || markedHour < 7) {
            lateArrivals[weekIndex]++;
          }

          if (markedHour > 7 && markedHour < 9) {
            earlyDepartures[weekIndex]++;
          }

          attendance[weekIndex]++;
        });

        setAttendanceData({
          labels: weeks,
          datasets: [{
            label: 'Attendance',
            data: attendance,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        });

        setLateArrivalsData({
          labels: weeks,
          datasets: [{
            label: 'Late Arrivals',
            data: lateArrivals,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }]
        });

        setEarlyDeparturesData({
          labels: weeks,
          datasets: [{
            label: 'Early Departures',
            data: earlyDepartures,
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderColor: 'rgba(255, 206, 86, 1)',
            borderWidth: 1
          }]
        });
      };

      fetchAttendanceData();
    }
  }, [session]);

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const generatePDF = () => {
    const input = dashboardRef.current;
    const button = buttonRef.current;

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

      button.style.display = 'block';
      document.querySelector('.blue_gradient').style.display = 'block';
    });
  };

  if (!attendanceData || !lateArrivalsData || !earlyDeparturesData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboardContainer" ref={dashboardRef}>
      <div className="chartContainer">
        <h1><strong className='blue_gradient'>Attendance Dashboard</strong></h1>
        <Bar data={attendanceData} options={chartOptions} />
      </div>
      <div className="chartContainer">
        <Bar data={lateArrivalsData} options={chartOptions} />
      </div>
      <div className="chartContainer">
        <Bar data={earlyDeparturesData} options={chartOptions} />
      </div>
      <button ref={buttonRef} onClick={generatePDF} className="pdfButton">Generate PDF Report</button>
    </div>
  );
};

export default Dashboard;
