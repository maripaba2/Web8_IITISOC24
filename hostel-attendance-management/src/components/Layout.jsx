import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Hostel Attendance Management</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@400;500&display=swap" />
      </Head>
      <div className="logo-container">
        <img src="/logo.png" alt="Institute Logo" className="institute-logo" draggable="false" />
      </div>
      {children}
    </>
  );
}
