'use client';

import RootLayout from '../app/layout';
import { useState } from 'react'

export default function Feedback() {
  return (
      <div className="content">
        <h1><strong className='blue_gradient'>Feedback</strong></h1>
        <form className="feedbackForm">
          <div className="formGroup">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
            />
          </div>
          <div className="formGroup">
            <label htmlFor="feedback">Feedback:</label>
            <textarea
              id="feedback"
              name="feedback"
              rows="5"
            ></textarea>
          </div>
          <button type="submit" className="submitButton">Submit</button>
        </form>
      </div>
    
  );
}
