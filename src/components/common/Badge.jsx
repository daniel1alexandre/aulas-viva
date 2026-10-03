import React from 'react';

export const Badge = ({ status, text }) => {
  const display = text || status;
  if (!display) return null;

  const normalized = String(status).toUpperCase().replace(/\s+/g, '_');
  const className = `badge badge-${normalized}`;

  return (
    <span className={className}>
      <span className="badge-dot" />
      {display}
    </span>
  );
};
