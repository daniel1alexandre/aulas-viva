import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = '#06b6d4', trend, onClick }) => {
  return (
    <div 
      className="stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div 
        className="stat-icon-wrapper" 
        style={{ 
          backgroundColor: `${color}18`, 
          border: `1px solid ${color}35` 
        }}
      >
        <Icon size={24} style={{ color }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.775rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </div>
        <div style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '1.65rem', 
          fontWeight: 800, 
          color: '#ffffff', 
          margin: '2px 0',
          letterSpacing: '-0.02em',
          lineHeight: 1.2
        }}>
          {value}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#cbd5e1' }}>
          {trend && (
            <span style={{ 
              fontWeight: 700, 
              color: trend.isPositive ? '#10b981' : '#ef4444' 
            }}>
              {trend.isPositive ? '↑' : '↓'} {trend.text}
            </span>
          )}
          <span>{subtitle}</span>
        </div>
      </div>
    </div>
  );
};
