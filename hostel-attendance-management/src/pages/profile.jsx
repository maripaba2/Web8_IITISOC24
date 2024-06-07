import Link from 'next/link';
import styles from '../styles/Profile.module.css';
import Layout from '../components/Layout';
export default function Profile() {
  return (
    <Layout>
      <div className={styles.profileContainer}>
        <div className={styles.mainMenu}>
          <Link href="/">
            <img src="/main-menu.png" alt="Main Menu" className={styles.menuIcon} />
          </Link>
        </div>
        <div className={styles.profileCard}>
          <img src='/lake.jpg' alt="Profile Photo" className={styles.profilePhoto} />
          <div className={styles.profileDetails}>
            <h2>Neelam Sai Sathwik</h2>
            <p><strong>Course:</strong> B.Tech</p>
            <p><strong>Department:</strong> Mathematics and Computing</p>
            <p><strong>Hostel:</strong> C V Raman</p>
            <p><strong>Roll No:</strong> 230041024</p>
            <p><strong>Email ID:</strong> mc230041024@iiti.ac.in</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
