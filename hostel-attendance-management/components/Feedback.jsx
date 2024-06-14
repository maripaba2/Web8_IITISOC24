'use client';

import RootLayout from '../app/layout';
import { useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function Feedback() {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/feedback', { name, email, feedback });
    if (response.data.success) {
      setMessage('Feedback submitted successfully');
    } else {
      setMessage('Failed to submit feedback');
    }
  };

  return (
    <RootLayout>
      <div className="content">
        <h1><strong className='blue_gradient'>Feedback</strong></h1>
        <form className="feedbackForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="feedback">Feedback:</label>
            <textarea
              id="feedback"
              name="feedback"
              rows="5"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="submitButton">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </RootLayout>
  );
}
