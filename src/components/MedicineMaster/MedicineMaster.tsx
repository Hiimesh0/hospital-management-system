import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  Search, Printer, Save, Edit2, Trash2, LogOut, 
  X, AlertCircle, CheckCircle2, ShieldAlert, Pill, Package
} from 'lucide-react';
import { medicineApi, type MedicineRecord } from '../../api/masterApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';
import { HOSPITAL_CONFIG } from '../../config/hospitalConfig';
import styles from './MedicineMaster.module.css';

const DEFAULT_MEDICINE: MedicineRecord = {
  id: '',
  brandName: '',
  genericName: '',
  medicineGroup: 'General',
  dosageForm: 'Tablet',
  strength: '',
  frequency: '1-0-1',
  availability: 'In Stock',
  remark1: '',
  remark2: '',
  totalDays: 5,
  notes: '',
  forPatient: 'Both',
  unit: 'Strip',
  manufacturer: '',
  batchNo: '',
  expiryDate: '',
  purchasePrice: 0,
  sellingPrice: 0,
  stockQty: 100,
  reorderLevel: 20,
  gst: 12,
  status: 'active'
};

const MedicineMaster: React.FC = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<MedicineRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [formData, setFormData] = useState<MedicineRecord>(DEFAULT_MEDICINE);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
  const [_isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchGroup, setSearchGroup] = useState<string>('All');
  const [searchStatus, setSearchStatus] = useState<string>('All');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const { notification, setNotification, dismissNotification } = useAutoDismissNotification<{
    type: 'success' | 'error';
    message: string;
  }>();

  // Load medicines from backend JSON storage
  const loadMedicines = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await medicineApi.getMedicines();
      const list = res.medicines || [];
      setMedicines(list);
      if (list.length > 0) {
        setCurrentIndex(0);
        setFormData(list[0]);
        setIsCreateMode(false);
      } else {
        setFormData(DEFAULT_MEDICINE);
        setIsCreateMode(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to medicine storage.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  }, [setNotification]);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  // Sync formData when currentIndex changes (when not in create mode)
  const handleSelectIndex = (idx: number) => {
    if (idx >= 0 && idx < medicines.length) {
      setCurrentIndex(idx);
      setFormData(medicines[idx]);
      setIsCreateMode(false);
      dismissNotification();
    }
  };

  // Field change handler
  const handleInputChange = (field: keyof MedicineRecord, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validation
  const validateForm = (): string | null => {
    if (!formData.brandName || formData.brandName.trim().length < 2) {
      return 'Brand Name is required and must be at least 2 characters.';
    }
    if (!formData.genericName || formData.genericName.trim().length < 2) {
      return 'Generic Name is required.';
    }
    if (formData.totalDays !== undefined && formData.totalDays < 0) {
      return 'Total Days cannot be negative.';
    }
    if (formData.purchasePrice !== undefined && formData.purchasePrice < 0) {
      return 'Purchase Price cannot be negative.';
    }
    if (formData.sellingPrice !== undefined && formData.sellingPrice < 0) {
      return 'Selling Price (MRP) cannot be negative.';
    }
    if (formData.stockQty !== undefined && formData.stockQty < 0) {
      return 'Stock Quantity cannot be negative.';
    }
    if (formData.reorderLevel !== undefined && formData.reorderLevel < 0) {
      return 'Reorder Level cannot be negative.';
    }
    if (formData.gst !== undefined && (formData.gst < 0 || formData.gst > 100)) {
      return 'GST percentage must be between 0% and 100%.';
    }
    return null;
  };

  // Add / Create Medicine
  const handleAddClick = async () => {
    if (!isCreateMode) {
      setIsCreateMode(true);
      const nextId = `MED-${medicines.length + 1001}`;
      setFormData({
        ...DEFAULT_MEDICINE,
        id: nextId
      });
      setNotification({
        type: 'success',
        message: 'New medicine form initialized. Fill details and click "Save Medicine" to add to formulary.'
      });
      return;
    }

    const error = validateForm();
    if (error) {
      setNotification({ type: 'error', message: error });
      return;
    }

    setIsSaving(true);
    try {
      const res = await medicineApi.createMedicine(formData);
      setNotification({
        type: 'success',
        message: `Medicine ${res.medicine.brandName} added successfully with ID ${res.medicine.id}.`
      });
      const updatedList = [...medicines, res.medicine];
      setMedicines(updatedList);
      setCurrentIndex(updatedList.length - 1);
      setFormData(res.medicine);
      setIsCreateMode(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add medicine.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Update existing medicine
  const handleUpdateClick = async () => {
    if (isCreateMode) {
      handleAddClick();
      return;
    }

    const error = validateForm();
    if (error) {
      setNotification({ type: 'error', message: error });
      return;
    }

    setIsSaving(true);
    try {
      const res = await medicineApi.updateMedicine(formData.id, formData);
      setNotification({
        type: 'success',
        message: `Medicine ${res.medicine.brandName} (${res.medicine.id}) updated successfully.`
      });
      const updatedList = [...medicines];
      updatedList[currentIndex] = res.medicine;
      setMedicines(updatedList);
      setFormData(res.medicine);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update medicine.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete or Deactivate
  const handleConfirmDelete = async (force: boolean) => {
    if (!formData.id) return;
    setIsSaving(true);
    try {
      const res = await medicineApi.deleteMedicine(formData.id, force);
      setNotification({
        type: 'success',
        message: res.message
      });
      setIsDeleteModalOpen(false);

      if (res.action === 'deleted') {
        const updatedList = medicines.filter(m => m.id !== formData.id);
        setMedicines(updatedList);
        if (updatedList.length > 0) {
          const nextIdx = Math.min(currentIndex, updatedList.length - 1);
          setCurrentIndex(nextIdx);
          setFormData(updatedList[nextIdx]);
        } else {
          setFormData(DEFAULT_MEDICINE);
          setIsCreateMode(true);
        }
      } else {
        const updatedList = [...medicines];
        updatedList[currentIndex] = { ...updatedList[currentIndex], status: 'inactive' };
        setMedicines(updatedList);
        setFormData(prev => ({ ...prev, status: 'inactive' }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  // Formatted display text for large box on the right
  const formattedSummary = useMemo(() => {
    const lines = [
      `MEDICINE ID: ${formData.id || 'Pending'}`,
      `BRAND: ${formData.brandName || '--'}`,
      `GENERIC: ${formData.genericName || '--'}`,
      `GROUP: ${formData.medicineGroup || 'General'}`,
      `DOSAGE FORM: ${formData.dosageForm || 'Tablet'} | STRENGTH: ${formData.strength || '--'}`,
      `FREQUENCY: ${formData.frequency || '1-0-1'} | DURATION: ${formData.totalDays || 0} days`,
      `AVAILABILITY: ${formData.availability || 'In Stock'} | APPLICABLE FOR: ${formData.forPatient || 'Both'}`,
      `PRICE: MRP ₹ ${formData.sellingPrice || 0} (Purchase: ₹ ${formData.purchasePrice || 0})`,
      `CURRENT STOCK: ${formData.stockQty || 0} ${formData.unit || 'Units'} (Reorder Level: ${formData.reorderLevel || 0})`,
      formData.batchNo ? `BATCH: ${formData.batchNo} | EXPIRY: ${formData.expiryDate || 'N/A'}` : '',
      formData.remark1 ? `REMARK 1: ${formData.remark1}` : '',
      formData.remark2 ? `REMARK 2: ${formData.remark2}` : '',
      formData.notes ? `NOTES: ${formData.notes}` : '',
      `STATUS: ${(formData.status || 'active').toUpperCase()}`
    ].filter(Boolean);
    return lines.join('\n');
  }, [formData]);

  // Extract unique groups for search
  const availableGroups = useMemo(() => {
    const set = new Set<string>();
    medicines.forEach(m => {
      if (m.medicineGroup) set.add(m.medicineGroup);
    });
    return Array.from(set).sort();
  }, [medicines]);

  // Filtered medicines for Search Modal
  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => {
      if (searchStatus !== 'All' && m.status !== searchStatus) return false;
      if (searchGroup !== 'All' && m.medicineGroup !== searchGroup) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          m.brandName.toLowerCase().includes(q) ||
          m.genericName.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          (m.medicineGroup && m.medicineGroup.toLowerCase().includes(q)) ||
          (m.dosageForm && m.dosageForm.toLowerCase().includes(q)) ||
          (m.batchNo && m.batchNo.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [medicines, searchQuery, searchGroup, searchStatus]);

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className={styles.recordCounter}>
            {isCreateMode
              ? `New Medicine (Total: ${medicines.length})`
              : `${medicines.length > 0 ? currentIndex + 1 : 0} of ${medicines.length}`}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-soft, #e8f0fe)', padding: '6px 12px', borderRadius: '6px' }}>
            ID: {isCreateMode ? `${formData.id || 'Pending'}` : formData.id || '--'}
          </span>
          <h1 className={styles.pageTitle}>Medicine Master</h1>
        </div>

        {formData.status === 'inactive' && !isCreateMode && (
          <span className={styles.badgeInactive}>Record Deactivated / Inactive</span>
        )}
      </div>

      {/* Notifications */}
      {notification && (
        <div className={notification.type === 'success' ? styles.alertSuccess : styles.alertError} role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={dismissNotification}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Grid: Left Form & Right Summary */}
      <div className={styles.mainGrid}>
        {/* Left Form */}
        <div className={styles.formSection}>
          <div className={styles.formRow}>
            <label className={styles.label}>Brand Name :</label>
            <input
              type="text"
              className={`${styles.input} ${styles.highlightInput}`}
              placeholder="e.g. Paracetamol 650 (Dolo), Augmentin 625 Duo"
              value={formData.brandName}
              onChange={e => handleInputChange('brandName', e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Dosage Form :</label>
            <select
              className={styles.input}
              value={formData.dosageForm || 'Tablet'}
              onChange={e => handleInputChange('dosageForm', e.target.value)}
            >
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Ointment">Ointment / Gel</option>
              <option value="Drops">Eye/Ear Drops</option>
              <option value="Surgical Suture">Surgical Suture / Consumable</option>
              <option value="IV Fluid">IV Infusion / Fluid</option>
              <option value="Inhaler">Inhaler / Respules</option>
            </select>

            <label className={styles.label} style={{ width: '80px' }}>Strength :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. 650 mg"
              value={formData.strength || ''}
              onChange={e => handleInputChange('strength', e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Frequency :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. 1-0-1, TDS, SOS"
              value={formData.frequency || ''}
              onChange={e => handleInputChange('frequency', e.target.value)}
            />

            <label className={styles.label} style={{ width: '90px' }}>Availability :</label>
            <input
              type="text"
              className={styles.input}
              style={{ maxWidth: '120px' }}
              value={formData.availability || 'In Stock'}
              onChange={e => handleInputChange('availability', e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Remark 1 :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Take after food"
              value={formData.remark1 || ''}
              onChange={e => handleInputChange('remark1', e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Remark 2 :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Complete full course"
              value={formData.remark2 || ''}
              onChange={e => handleInputChange('remark2', e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Total Days :</label>
            <input
              type="number"
              min="0"
              className={`${styles.input} ${styles.shortInput}`}
              value={formData.totalDays ?? 0}
              onChange={e => handleInputChange('totalDays', parseInt(e.target.value, 10) || 0)}
            />

            <label className={styles.label} style={{ width: '80px' }}>For :</label>
            <select
              className={`${styles.input} ${styles.shortInput}`}
              value={formData.forPatient || 'Both'}
              onChange={e => handleInputChange('forPatient', e.target.value)}
            >
              <option value="Both">Both (OPD & IPD)</option>
              <option value="OPD">OPD Only</option>
              <option value="IPD">IPD Only</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Notes :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Clinical precautions or contraindications"
              value={formData.notes || ''}
              onChange={e => handleInputChange('notes', e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Pricing (₹) :</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className={styles.input}
              placeholder="MRP / Selling Price"
              value={formData.sellingPrice ?? 0}
              onChange={e => handleInputChange('sellingPrice', parseFloat(e.target.value) || 0)}
            />
            <label className={styles.label} style={{ width: '80px' }}>Stock Qty :</label>
            <input
              type="number"
              min="0"
              className={styles.input}
              placeholder="Units"
              value={formData.stockQty ?? 0}
              onChange={e => handleInputChange('stockQty', parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label}>Status :</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioItem}>
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === 'active'}
                  onChange={() => handleInputChange('status', 'active')}
                />{' '}
                Active
              </label>
              <label className={styles.radioItem}>
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === 'inactive'}
                  onChange={() => handleInputChange('status', 'inactive')}
                />{' '}
                Inactive
              </label>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className={styles.rightSection}>
          <div className={styles.formRow}>
            <label className={styles.label} style={{ width: '120px' }}>Medicine Group :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. Antibiotics, Analgesics"
              value={formData.medicineGroup || ''}
              onChange={e => handleInputChange('medicineGroup', e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label} style={{ width: '120px' }}>Generic Name :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Chemical / Active Ingredient"
              value={formData.genericName}
              onChange={e => handleInputChange('genericName', e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label} style={{ width: '120px' }}>Manufacturer :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Pharma Company"
              value={formData.manufacturer || ''}
              onChange={e => handleInputChange('manufacturer', e.target.value)}
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.label} style={{ width: '120px' }}>Batch / Expiry :</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Batch No"
              style={{ maxWidth: '120px' }}
              value={formData.batchNo || ''}
              onChange={e => handleInputChange('batchNo', e.target.value)}
            />
            <input
              type="date"
              className={styles.input}
              value={formData.expiryDate || ''}
              onChange={e => handleInputChange('expiryDate', e.target.value)}
            />
          </div>

          <textarea
            className={styles.largeDisplayBox}
            readOnly
            value={formattedSummary}
            title="Formulary Overview"
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={styles.actionBar}>
        <div className={styles.navControls}>
          <button
            type="button"
            className={styles.navBtn}
            title="First Record"
            disabled={currentIndex === 0 || isCreateMode}
            onClick={() => handleSelectIndex(0)}
          >
            <ChevronsLeft size={20} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            title="Previous Record"
            disabled={currentIndex === 0 || isCreateMode}
            onClick={() => handleSelectIndex(currentIndex - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            title="Next Record"
            disabled={currentIndex >= medicines.length - 1 || isCreateMode}
            onClick={() => handleSelectIndex(currentIndex + 1)}
          >
            <ChevronRight size={20} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            title="Last Record"
            disabled={currentIndex >= medicines.length - 1 || isCreateMode}
            onClick={() => handleSelectIndex(medicines.length - 1)}
          >
            <ChevronsRight size={20} />
          </button>
        </div>

        <div className={styles.rightActions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={18} /> Particular Search
          </button>

          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => setIsPrintModalOpen(true)}
          >
            <Printer size={18} /> Print
          </button>

          <button
            type="button"
            className={styles.primaryBtn}
            disabled={isSaving}
            onClick={handleAddClick}
          >
            <Save size={18} /> {isCreateMode ? 'Save Medicine' : 'Add New'}
          </button>

          {!isCreateMode && (
            <button
              type="button"
              className={styles.secondaryBtn}
              disabled={isSaving}
              onClick={handleUpdateClick}
            >
              <Edit2 size={18} /> Update
            </button>
          )}

          {!isCreateMode && (
            <button
              type="button"
              className={styles.dangerBtn}
              disabled={isSaving}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={18} /> Delete / Deactivate
            </button>
          )}

          <button
            type="button"
            className={styles.secondaryBtn}
            style={{ marginLeft: '16px' }}
            onClick={() => navigate('/')}
          >
            <LogOut size={18} /> Exit
          </button>
        </div>
      </div>

      {/* Particular Search Modal */}
      {isSearchOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsSearchOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <Search size={18} color="var(--primary)" /> Particular Search — Medicine Formulary
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsSearchOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.searchToolbar}>
                <div className={styles.searchBox}>
                  <Search size={16} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Instant search by Brand Name, Generic Name, Medicine Code, or Group..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className={styles.filterRow}>
                  <select
                    className={styles.filterSelect}
                    value={searchGroup}
                    onChange={e => setSearchGroup(e.target.value)}
                  >
                    <option value="All">All Groups</option>
                    {availableGroups.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>

                  <select
                    className={styles.filterSelect}
                    value={searchStatus}
                    onChange={e => setSearchStatus(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>

                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    Showing {filteredMedicines.length} of {medicines.length} medicines
                  </span>
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.modalTable}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Brand Name</th>
                      <th>Generic Name</th>
                      <th>Group</th>
                      <th>Dosage</th>
                      <th>MRP</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedicines.length === 0 ? (
                      <tr>
                        <td colSpan={8} className={styles.emptyState}>
                          No medicines found matching the search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredMedicines.map(med => (
                        <tr
                          key={med.id}
                          className={`${styles.tableRow} ${med.id === formData.id ? styles.tableRowSelected : ''}`}
                          onClick={() => {
                            const idx = medicines.findIndex(m => m.id === med.id);
                            if (idx !== -1) handleSelectIndex(idx);
                            setIsSearchOpen(false);
                          }}
                        >
                          <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{med.id}</td>
                          <td><strong>{med.brandName}</strong></td>
                          <td>{med.genericName}</td>
                          <td>{med.medicineGroup || '-'}</td>
                          <td>{med.dosageForm} {med.strength}</td>
                          <td>₹ {med.sellingPrice || 0}</td>
                          <td>{med.stockQty || 0}</td>
                          <td>
                            {med.status === 'active' ? (
                              <span className={styles.badgeActive}>Active</span>
                            ) : (
                              <span className={styles.badgeInactive}>Inactive</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsSearchOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete / Deactivate Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsDeleteModalOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle} style={{ color: 'var(--danger)' }}>
                <ShieldAlert size={20} /> Delete or Deactivate Medicine
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
                You are about to remove <strong>{formData.brandName} ({formData.id})</strong>.
              </p>
              <div style={{ backgroundColor: 'var(--warning-soft)', padding: '12px', borderRadius: '6px', fontSize: '13px', color: 'var(--text-main)' }}>
                <strong>Pharmacy & Clinical Safeguard:</strong> Deactivation preserves past prescription records, patient charts, and pharmacy audit trails while disabling this drug from new prescriptions.
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                onClick={() => handleConfirmDelete(false)}
              >
                Deactivate (Safe)
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => handleConfirmDelete(true)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Medicine Label / Profile Preview Modal */}
      {isPrintModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPrintModalOpen(false)}>
          <div className={styles.modalContent} style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                <Printer size={18} /> Medicine Formulary Record — {HOSPITAL_CONFIG.name}
              </h3>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setIsPrintModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div style={{ border: '2px solid var(--border)', padding: '20px', borderRadius: '8px', background: 'var(--surface)' }}>
                <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '18px' }}>{HOSPITAL_CONFIG.name} — PHARMACY FORMULARY</h3>
                  <p style={{ margin: '2px 0 0 0', color: 'var(--text-muted)', fontSize: '12px' }}>{HOSPITAL_CONFIG.address}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                  <div><strong>Drug Code:</strong> {formData.id}</div>
                  <div><strong>Dosage Form:</strong> {formData.dosageForm}</div>
                  <div><strong>Brand Name:</strong> {formData.brandName}</div>
                  <div><strong>Strength:</strong> {formData.strength || '-'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Generic Name:</strong> {formData.genericName}</div>
                  <div><strong>Therapeutic Group:</strong> {formData.medicineGroup || '-'}</div>
                  <div><strong>Standard Frequency:</strong> {formData.frequency}</div>
                  <div><strong>Selling Price (MRP):</strong> ₹ {formData.sellingPrice || 0}</div>
                  <div><strong>Stock Balance:</strong> {formData.stockQty} {formData.unit}</div>
                  <div><strong>Manufacturer:</strong> {formData.manufacturer || '-'}</div>
                  <div><strong>Batch / Expiry:</strong> {formData.batchNo || '-'} / {formData.expiryDate || 'N/A'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Instructions:</strong> {formData.remark1 || '-'}</div>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setIsPrintModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => window.print()}
              >
                <Printer size={16} /> Print Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineMaster;
