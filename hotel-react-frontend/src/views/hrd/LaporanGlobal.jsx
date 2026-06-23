import { useState, useEffect } from 'react';
import Layout from '../../ui/Layout';
import Button from '../../ui/Button';
import { useAuth } from '../../state/AuthContext';
import apiService from '../../api/api';

const LaporanGlobal = () => {
  useAuth();
  // Empty dates = show ALL customer data in the system (the API skips the
  // date filter when these are blank). Fill them in to narrow the range.
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [hotelRevenue, setHotelRevenue] = useState([]);

  // Fetch data from API
  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const hotelResponse = await apiService.getHotelRevenue(startDate, endDate);
      if (hotelResponse.data.success) {
        setHotelRevenue(hotelResponse.data.data || []);
      } else {
        setHotelRevenue([]);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      setHotelRevenue([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when dates change
  useEffect(() => {
    fetchRevenueData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  // Calculate hotel totals
  const hotelTotals = {
    availableRooms: hotelRevenue.reduce((sum, item) => sum + (item.availableRooms || 0), 0),
    roomSales: hotelRevenue.reduce((sum, item) => sum + (item.roomSales || 0), 0),
    occ: hotelRevenue.length > 0 ? hotelRevenue[0]?.occ || '0%' : '0%',
    arr: hotelRevenue.reduce((sum, item) => sum + (item.arr || 0), 0),
    revFromNA: hotelRevenue.reduce((sum, item) => sum + (item.revFromNA || 0), 0),
    totalCash: hotelRevenue.reduce((sum, item) => sum + (item.totalCash || 0), 0),
    colection: hotelRevenue.reduce((sum, item) => sum + (item.colection || 0), 0),
    bankDist: hotelRevenue.reduce((sum, item) => sum + (item.bankDist || 0), 0),
    balance: hotelRevenue.reduce((sum, item) => sum + (item.balance || 0), 0),
    operationalExp: hotelRevenue.reduce((sum, item) => sum + (item.operationalExp || 0), 0),
    nonOperationalExp: hotelRevenue.reduce((sum, item) => sum + (item.nonOperationalExp || 0), 0),
    ownerReceive: hotelRevenue.reduce((sum, item) => sum + (item.ownerReceive || 0), 0),
    totalExpense: hotelRevenue.reduce((sum, item) => sum + (item.totalExpense || 0), 0),
    netIncome: hotelRevenue.reduce((sum, item) => sum + (item.netIncome || 0), 0),
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Header */}
        <div className="unified-header-controls" style={{ marginBottom: '20px' }}>
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>LAPORAN GLOBAL</span>
              </div>
            </div>
            <div className="unified-header-right">
              <div className="hotel-select">
                <label>Filter : From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="header-hotel-select"
                  style={{ padding: '6px 12px' }}
                />
              </div>
              <div className="hotel-select" style={{ marginLeft: '10px' }}>
                <label>To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="header-hotel-select"
                  style={{ padding: '6px 12px' }}
                />
              </div>
              {(startDate || endDate) && (
                <Button
                  variant="secondary"
                  size="sm"
                  style={{ marginLeft: '10px' }}
                  onClick={() => { setStartDate(''); setEndDate(''); }}
                >
                  Show All
                </Button>
              )}
              <Button variant="success" size="sm" style={{ marginLeft: '10px' }} onClick={() => window.print()}>Cetak</Button>
            </div>
          </div>
        </div>

        {/* Hotel Revenue Table */}
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Hotel Name</th>
                <th>Availabe Rooms</th>
                <th>Room Sales</th>
                <th>Occ</th>
                <th>ARR</th>
                <th>Rev From NA</th>
                <th>Total Cash Summary Report</th>
                <th>Colection</th>
                <th>Bank Distribution</th>
                <th>Balance</th>
                <th>Operational Exp</th>
                <th>Non Operational Exp</th>
                <th>Owner Receive/Exp</th>
                <th>Total Expense</th>
                <th>Net Income</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="16" className="no-data">Loading...</td>
                </tr>
              ) : hotelRevenue.length === 0 ? (
                <tr>
                  <td colSpan="16" className="no-data">No data available in table</td>
                </tr>
              ) : (
                <>
                  {hotelRevenue.map((item) => (
                    <tr key={item.no}>
                      <td>{item.no}</td>
                      <td style={{ color: '#007bff', cursor: 'pointer' }}>{item.hotelName}</td>
                      <td>{item.availableRooms}</td>
                      <td>{item.roomSales}</td>
                      <td>{item.occ}</td>
                      <td>{item.arr}</td>
                      <td>{formatNumber(item.revFromNA)}</td>
                      <td>{formatNumber(item.totalCash)}</td>
                      <td style={{ color: '#007bff', cursor: 'pointer' }}>{formatNumber(item.colection)}</td>
                      <td style={{ color: '#007bff', cursor: 'pointer' }}>{formatNumber(item.bankDist)}</td>
                      <td>{formatNumber(item.balance)}</td>
                      <td>{formatNumber(item.operationalExp)}</td>
                      <td style={{ color: '#007bff', cursor: 'pointer' }}>{formatNumber(item.nonOperationalExp)}</td>
                      <td style={{ color: '#007bff', cursor: 'pointer' }}>{formatNumber(item.ownerReceive)}</td>
                      <td>{formatNumber(item.totalExpense)}</td>
                      <td style={{ color: item.netIncome < 0 ? '#dc3545' : 'inherit' }}>{formatNumber(item.netIncome)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f8f9fa', fontWeight: 'bold' }}>
                    <td colSpan="2">TOTAL</td>
                    <td>{hotelTotals.availableRooms}</td>
                    <td>{hotelTotals.roomSales}</td>
                    <td>{hotelTotals.occ}</td>
                    <td>{formatNumber(hotelTotals.arr)}</td>
                    <td>{formatNumber(hotelTotals.revFromNA)}</td>
                    <td>{formatNumber(hotelTotals.totalCash)}</td>
                    <td>{formatNumber(hotelTotals.colection)}</td>
                    <td>{formatNumber(hotelTotals.bankDist)}</td>
                    <td>{formatNumber(hotelTotals.balance)}</td>
                    <td>{formatNumber(hotelTotals.operationalExp)}</td>
                    <td>{formatNumber(hotelTotals.nonOperationalExp)}</td>
                    <td>{formatNumber(hotelTotals.ownerReceive)}</td>
                    <td>{formatNumber(hotelTotals.totalExpense)}</td>
                    <td style={{ color: hotelTotals.netIncome < 0 ? '#dc3545' : 'inherit' }}>{formatNumber(hotelTotals.netIncome)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default LaporanGlobal;
