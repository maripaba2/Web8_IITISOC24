import { useState } from 'react';
import Link from 'next/link';
import '../styles/globals.css';

export default function Menu() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className={`menu activeIndex${activeIndex}`} onMouseLeave={handleMouseLeave}>
      <div className="menuItems">
        <MenuItem index={0} activeIndex={activeIndex} handleMouseEnter={handleMouseEnter}>
          Profile
        </MenuItem>
        <MenuItem index={1} activeIndex={activeIndex} handleMouseEnter={handleMouseEnter}>
          Dashboard
        </MenuItem>
        <MenuItem index={2} activeIndex={activeIndex} handleMouseEnter={handleMouseEnter}>
          Attendance Log
        </MenuItem>
        <MenuItem index={3} activeIndex={activeIndex} handleMouseEnter={handleMouseEnter}>
          Face Recognition
        </MenuItem>
        <MenuItem index={4} activeIndex={activeIndex} handleMouseEnter={handleMouseEnter}>
          Feedback
        </MenuItem>
      </div>
      <div className="menuBackgroundPattern"></div>
      <div className="menuBackgroundImage"></div>
    </div>
  );
}

function MenuItem({ index, activeIndex, handleMouseEnter, children }) {
  const paths = ['/profile', '/dashboard', '/attendance', '/face_recognition', '/feedback'];

  return (
    <Link href={paths[index]}>
      <div
        className={`menuItem ${index === activeIndex ? 'active' : ''}`}
        onMouseEnter={() => handleMouseEnter(index)}
      >
        {children}
      </div>
    </Link>
  );
}
