import Layout from '../components/Layout';
import styles from '../styles/Feedback.module.css';
import Link from 'next/link';
export default function Feedback() {
  return (
    <Layout>
      <Link href="/">
        <img src="/main-menu.png" alt="Main Menu" className={styles.menuIcon} />
      </Link>
      <div className={styles.content}>
        <h1>Feedback</h1>
        <form className={styles.feedbackForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="feedback">Feedback:</label>
            <textarea id="feedback" name="feedback" rows="5" required></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </div>
    </Layout>
  );
}
