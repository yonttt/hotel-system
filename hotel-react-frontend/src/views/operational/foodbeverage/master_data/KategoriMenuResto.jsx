import { useState, useEffect } from 'react';
import { apiService } from '../../../../api/api';
import Layout from '../../../../ui/Layout';
import Button from '../../../../ui/Button';
import DataTable from '../../../../ui/DataTable';
import UnifiedTableHeader from '../../../../ui/UnifiedTableHeader';
import UnifiedTableFooter from '../../../../ui/UnifiedTableFooter';
import { useAuth } from '../../../../state/AuthContext';
import useHotels from '../../../../logic/useHotels';
import usePaginatedTable from '../../../../logic/usePaginatedTable';

const KategoriMenuResto = () => {
  const { user } = useAuth();
  const { hotels } = useHotels();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    hotel_id: '',
    hotel_name: '',
    nama_kategori: '',
    description: ''
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getKategoriMenuResto();
      setCategories(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories: ' + (err.response?.data?.detail || err.message));
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const {
    searchTerm, setSearchTerm,
    showEntries, setShowEntries,
    currentPage, setCurrentPage,
    selectedHotel, setSelectedHotel,
    filteredItems: filteredCategories, currentData: currentCategories,
    totalPages, startIndex: indexOfFirstItem, endIndex: indexOfLastItem
  } = usePaginatedTable(categories, {
    searchFields: ['nama_kategori', 'hotel_name']
  });

  // Check if user has edit permission
  const canEdit = () => {
    return ['admin', 'manager'].includes(user?.role?.toLowerCase());
  };

  // Handle add new category
  const handleAddClick = () => {
    setFormData({
      hotel_id: hotels.length > 0 ? hotels[0].id : '',
      hotel_name: hotels.length > 0 ? hotels[0].name : '',
      nama_kategori: '',
      description: ''
    });
    setShowAddModal(true);
  };

  const handleAddSave = async () => {
    if (!formData.nama_kategori) {
      alert('Nama Kategori is required');
      return;
    }
    setProcessing(true);
    try {
      await apiService.createKategoriMenuResto(formData);
      setSuccessMessage('Category added successfully!');
      setShowAddModal(false);
      fetchCategories();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to add category: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle edit
  const handleEditClick = (category) => {
    if (!canEdit()) return;
    setEditingItem(category);
    setFormData({
      hotel_id: category.hotel_id || '',
      hotel_name: category.hotel_name || '',
      nama_kategori: category.nama_kategori || '',
      description: category.description || ''
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!formData.nama_kategori) {
      alert('Nama Kategori is required');
      return;
    }
    setProcessing(true);
    try {
      await apiService.updateKategoriMenuResto(editingItem.id, formData);
      setSuccessMessage('Category updated successfully!');
      setShowEditModal(false);
      setEditingItem(null);
      fetchCategories();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to update: ' + (err.response?.data?.detail || err.message));
    } finally {
      setProcessing(false);
    }
  };

  // Handle delete
  const handleDelete = async (category) => {
    if (!canEdit()) return;
    if (!confirm(`Are you sure you want to delete "${category.nama_kategori}"?`)) return;
    
    try {
      await apiService.deleteKategoriMenuResto(category.id);
      setSuccessMessage('Category deleted successfully!');
      fetchCategories();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingItem(null);
  };

  return (
    <Layout>
      <div className="unified-reservation-container">
        <UnifiedTableHeader
          title="KATEGORI MENU RESTO"
          actions={canEdit() && (
            <Button variant="primary" size="sm" onClick={handleAddClick}>+ New Category</Button>
          )}
          hotels={hotels}
          selectedHotel={selectedHotel}
          onHotelChange={setSelectedHotel}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showEntries={showEntries}
          onEntriesChange={setShowEntries}
        />

        {/* Table Section */}
        <DataTable
          data={currentCategories}
          loading={loading}
          error={error}
          emptyText="No data available in table"
          rowKey={(category) => category.id}
          columns={[
            { key: 'no', header: 'No', align: 'center', width: '80px',
              render: (_c, i) => indexOfFirstItem + i + 1 },
            { key: 'nama_kategori', header: 'Nama Kategori',
              render: (c) => <span style={{ fontWeight: 500 }}>{c.nama_kategori}</span> },
            ...(canEdit() ? [{
              key: 'aksi', header: 'Aksi', align: 'center', width: '160px',
              render: (c) => (
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(c)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(c)}>Delete</Button>
                </div>
              )
            }] : [])
          ]}
        />

        <UnifiedTableFooter
          startIndex={indexOfFirstItem}
          endIndex={indexOfLastItem}
          total={filteredCategories.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          showPageNumbers
          pageWindowSize={5}
        />
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '4px',
          zIndex: 1001,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          {successMessage}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '25px',
            width: '450px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Add New Category
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Hotel</label>
              <input
                type="text"
                value={formData.hotel_name}
                onChange={(e) => setFormData({...formData, hotel_name: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Nama Kategori *</label>
              <input
                type="text"
                value={formData.nama_kategori}
                onChange={(e) => setFormData({...formData, nama_kategori: e.target.value})}
                className="form-input"
                placeholder="e.g., Food, Beverage, Paket..."
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="field-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-input"
                style={{ minHeight: '60px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="success" onClick={handleAddSave} disabled={processing}>
                {processing ? 'Saving...' : 'Add Category'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '25px',
            width: '450px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              Edit Category: {editingItem.nama_kategori}
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Hotel</label>
              <select
                value={formData.hotel_name}
                onChange={(e) => {
                  const selected = hotels.find(h => h.name === e.target.value);
                  setFormData({...formData, hotel_name: e.target.value, hotel_id: selected?.id || ''});
                }}
                className="form-input"
              >
                <option value="">Select Hotel</option>
                {hotels.map(h => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="field-label">Nama Kategori *</label>
              <input
                type="text"
                value={formData.nama_kategori}
                onChange={(e) => setFormData({...formData, nama_kategori: e.target.value})}
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="field-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="form-input"
                style={{ minHeight: '60px' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
              <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="success" onClick={handleEditSave} disabled={processing}>
                {processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default KategoriMenuResto;
