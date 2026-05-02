import { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import Layout from '../../../components/Layout';
import { useAuth } from '../../../context/AuthContext';
  import useHotels from '../../../hooks/useHotels';

  const PropertyList = () => {
    const { user } = useAuth();
    const { hotels } = useHotels();
    const [selectedHotel, setSelectedHotel] = useState('ALL');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEntries, setShowEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'HOTEL',
    address: '',
    phone: '',
    fax: '',
    email: '',
    photo_url: '',
    logo_url: '',
    umh: 0,
    umk: 0,
    plafon_covid: '100%',
    sub_cabang: 0,
    t_tetap: 0,
    t_jabatan: 0,
    t_penempatan: 0,
    extrabed: 0,
    active: true
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showEntries]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProperties();
      setProperties(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch properties: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(prop => {
    const term = searchTerm.toLowerCase();
    const searchMatch = (
      prop.name?.toLowerCase().includes(term) ||
      prop.category?.toLowerCase().includes(term) ||
      prop.address?.toLowerCase().includes(term) ||
      prop.phone?.toLowerCase().includes(term) ||
      prop.code?.toLowerCase().includes(term)
    );
    
    const hotelMatch = selectedHotel === 'ALL' || prop.name === selectedHotel;
    
    return searchMatch && hotelMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / showEntries));
  const startIndex = (currentPage - 1) * showEntries;
  const endIndex = startIndex + showEntries;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const formatNumber = (num) => {
    if (!num) return '0';
    return Number(num).toLocaleString('id-ID');
  };

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      category: 'HOTEL',
      address: '',
      phone: '',
      fax: '',
      email: '',
      photo_url: '',
      logo_url: '',
      umh: 0,
      umk: 0,
      plafon_covid: '100%',
      sub_cabang: 0,
      t_tetap: 0,
      t_jabatan: 0,
      t_penempatan: 0,
      extrabed: 0,
      active: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      await apiService.createProperty(formData);
      setSuccessMessage('Property added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchProperties();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Failed to add property');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditClick = (property) => {
    setEditingProperty(property);
    setFormData({
      code: property.code || '',
      name: property.name || '',
      category: property.category || 'HOTEL',
      address: property.address || '',
      phone: property.phone || '',
      fax: property.fax || '',
      email: property.email || '',
      photo_url: property.photo_url || '',
      logo_url: property.logo_url || '',
      umh: property.umh || 0,
      umk: property.umk || 0,
      plafon_covid: property.plafon_covid || '100%',
      sub_cabang: property.sub_cabang || 0,
      t_tetap: property.t_tetap || 0,
      t_jabatan: property.t_jabatan || 0,
      t_penempatan: property.t_penempatan || 0,
      extrabed: property.extrabed || 0,
      active: property.active !== false
    });
    setShowEditModal(true);
    setSubmitError(null);
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      await apiService.updateProperty(editingProperty.id, formData);
      setSuccessMessage('Property updated successfully!');
      setShowEditModal(false);
      setEditingProperty(null);
      resetForm();
      fetchProperties();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Failed to update property');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId, propertyName) => {
    if (!window.confirm(`Are you sure you want to delete "${propertyName}"?`)) return;
    try {
      await apiService.deleteProperty(propertyId);
      setSuccessMessage('Property deleted successfully!');
      fetchProperties();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete property');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderModal = (isEdit = false) => {
    const isOpen = isEdit ? showEditModal : showAddModal;
    if (!isOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h2>

          {submitError && (
            <div style={{
              background: '#f8d7da',
              border: '1px solid #f5c6cb',
              color: '#721c24',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '14px'
            }}>
              {submitError}
            </div>
          )}

          <form onSubmit={isEdit ? handleUpdateProperty : handleAddProperty}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Code</label>
                <input type="text" name="code" value={formData.code}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Property Name *</label>
                <input type="text" name="name" value={formData.name}
                  onChange={handleInputChange} required
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category</label>
                <select name="category" value={formData.category}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                  <option value="HOTEL">HOTEL</option>
                  <option value="NON HOTEL">NON HOTEL</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                <input type="email" name="email" value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Address</label>
              <input type="text" name="address" value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone</label>
                <input type="text" name="phone" value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Fax</label>
                <input type="text" name="fax" value={formData.fax}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Photo URL</label>
                <input type="text" name="photo_url" value={formData.photo_url}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Logo URL</label>
                <input type="text" name="logo_url" value={formData.logo_url}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>UMH</label>
                <input type="number" name="umh" value={formData.umh}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>UMK</label>
                <input type="number" name="umk" value={formData.umk}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Plafon Covid</label>
                <input type="text" name="plafon_covid" value={formData.plafon_covid}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Sub Cabang</label>
                <input type="number" name="sub_cabang" value={formData.sub_cabang}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>T. Tetap</label>
                <input type="number" name="t_tetap" value={formData.t_tetap}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>T. Jabatan</label>
                <input type="number" name="t_jabatan" value={formData.t_jabatan}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>T. Penempatan</label>
                <input type="number" name="t_penempatan" value={formData.t_penempatan}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Extrabed</label>
                <input type="number" name="extrabed" value={formData.extrabed}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
                  <input type="checkbox" name="active" checked={formData.active}
                    onChange={handleInputChange}
                    style={{ width: '16px', height: '16px' }} />
                  Active
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  if (isEdit) setShowEditModal(false);
                  else setShowAddModal(false);
                  resetForm();
                  setSubmitError(null);
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  background: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: submitLoading ? '#6c757d' : '#28a745',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: submitLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '500'
                }}
              >
                {submitLoading ? 'Saving...' : (isEdit ? 'Update' : 'Add Property')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Check if user is admin or manager
  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <Layout>
        <div className="content-wrapper">
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#dc3545' }}>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="unified-reservation-container">
        {/* Header Controls */}
        <div className="unified-header-controls">
          <div className="header-row header-row-top">
            <div className="unified-header-left">
              <div className="header-title">
                <span>PROFIL HOTEL</span>
              </div>
              <button
                onClick={() => { resetForm(); setShowAddModal(true); setSubmitError(null); }}
                className="btn-table-action"
                style={{
                  background: '#007bff',
                  color: 'white',
                  padding: '6px 16px',
                  marginLeft: '20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                ADD
              </button>
              <button
                onClick={handlePrint}
                className="btn-table-action"
                style={{
                  background: '#6c757d',
                  color: 'white',
                  padding: '6px 16px',
                  marginLeft: '10px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Print
              </button>
            </div>
            <div className="unified-header-right">
              <div className="hotel-select">
                <label>Hotel :</label>
                <select className="header-hotel-select" value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
                  <option value="ALL">ALL</option>
                  {hotels.map(h => (
                    <option key={h.id} value={h.name}>{h.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="header-row header-row-bottom">
            <div className="unified-header-left">
              <div className="search-section">
                <label>Search :</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="unified-header-right">
              <div className="entries-control">
                <span className="entries-label">Show entries:</span>
                <select
                  className="entries-select"
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div style={{
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '12px 16px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Table Section */}
        <div className="unified-table-wrapper">
          <table className="reservation-table">
            <colgroup>
              <col style={{ width: '50px' }} />    {/* No */}
              <col style={{ width: '90px' }} />    {/* Categories */}
              <col style={{ width: '180px' }} />   {/* Property Name */}
              <col style={{ width: '220px' }} />   {/* Address */}
              <col style={{ width: '120px' }} />   {/* Phone */}
              <col style={{ width: '120px' }} />   {/* Fax */}
              <col style={{ width: '70px' }} />    {/* Photo */}
              <col style={{ width: '70px' }} />    {/* Logo */}
              <col style={{ width: '100px' }} />   {/* UMH */}
              <col style={{ width: '100px' }} />   {/* UMK */}
              <col style={{ width: '80px' }} />    {/* Plafon Covid */}
              <col style={{ width: '90px' }} />    {/* Sub Cabang */}
              <col style={{ width: '100px' }} />   {/* T. Tetap */}
              <col style={{ width: '100px' }} />   {/* T. Jabatan */}
              <col style={{ width: '110px' }} />   {/* T. Penempatan */}
              <col style={{ width: '70px' }} />    {/* Extrabed */}
              <col style={{ width: '100px' }} />   {/* Action */}
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>Categories</th>
                <th>Property Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Fax</th>
                <th>Photo</th>
                <th>Logo</th>
                <th style={{ textAlign: 'right' }}>UMH</th>
                <th style={{ textAlign: 'right' }}>UMK</th>
                <th>Plafon Covid</th>
                <th style={{ textAlign: 'right' }}>Sub Cabang</th>
                <th style={{ textAlign: 'right' }}>T. Tetap</th>
                <th style={{ textAlign: 'right' }}>T. Jabatan</th>
                <th style={{ textAlign: 'right' }}>T. Penempatan</th>
                <th style={{ textAlign: 'right' }}>Extrabed</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="17" className="no-data">Loading...</td>
                </tr>
              ) : currentProperties.length === 0 ? (
                <tr>
                  <td colSpan="17" className="no-data">
                    No data available in table
                  </td>
                </tr>
              ) : (
                currentProperties.map((prop, idx) => (
                  <tr key={prop.id}>
                    <td>{startIndex + idx + 1}</td>
                    <td>{prop.category}</td>
                    <td style={{ color: '#007bff', fontWeight: '500' }}>{prop.name}</td>
                    <td title={prop.address}>{prop.address}</td>
                    <td>{prop.phone}</td>
                    <td>{prop.fax}</td>
                    <td style={{ textAlign: 'center' }}>
                      {prop.photo_url ? (
                        <img src={prop.photo_url} alt="photo" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <span style={{ color: '#aaa', fontSize: '11px' }}>No img</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {prop.logo_url ? (
                        <img src={prop.logo_url} alt="logo" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }} />
                      ) : (
                        <span style={{ color: '#aaa', fontSize: '11px' }}>No logo</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(prop.umh)}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(prop.umk)}</td>
                    <td style={{ textAlign: 'center' }}>{prop.plafon_covid}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(prop.sub_cabang)}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(prop.t_tetap)}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(prop.t_jabatan)}</td>
                    <td style={{ textAlign: 'right' }}>{formatNumber(prop.t_penempatan)}</td>
                    <td style={{ textAlign: 'right' }}>{prop.extrabed}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEditClick(prop)}
                          className="btn-table-action"
                          style={{
                            background: '#ffc107',
                            color: '#212529',
                            padding: '4px 10px',
                            fontSize: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(prop.id, prop.name)}
                          className="btn-table-action"
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            padding: '4px 10px',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="unified-footer">
          <div className="entries-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} entries
            {searchTerm && ` (filtered from ${properties.length} total entries)`}
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>

        {/* Modals */}
        {renderModal(false)}
        {renderModal(true)}
      </div>
    </Layout>
  );
};

export default PropertyList;
