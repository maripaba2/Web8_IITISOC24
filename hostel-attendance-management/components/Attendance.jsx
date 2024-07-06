'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Attendance() {
  const { data: session } = useSession();
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (session) {
      fetch(`/api/attendance/log?email=${session.user.email}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          setAttendanceLog(data);
        })
        .catch(error => {
          console.error('Error fetching attendance log:', error);
          setMessage('Error fetching attendance log');
        });
    }
  }, [session]);

  if (!session) {
    return (
      <div className="not-signed-in">
        <p className='message blue_gradient'>You need to be signed in to view this page</p>
        <button className="outline_btn" onClick={() => window.location.href = '/api/auth/signin'}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="content">
      <h1 className='blue_gradient'>Attendance Log</h1>
      {message && <p>{message}</p>}
      <div className="attendanceTable">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Marked At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceLog.length > 0 ? (
              attendanceLog.map((log, index) => {
                const markedAt = new Date(log.markedAt);
                const hours = markedAt.getHours();
                const isLate = (hours >= 23 || hours < 6);
                return (
                  <tr key={index}>
                    <td>{new Date(log.date).toLocaleDateString()}</td>
                    <td>{markedAt.toLocaleTimeString()}</td>
                    <td>{isLate ? 'Late' : 'In-Time'}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3">No attendance data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
