// app/profile/page.jsx
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
  const { data: session } = useSession();
  const [attendanceMarked, setAttendanceMarked] = useState(false);

  useEffect(() => {
    if (session) {
      // Fetch attendance status
      axios.get('/api/attendance/status', { params: { email: session.user.email } })
        .then(response => {
          setAttendanceMarked(response.data.marked);
        });
    }
  }, [session]);

  const markAttendance = () => {
    // Logic for marking attendance with face recognition
    axios.post('/api/attendance/mark', { email: session.user.email })
      .then(() => {
        setAttendanceMarked(true);
      });
  };

  if (!session) {
    return <p>You need to be signed in to view this page</p>;
  }

  return (
    <section className='w-full'>
      <h1 className='head_text text-center'>
        <span className='blue_gradient'>Profile</span>
      </h1>

      <div className='profileContainer'>
        <div className='profileCard'>
          <img src={session.user.image} alt="Profile Photo" className='profilePhoto' />
          <div className='profileDetails'>
            <h2>{session.user.name}</h2>
            <p><strong>Course:</strong>B.Tech</p>
            <p><strong>Email ID:</strong> {session.user.email}</p>
            <p><strong>Hostel:</strong>C V Raman</p>
          </div>
          <div className='attendanceContainer'>
            {attendanceMarked ? (
              <p>Your attendance has already been marked</p>
            ) : (
              <button onClick={markAttendance}>Mark Attendance</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
