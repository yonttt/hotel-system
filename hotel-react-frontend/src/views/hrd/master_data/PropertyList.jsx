import { useState, useEffect } from 'react';
import { apiService } from '../../../api/api';
import Layout from '../../../ui/Layout';
import Button from '../../../ui/Button';
import DataTable from '../../../ui/DataTable';
import UnifiedTableHeader from '../../../ui/UnifiedTableHeader';
import UnifiedTableFooter from '../../../ui/UnifiedTableFooter';
import { useAuth } from '../../../state/AuthContext';
import useHotels from '../../../logic/useHotels';
import usePaginatedTable from '../../../logic/usePaginatedTable';
import { formatCurrencyIDR } from '../../../utils/formatters';

const PropertyList = () => {
  const { user } = useAuth();
  const { hotels } = useHotels();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredProperties, currentData: currentProperties,
    totalPages, startIndex, endIndex
  } = usePaginatedTable(properties, {
    searchFields: ['name', 'category', 'address', 'phone', 'code'],
    hotelField: 'name'
  });

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
      <div className="app-modal-overlay">
        <div className="app-modal-card">
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>
            {isEdit ? 'Edit Property' : 'Add New Property'}
          </h2>

          {submitError && (
            <div className="alert alert--error">
              {submitError}
            </div>
          )}

          <form onSubmit={isEdit ? handleUpdateProperty : handleAddProperty}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label className="field-label">Code</label>
                <input type="text" name="code" value={formData.code}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label">Property Name *</label>
                <input type="text" name="name" value={formData.name}
                  onChange={handleInputChange} required
                  className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label className="field-label">Category</label>
                <select name="category" value={formData.category}
                  onChange={handleInputChange}
                  className="form-input">
                  <option value="HOTEL">HOTEL</option>
                  <option value="NON HOTEL">NON HOTEL</option>
                </select>
              </div>
              <div>
                <label className="field-label">Email</label>
                <input type="email" name="email" value={formData.email}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Address</label>
              <input type="text" name="address" value={formData.address}
                onChange={handleInputChange}
                className="form-input"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label className="field-label">Phone</label>
                <input type="text" name="phone" value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label">Fax</label>
                <input type="text" name="fax" value={formData.fax}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label className="field-label">Photo URL</label>
                <input type="text" name="photo_url" value={formData.photo_url}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label">Logo URL</label>
                <input type="text" name="logo_url" value={formData.logo_url}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label className="field-label">UMH</label>
                <input type="number" name="umh" value={formData.umh}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label">UMK</label>
                <input type="number" name="umk" value={formData.umk}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label">Plafon Covid</label>
                <input type="text" name="plafon_covid" value={formData.plafon_covid}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label className="field-label">Sub Cabang</label>
                <input type="number" name="sub_cabang" value={formData.sub_cabang}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label">T. Tetap</label>
                <input type="number" name="t_tetap" value={formData.t_tetap}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label">T. Jabatan</label>
                <input type="number" name="t_jabatan" value={formData.t_jabatan}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
              <div>
                <label className="field-label">T. Penempatan</label>
                <input type="number" name="t_penempatan" value={formData.t_penempatan}
                  onChange={handleInputChange}
                  className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label className="field-label">Extrabed</label>
                <input type="number" name="extrabed" value={formData.extrabed}
                  onChange={handleInputChange}
                  className="form-input" />
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
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (isEdit) setShowEditModal(false);
                  else setShowAddModal(false);
                  resetForm();
                  setSubmitError(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="success" disabled={submitLoading}>
                {submitLoading ? 'Saving...' : (isEdit ? 'Update' : 'Add Property')}
              </Button>
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
          <div style={{ padding: '40px', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 style={{ color: 'var(--color-danger)' }}>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="unified-reservation-container">
        <UnifiedTableHeader
          title="PROFIL HOTEL"
          actions={(
            <>
              <Button variant="primary" size="sm" onClick={() => { resetForm(); setShowAddModal(true); setSubmitError(null); }}>ADD</Button>
              <Button variant="secondary" size="sm" onClick={handlePrint}>Print</Button>
            </>
          )}
          hotels={hotels}
          selectedHotel={selectedHotel}
          onHotelChange={setSelectedHotel}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showEntries={showEntries}
          onEntriesChange={setShowEntries}
        />

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="alert alert--success">{successMessage}</div>
        )}

        {error && (
          <div className="alert alert--error">{error}</div>
        )}

        {/* Table Section */}
        <DataTable
          data={currentProperties}
          loading={loading}
          emptyText="No data available in table"
          rowKey={(prop) => prop.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '50px',
              render: (_p, i) => startIndex + i + 1 },
            { key: 'category', header: 'Categories', render: (p) => p.category },
            { key: 'name', header: 'Property Name',
              render: (p) => <span style={{ color: '#007bff', fontWeight: 500 }}>{p.name}</span> },
            { key: 'address', header: 'Address', render: (p) => <span title={p.address}>{p.address}</span> },
            { key: 'phone', header: 'Phone', render: (p) => p.phone },
            { key: 'fax', header: 'Fax', render: (p) => p.fax },
            { key: 'photo', header: 'Photo', align: 'center', render: (p) => (
              p.photo_url
                ? <img src={p.photo_url} alt="photo" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                : <span style={{ color: '#aaa', fontSize: '11px' }}>No img</span>
            ) },
            { key: 'logo', header: 'Logo', align: 'center', render: (p) => (
              p.logo_url
                ? <img src={p.logo_url} alt="logo" style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }} />
                : <span style={{ color: '#aaa', fontSize: '11px' }}>No logo</span>
            ) },
            { key: 'umh', header: 'UMH', align: 'right', render: (p) => formatCurrencyIDR(p.umh) },
            { key: 'umk', header: 'UMK', align: 'right', render: (p) => formatCurrencyIDR(p.umk) },
            { key: 'plafon_covid', header: 'Plafon Covid', align: 'center', render: (p) => p.plafon_covid },
            { key: 'sub_cabang', header: 'Sub Cabang', align: 'right', render: (p) => formatCurrencyIDR(p.sub_cabang) },
            { key: 't_tetap', header: 'T. Tetap', align: 'right', render: (p) => formatCurrencyIDR(p.t_tetap) },
            { key: 't_jabatan', header: 'T. Jabatan', align: 'right', render: (p) => formatCurrencyIDR(p.t_jabatan) },
            { key: 't_penempatan', header: 'T. Penempatan', align: 'right', render: (p) => formatCurrencyIDR(p.t_penempatan) },
            { key: 'extrabed', header: 'Extrabed', align: 'right', render: (p) => p.extrabed },
            { key: 'action', header: 'Action', align: 'center', width: '120px', render: (p) => (
              <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                <Button variant="ghost" size="sm" onClick={() => handleEditClick(p)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteProperty(p.id, p.name)}>Delete</Button>
              </div>
            ) },
          ]}
        />

        <UnifiedTableFooter
          startIndex={startIndex}
          endIndex={endIndex}
          total={filteredProperties.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          extraInfo={searchTerm && ` (filtered from ${properties.length} total entries)`}
        />

        {/* Modals */}
        {renderModal(false)}
        {renderModal(true)}
      </div>
    </Layout>
  );
};

export default PropertyList;
