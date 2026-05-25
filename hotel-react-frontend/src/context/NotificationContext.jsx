import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const showNotification = useCallback((type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Global Slide-in Notification from Right */}
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          right: notification.show ? '20px' : '-400px',
          width: '320px',
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          zIndex: 999999, // Ensure it is on top of modals
          transition: 'right 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          borderLeft: `4px solid ${notification.type === 'success' ? '#10b981' : '#ef4444'}`
        }}
      >
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          {notification.type === 'success' ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '600', color: '#1f2937' }}>
            {notification.type === 'success' ? 'Success' : 'Notification'}
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.4' }}>
            {notification.message}
          </p>
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
