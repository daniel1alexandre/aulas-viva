import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      zIndex: 9999,
      maxWidth: '380px',
      width: '100%'
    }}>
      {toasts.map(toast => {
        let Icon = Info;
        let borderColor = '#06b6d4';
        let iconColor = '#06b6d4';
        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = '#10b981';
          iconColor = '#10b981';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = '#f59e0b';
          iconColor = '#f59e0b';
        } else if (toast.type === 'danger' || toast.type === 'error') {
          Icon = AlertCircle;
          borderColor = '#ef4444';
          iconColor = '#ef4444';
        }

        return (
          <div
            key={toast.id}
            style={{
              backgroundColor: '#0f172a',
              border: `1px solid ${borderColor}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#f8fafc',
              fontSize: '0.875rem',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <Icon size={20} style={{ color: iconColor, flexShrink: 0 }} />
            <div style={{ flex: 1, lineHeight: 1.4 }}>
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
