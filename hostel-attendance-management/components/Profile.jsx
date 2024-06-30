'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { data: session } = useSession();


  if (!session) {
    return (
      <div className="not-signed-in">
        <p className='message blue_gradient'>You need to be signed in to view this page</p>
        <button className="outline_btn" onClick={() => window.location.href = '/api/auth/signin'}>Sign in</button>
      </div>
    );
  }

  return (
    <section className='w-full'>
      <h1 className='head_text text-center'>
        <span className='blue_gradient'>Profile</span>
      </h1>

      <div className='profileContainer'>
        <div className='profileCard'>
          <img id="profile-photo" src={session.user.image} alt="Profile Photo" className='profilePhoto' draggable={false}/>
          <div className='profileDetails'>
            <h2>{session.user.name}</h2>
            <p><strong>Course:</strong>B.Tech</p>
            <p><strong>Email ID:</strong> {session.user.email}</p>
            <p><strong>Hostel:</strong>C V Raman</p>
          </div>
        </div>
      </div>
    </section>
  );
}
