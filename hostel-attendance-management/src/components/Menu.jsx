import { useRouter } from 'next/router';
import styles from '../styles/Menu.module.css';

export default function Menu() {
  const router = useRouter();

  return (
    <div id="menu" className={styles.menu}>
      <div id="menu-items" className={styles.menuItems}>
        <div className={styles.menuItem} onClick={() => router.push('/profile')}>Profile</div>
        <div className={styles.menuItem} onClick={() => router.push('/dashboard')}>Dashboard</div>
        <div className={styles.menuItem} onClick={() => router.push('/attendance')}>Attendance Log</div>
        <div className={styles.menuItem} onClick={() => router.push('/face_recognition')}>Face Recognition</div>
        <div className={styles.menuItem} onClick={() => router.push('/feedback')}>Feedback</div>
      </div>
      <div id="menu-background-pattern" className={styles.menuBackgroundPattern}></div>
      <div id="menu-background-image" className={styles.menuBackgroundImage}></div>
    </div>
  );
}
