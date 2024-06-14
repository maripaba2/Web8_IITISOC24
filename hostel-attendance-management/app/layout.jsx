// app/layout.jsx
import Head from 'next/head';
import '@styles/globals.css';
import Nav from '@components/Nav';
import Provider from '@components/Provider';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <Head>
        <title>Hostel Attendance Management</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" />
      </Head>
      <body>
        <Provider>
          <div className='main'>
            <div className='gradient' />
          </div>
          <main className='app'>
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
