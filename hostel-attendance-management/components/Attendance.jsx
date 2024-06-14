import RootLayout from '../app/layout'; 
import Link from 'next/link';

export default function Attendance() {
  return (
    <RootLayout>
      {/* <Link href="/">
        <img src="/assets/main-menu.png" alt="Main Menu" className={styles.menuIcon} />
      </Link> */}
      <div className="content">
        <h1>Attendance Log</h1>
        <div className="attendanceTable">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2023-05-01</td>
                <td>9:00AM</td>
                <td>10:30PM</td>
                <td>In-Time</td>
              </tr>
              <tr>
                <td>2023-05-02</td>
                <td>9:30AM</td>
                <td>11:30PM</td>
                <td>Late</td>
              </tr>
              <tr>
                <td>2023-05-03</td>
                <td>9:15AM</td>
                <td>10:45PM</td>
                <td>In-Time</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </RootLayout>
  );
}
