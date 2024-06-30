'use client';

import { useState } from 'react';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.msg[0]);
      } else {
        setMessage(data.msg.join(', '));
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Error submitting feedback');
    }
  };

  return (
    <div className="content">
      <h1><strong className='blue_gradient'>Feedback</strong></h1>
      <form className="feedbackForm" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="feedback">Feedback:</label>
          <textarea
            id="feedback"
            name="feedback"
            rows="5"
            value={formData.feedback}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="submitButton">Submit</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
