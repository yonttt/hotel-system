import React from 'react';

const EvaGroupLogo = ({ size = 120, className = "" }) => {
  return (
    <div className={`eva-logo ${className}`} style={{ width: size, height: size }}>
      <div className="eva-logo-container">
        <div className="eva-logo-shape eva-logo-shape-1"></div>
        <div className="eva-logo-shape eva-logo-shape-2"></div>
        <div className="eva-logo-shape eva-logo-shape-3"></div>
        <div className="eva-logo-center"></div>
      </div>
      <style jsx>{`
        .eva-logo {
          position: relative;
          margin: 0 auto;
        }
        
        .eva-logo-container {
          width: 100%;
          height: 100%;
          position: relative;
          transform: rotate(45deg);
        }
        
        .eva-logo-shape {
          position: absolute;
          border-radius: 8px;
        }
        
        .eva-logo-shape-1 {
          width: 60%;
          height: 60%;
          background: #1e293b;
          top: 0;
          left: 0;
        }
        
        .eva-logo-shape-2 {
          width: 45%;
          height: 45%;
          background: #64748b;
          top: 20%;
          right: 0;
        }
        
        .eva-logo-shape-3 {
          width: 35%;
          height: 35%;
          background: #94a3b8;
          bottom: 0;
          right: 15%;
        }
        
        .eva-logo-center {
          position: absolute;
          width: 25%;
          height: 25%;
          background: white;
          top: 37.5%;
          left: 37.5%;
          border-radius: 4px;
          transform: rotate(-45deg);
        }
      `}</style>
    </div>
  );
};

export default EvaGroupLogo;