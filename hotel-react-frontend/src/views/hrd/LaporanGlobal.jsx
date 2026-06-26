import { useState, useEffect } from 'react';
import Layout from '../../ui/Layout';
import Button from '../../ui/Button';
import DataTable from '../../ui/DataTable';
import { useAuth } from '../../state/AuthContext';
import apiService from '../../api/api';

const LaporanGlobal = () => {
  useAuth();
  // Empty dates = show ALL customer data in the system (the API skips the
  // date filter when these are blank). Fill them in to narrow the range.
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activePreset, setActivePreset] = useState('all');
  const [loading, setLoading] = useState(false);
  const [hotelRevenue, setHotelRevenue] = useState([]);

  // Format a Date as YYYY-MM-DD using local time (avoids a UTC off-by-one).
  const toYMD = (d) => {
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  };

  // Quick period presets just fill From/To; the existing effect refetches.
  const applyPreset = (preset) => {
    const now = new Date();
    let start = '';
    let end = '';
    if (preset === 'today') {
      start = end = toYMD(now);
    } else if (preset === 'week') {
      // Current week, Monday through Sunday.
      const daysSinceMonday = (now.getDay() + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - daysSinceMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      start = toYMD(monday);
      end = toYMD(sunday);
    } else if (preset === 'month') {
      start = toYMD(new Date(now.getFullYear(), now.getMonth(), 1));
      end = toYMD(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    } else if (preset === 'year') {
      start = toYMD(new Date(now.getFullYear(), 0, 1));
      end = toYMD(new Date(now.getFullYear(), 11, 31));
    }
    setActivePreset(preset);
    setStartDate(start);
    setEndDate(end);
  };

  const PERIOD_PRESETS = [
    { key: 'today', label: 'Hari Ini' },
    { key: 'week', label: 'Minggu Ini' },
    { key: 'month', label: 'Bulan Ini' },
    { key: 'year', label: 'Tahun Ini' },
    { key: 'all', label: 'Semua' },
  ];

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
                  onChange={(e) => { setStartDate(e.target.value); setActivePreset('custom'); }}
                  className="header-hotel-select"
                  style={{ padding: '6px 12px' }}
                />
              </div>
              <div className="hotel-select" style={{ marginLeft: '10px' }}>
                <label>To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setActivePreset('custom'); }}
                  className="header-hotel-select"
                  style={{ padding: '6px 12px' }}
                />
              </div>
              {(startDate || endDate) && (
                <Button
                  variant="secondary"
                  size="sm"
                  style={{ marginLeft: '10px' }}
                  onClick={() => applyPreset('all')}
                >
                  Show All
                </Button>
              )}
              <Button variant="success" size="sm" style={{ marginLeft: '10px' }} onClick={() => window.print()}>Cetak</Button>
            </div>
          </div>

          {/* Quick period presets — weekly / monthly / yearly reports */}
          <div className="header-row" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, marginRight: '4px' }}>Periode:</span>
            {PERIOD_PRESETS.map((p) => (
              <Button
                key={p.key}
                variant={activePreset === p.key ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => applyPreset(p.key)}
              >
                {p.label}
              </Button>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#666' }}>
              {startDate || endDate
                ? `Menampilkan: ${startDate || '...'} s/d ${endDate || '...'}`
                : 'Menampilkan: Semua data'}
            </span>
          </div>
        </div>

        {/* Hotel Revenue Table */}
        <DataTable
          data={hotelRevenue}
          loading={loading}
          emptyText="No data available in table"
          rowKey={(item) => item.no}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '50px', render: (i) => i.no },
            { key: 'hotelName', header: 'Hotel Name',
              render: (i) => <span style={{ color: '#007bff', cursor: 'pointer' }}>{i.hotelName}</span> },
            { key: 'availableRooms', header: 'Availabe Rooms', align: 'right', render: (i) => i.availableRooms },
            { key: 'roomSales', header: 'Room Sales', align: 'right', render: (i) => i.roomSales },
            { key: 'occ', header: 'Occ', align: 'center', render: (i) => i.occ },
            { key: 'arr', header: 'ARR', align: 'right', render: (i) => formatNumber(i.arr) },
            { key: 'revFromNA', header: 'Rev From NA', align: 'right', render: (i) => formatNumber(i.revFromNA) },
            { key: 'totalCash', header: 'Total Cash Summary Report', align: 'right', render: (i) => formatNumber(i.totalCash) },
            { key: 'colection', header: 'Colection', align: 'right',
              render: (i) => <span style={{ color: '#007bff', cursor: 'pointer' }}>{formatNumber(i.colection)}</span> },
            { key: 'bankDist', header: 'Bank Distribution', align: 'right',
              render: (i) => <span style={{ color: '#007bff', cursor: 'pointer' }}>{formatNumber(i.bankDist)}</span> },
            { key: 'balance', header: 'Balance', align: 'right', render: (i) => formatNumber(i.balance) },
            { key: 'operationalExp', header: 'Operational Exp', align: 'right', render: (i) => formatNumber(i.operationalExp) },
            { key: 'nonOperationalExp', header: 'Non Operational Exp', align: 'right',
              render: (i) => <span style={{ color: '#007bff', cursor: 'pointer' }}>{formatNumber(i.nonOperationalExp)}</span> },
            { key: 'ownerReceive', header: 'Owner Receive/Exp', align: 'right',
              render: (i) => <span style={{ color: '#007bff', cursor: 'pointer' }}>{formatNumber(i.ownerReceive)}</span> },
            { key: 'totalExpense', header: 'Total Expense', align: 'right', render: (i) => formatNumber(i.totalExpense) },
            { key: 'netIncome', header: 'Net Income', align: 'right',
              render: (i) => <span style={{ color: i.netIncome < 0 ? '#dc3545' : 'inherit' }}>{formatNumber(i.netIncome)}</span> },
          ]}
          footer={(
            <tr>
              <td colSpan={2} className="dt-left">TOTAL</td>
              <td className="dt-right">{hotelTotals.availableRooms}</td>
              <td className="dt-right">{hotelTotals.roomSales}</td>
              <td className="dt-center">{hotelTotals.occ}</td>
              <td className="dt-right">{formatNumber(hotelTotals.arr)}</td>
              <td className="dt-right">{formatNumber(hotelTotals.revFromNA)}</td>
              <td className="dt-right">{formatNumber(hotelTotals.totalCash)}</td>
              <td className="dt-right">{formatNumber(hotelTotals.colection)}</td>
              <td className="dt-right">{formatNumber(hotelTotals.bankDist)}</td>
              <td className="dt-right">{formatNumber(hotelTotals.balance)}</td>
              <td className="dt-right">{formatNumber(hotelTotals.operationalExp)}</td>
              <td className="dt-right">{formatNumber(hotelTotals.nonOperationalExp)}</td>
              <td className="dt-right">{formatNumber(hotelTotals.ownerReceive)}</td>
              <td className="dt-right">{formatNumber(hotelTotals.totalExpense)}</td>
              <td className="dt-right" style={{ color: hotelTotals.netIncome < 0 ? '#dc3545' : 'inherit' }}>{formatNumber(hotelTotals.netIncome)}</td>
            </tr>
          )}
        />
      </div>
    </Layout>
  );
};

export default LaporanGlobal;
