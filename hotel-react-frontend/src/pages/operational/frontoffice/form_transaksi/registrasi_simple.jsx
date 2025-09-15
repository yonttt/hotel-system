import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import Layout from '../../../../components/Layout'

const RegistrasiPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  return (
    <Layout>
      <div style={{ padding: '20px', background: 'white', minHeight: '100vh' }}>
        <h1>Registration Page</h1>
        <p>Welcome to the hotel registration form.</p>
        <p>Current user: {user?.username || 'Not logged in'}</p>
        
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Quick Test Form</h2>
          <form>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Guest Name:
              </label>
              <input 
                type="text" 
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px' 
                }}
                placeholder="Enter guest name"
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Phone Number:
              </label>
              <input 
                type="tel" 
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px' 
                }}
                placeholder="Enter phone number"
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Check-in Date:
              </label>
              <input 
                type="date" 
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px' 
                }}
              />
            </div>
            
            <button 
              type="submit" 
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Register Guest
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default RegistrasiPage