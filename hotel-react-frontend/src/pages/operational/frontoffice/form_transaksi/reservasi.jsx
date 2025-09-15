import { useState, useEffect } from 'react'
import { useAuth } from '../../../../context/AuthContext'
import { apiService } from '../../../../services/api'
import Layout from '../../../../components/Layout'

const ReservasiPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      setLoading(true)
      const response = await apiService.getReservations()
      setReservations(response.data || [])
    } catch (error) {
      console.error('Error loading reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner">Memuat data reservasi...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="reservasi-container">
        <div className="page-header">
          <h1>Reservasi</h1>
          <p>Kelola reservasi hotel</p>
        </div>

        <div className="reservasi-content">
          <div className="actions-bar">
            <button className="btn btn-primary">
              Tambah Reservasi Baru
            </button>
            <button className="btn btn-secondary">
              Filter
            </button>
          </div>

          <div className="reservations-table">
            <table className="table">
              <thead>
                <tr>
                  <th>No. Reservasi</th>
                  <th>Nama Tamu</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Kamar</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length > 0 ? (
                  reservations.map((reservation, index) => (
                    <tr key={index}>
                      <td>{reservation.reservation_no}</td>
                      <td>{reservation.guest_name}</td>
                      <td>{reservation.arrival_date}</td>
                      <td>{reservation.departure_date}</td>
                      <td>{reservation.room_number}</td>
                      <td>
                        <span className={`status ${reservation.transaction_status?.toLowerCase()}`}>
                          {reservation.transaction_status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm">Edit</button>
                        <button className="btn btn-sm btn-danger">Hapus</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Tidak ada data reservasi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <style jsx>{`
          .reservasi-container {
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .page-header {
            margin-bottom: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
          }

          .page-header h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 5px;
          }

          .page-header p {
            color: #666;
            font-size: 14px;
          }

          .actions-bar {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: flex-start;
          }

          .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
          }

          .btn-primary {
            background-color: #007bff;
            color: white;
          }

          .btn-primary:hover {
            background-color: #0056b3;
          }

          .btn-secondary {
            background-color: #6c757d;
            color: white;
          }

          .btn-secondary:hover {
            background-color: #545b62;
          }

          .btn-sm {
            padding: 4px 8px;
            font-size: 12px;
            margin-right: 5px;
          }

          .btn-danger {
            background-color: #dc3545;
            color: white;
          }

          .btn-danger:hover {
            background-color: #c82333;
          }

          .reservations-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }

          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .table th {
            background-color: #f8f9fa;
            padding: 15px 10px;
            text-align: left;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #dee2e6;
          }

          .table td {
            padding: 12px 10px;
            border-bottom: 1px solid #dee2e6;
            color: #555;
          }

          .table tbody tr:hover {
            background-color: #f8f9fa;
          }

          .status {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
          }

          .status.pending {
            background-color: #fff3cd;
            color: #856404;
          }

          .status.confirmed {
            background-color: #d4edda;
            color: #155724;
          }

          .status.cancelled {
            background-color: #f8d7da;
            color: #721c24;
          }

          .text-center {
            text-align: center;
            color: #666;
            font-style: italic;
          }

          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
          }

          .loading-spinner {
            font-size: 16px;
            color: #666;
          }
        `}</style>
      </div>
    </Layout>
  )
}

export default ReservasiPage
