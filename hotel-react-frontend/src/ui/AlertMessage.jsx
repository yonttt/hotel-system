/**
 * Reusable Alert Message component for displaying success/error/warning messages.
 * Eliminates duplicate styling code across multiple pages.
 * 
 * @param {string} type - Message type: 'success', 'error', 'warning', 'info'
 * @param {string} message - The message to display
 * @param {function} onClose - Optional callback to close/dismiss the message
 */
const AlertMessage = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      background: '#d4edda',
      border: '1px solid #c3e6cb',
      color: '#155724'
    },
    error: {
      background: '#f8d7da',
      border: '1px solid #f5c6cb',
      color: '#721c24'
    },
    warning: {
      background: '#fff3cd',
      border: '1px solid #ffeeba',
      color: '#856404'
    },
    info: {
      background: '#d1ecf1',
      border: '1px solid #bee5eb',
      color: '#0c5460'
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div style={{
      ...currentStyle,
      padding: '12px 16px',
      borderRadius: '4px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: currentStyle.color,
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0 5px'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
