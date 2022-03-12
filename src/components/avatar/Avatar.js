import React from 'react';
import './Avatar.css';

export const Avatar = ({ src, size = '50px', border }) => {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, borderColor: border }}
    >
      <img src={src} alt="User Avatar" />
    </div>
  );
};
