import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Users,
  RotateCcw,
  Calendar,
  Building,
  UserCheck
} from 'lucide-react';
import { patientApi } from '../../api/patientApi';
import type { PatientRecord } from '../../api/patientApi';
import { useAutoDismissNotification } from '../../hooks/useAutoDismissNotification';
import styles from './PatientRegistrationList.module.css';

const PatientRegistrationList: React.FC = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { notification, setNotification, dismissNotification } = useAutoDismissNotification<{
    type: 'success' | 'error';
    message: string;
  }>();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  // Modals state
  const [viewingPatient, setViewingPatient] = useState<PatientRecord | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<PatientRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch patients from Django backend JSON storage
  const loadPatients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await patientApi.getPatients();
      setPatients(data.patients || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to backend server.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // Dynamically extract unique doctors and cities for filter dropdowns
  const availableDoctors = useMemo(() => {
    const docs = new Set<string>();
    patients.forEach(p => {
      if (p.hospitalDoctor) docs.add(p.hospitalDoctor);
    });
    return Array.from(docs).sort();
  }, [patients]);

  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    patients.forEach(p => {
      if (p.city) cities.add(p.city);
    });
    return Array.from(cities).sort();
  }, [patients]);

  // Real-time instant search & combined filtering
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${patient.firstName} ${patient.middleName} ${patient.lastName}`.toLowerCase();
        const matchesQuery =
          patient.uhid.toLowerCase().includes(q) ||
          fullName.includes(q) ||
          patient.mobile.includes(q) ||
          patient.email.toLowerCase().includes(q) ||
          patient.hospitalDoctor.toLowerCase().includes(q) ||
          patient.city.toLowerCase().includes(q);

        if (!matchesQuery) return false;
      }

      // 2. Gender Filter
      if (selectedGender !== 'All' && patient.sex !== selectedGender) {
        return false;
      }

      // 3. Category Filter
      if (selectedCategory !== 'All' && patient.category !== selectedCategory) {
        return false;
      }

      // 4. Doctor Filter
      if (selectedDoctor !== 'All' && patient.hospitalDoctor !== selectedDoctor) {
        return false;
      }

      // 5. City Filter
      if (selectedCity !== 'All' && patient.city !== selectedCity) {
        return false;
      }

      return true;
    });
  }, [patients, searchQuery, selectedGender, selectedCategory, selectedDoctor, selectedCity]);

  // Reset all filters and search query
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGender('All');
    setSelectedCategory('All');
    setSelectedDoctor('All');
    setSelectedCity('All');
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    selectedGender !== 'All' ||
    selectedCategory !== 'All' ||
    selectedDoctor !== 'All' ||
    selectedCity !== 'All';

  // Stats calculation
  const totalCount = patients.length;
  const maleCount = patients.filter(p => p.sex === 'Male').length;
  const femaleCount = patients.filter(p => p.sex === 'Female').length;
  const otherCount = patients.filter(p => p.sex !== 'Male' && p.sex !== 'Female').length;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const registeredTodayCount = patients.filter(
    p => p.createdAt && p.createdAt.startsWith(todayDateStr)
  ).length;

  // Delete execution
  const confirmDelete = async () => {
    if (!deletingPatient) return;
    setIsDeleting(true);
    try {
      await patientApi.deletePatient(deletingPatient.uhid);
      setNotification({
        type: 'success',
        message: `Patient ${deletingPatient.firstName} ${deletingPatient.lastName} (${deletingPatient.uhid}) was deleted successfully.`,
      });
      setPatients(prev => prev.filter(p => p.uhid !== deletingPatient.uhid));
      setDeletingPatient(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete patient.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`${styles.container} ${styles.pageContainer}`}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <Users size={26} color="var(--primary)" />
            Patient Registration List
          </h1>
          <p className={styles.subtitle}>
            Search, filter, view, edit, and manage registered patients (JSON-backed backend storage)
          </p>
        </div>
        <div className={styles.headerActions}>
          <span className={`${styles.badge} ${styles.badgePrimary}`}>
            Total Records: {patients.length}
          </span>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => navigate('/patient-registration')}
          >
            <UserPlus size={16} />
            Register New Patient
          </button>
        </div>
      </header>

      {/* Notifications */}
      {notification && (
        <div
          className={notification.type === 'success' ? styles.alertSuccess : styles.alertError}
          role="alert"
        >
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

      {/* Error state */}
      {error && (
        <div className={styles.alertError} role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            style={{ height: '30px', fontSize: '0.75rem', padding: '0 8px' }}
            onClick={loadPatients}
          >
            <RotateCcw size={13} style={{ marginRight: '4px' }} /> Retry
          </button>
        </div>
      )}

      {/* Quick Summary Stats Bar */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Patients</span>
          <span className={styles.statValue}>{totalCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Male Patients</span>
          <span className={styles.statValue} style={{ color: '#2563EB' }}>{maleCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Female Patients</span>
          <span className={styles.statValue} style={{ color: '#DB2777' }}>{femaleCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Other / Diverse</span>
          <span className={styles.statValue} style={{ color: '#8B5CF6' }}>{otherCount}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Today&apos;s Registrations</span>
          <span className={styles.statValue} style={{ color: 'var(--success)' }}>{registeredTodayCount}</span>
        </div>
      </div>

      {/* Instant Search & Filter Toolbar */}
      <div className={styles.toolbar}>
        {/* Prominent Instant Search */}
        <div className={styles.searchRow}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Instant Search by Name, UHID, Mobile, Email, Doctor, or City..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search patients"
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
                title="Clear search query"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Gender:</label>
            <select
              className={styles.filterSelect}
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Category:</label>
            <select
              className={styles.filterSelect}
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="NEW">NEW</option>
              <option value="OLD">OLD</option>
            </select>
          </div>

          {availableDoctors.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Doctor:</label>
              <select
                className={styles.filterSelect}
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
              >
                <option value="All">All Doctors</option>
                {availableDoctors.map(doc => (
                  <option key={doc} value={doc}>{doc}</option>
                ))}
              </select>
            </div>
          )}

          {availableCities.length > 0 && (
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>City:</label>
              <select
                className={styles.filterSelect}
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
              >
                <option value="All">All Cities</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {isFiltered && (
            <button
              type="button"
              className={styles.resetFiltersBtn}
              onClick={handleResetFilters}
            >
              <RotateCcw size={12} />
              Reset Filters
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> patients
          </div>
        </div>
      </div>

      {/* Main Table / Content State */}
      {isLoading ? (
        <div className={styles.stateContainer}>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>Loading patients from backend...</div>
        </div>
      ) : patients.length === 0 ? (
        <div className={styles.stateContainer}>
          <Users size={48} color="var(--text-muted)" style={{ opacity: 0.5 }} />
          <h3 className={styles.stateTitle}>No Registered Patients Yet</h3>
          <p className={styles.stateText}>
            No patient records exist in the JSON storage. Click below to register your first patient.
          </p>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => navigate('/patient-registration')}
          >
            <UserPlus size={16} />
            Register First Patient
          </button>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className={styles.stateContainer}>
          <Search size={40} color="var(--text-muted)" style={{ opacity: 0.5 }} />
          <h3 className={styles.stateTitle}>No Matching Patients Found</h3>
          <p className={styles.stateText}>
            No patient matches your search or active filters. Try modifying your search criteria or resetting filters.
          </p>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleResetFilters}
          >
            <RotateCcw size={14} />
            Clear Search & Reset Filters
          </button>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>UHID</th>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Mobile Number</th>
                <th>Hospital Doctor</th>
                <th>City / State</th>
                <th>Registered On</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient.uhid}>
                  <td className={styles.uhidCell}>{patient.uhid}</td>
                  <td>
                    <div className={styles.nameCell}>
                      <span>{patient.firstName} {patient.middleName} {patient.lastName}</span>
                      <span className={styles.categoryTag}>{patient.category}</span>
                    </div>
                  </td>
                  <td>
                    {patient.age} {patient.ageUnit} • {patient.sex}
                  </td>
                  <td>
                    <a
                      href={`tel:${patient.mobile}`}
                      style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {patient.mobile}
                    </a>
                  </td>
                  <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {patient.hospitalDoctor}
                  </td>
                  <td>
                    {patient.city || '-'}{patient.state ? `, ${patient.state}` : ''}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString('en-GB')
                      : 'Recently'}
                  </td>
                  <td>
                    <div className={styles.actionsCell} style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className={styles.btnAction}
                        title="View Full Details"
                        onClick={() => setViewingPatient(patient)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.btnAction} ${styles.btnActionEdit}`}
                        title="Edit Patient"
                        onClick={() => navigate(`/patient-registration?id=${encodeURIComponent(patient.uhid)}`)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.btnAction} ${styles.btnActionDelete}`}
                        title="Delete Patient"
                        onClick={() => setDeletingPatient(patient)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Patient View Modal */}
      {viewingPatient && (
        <div className={styles.modalBackdrop} onClick={() => setViewingPatient(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <UserCheck size={22} color="var(--primary)" />
                Patient Details: {viewingPatient.firstName} {viewingPatient.lastName} ({viewingPatient.uhid})
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setViewingPatient(null)}
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.detailGrid}>
              {/* Demographics */}
              <div className={styles.detailSection}>
                <div className={styles.detailSectionTitle}>
                  <Users size={14} /> Demographics & Identity
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>UHID:</span>
                  <span className={styles.detailValue} style={{ color: 'var(--primary)' }}>{viewingPatient.uhid}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Category:</span>
                  <span className={styles.detailValue}>{viewingPatient.category}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Full Name:</span>
                  <span className={styles.detailValue}>{viewingPatient.firstName} {viewingPatient.middleName} {viewingPatient.lastName}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Gender:</span>
                  <span className={styles.detailValue}>{viewingPatient.sex}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Age / Unit:</span>
                  <span className={styles.detailValue}>{viewingPatient.age} {viewingPatient.ageUnit}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Date of Birth:</span>
                  <span className={styles.detailValue}>{viewingPatient.birthDate || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Religion / Marital:</span>
                  <span className={styles.detailValue}>{viewingPatient.religion || '-'} / {viewingPatient.maritalStatus || '-'}</span>
                </div>
              </div>

              {/* Medical & Clinical */}
              <div className={styles.detailSection}>
                <div className={styles.detailSectionTitle}>
                  <Calendar size={14} /> Clinical & Consulting
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Hospital Doctor:</span>
                  <span className={styles.detailValue}>{viewingPatient.hospitalDoctor}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Reference By:</span>
                  <span className={styles.detailValue}>{viewingPatient.referenceBy || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Weight / Height:</span>
                  <span className={styles.detailValue}>
                    {viewingPatient.weight ? `${viewingPatient.weight} kg` : '-'} / {viewingPatient.height ? `${viewingPatient.height} cm` : '-'}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Estimate:</span>
                  <span className={styles.detailValue}>{viewingPatient.estimate || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Mediclaim:</span>
                  <span className={styles.detailValue}>{viewingPatient.mediclaim || '-'}</span>
                </div>
              </div>

              {/* Contact & Address */}
              <div className={styles.detailSection}>
                <div className={styles.detailSectionTitle}>
                  <Building size={14} /> Contact & Address
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Mobile:</span>
                  <span className={styles.detailValue}>{viewingPatient.mobile}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Email:</span>
                  <span className={styles.detailValue}>{viewingPatient.email || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Street Address:</span>
                  <span className={styles.detailValue}>{viewingPatient.streetAddress || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>City / State:</span>
                  <span className={styles.detailValue}>{viewingPatient.city}, {viewingPatient.state}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>PIN Code:</span>
                  <span className={styles.detailValue}>{viewingPatient.pinCode || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Auto SMS:</span>
                  <span className={styles.detailValue}>{viewingPatient.autoSms ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {/* Other Identification */}
              <div className={styles.detailSection}>
                <div className={styles.detailSectionTitle}>
                  <Building size={14} /> Corporate & Identifiers
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Aadhaar No:</span>
                  <span className={styles.detailValue}>{viewingPatient.aadharNo || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>PAN No:</span>
                  <span className={styles.detailValue}>{viewingPatient.panNo || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Company Name:</span>
                  <span className={styles.detailValue}>{viewingPatient.companyName || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Employee ID:</span>
                  <span className={styles.detailValue}>{viewingPatient.employeeId || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Membership ID:</span>
                  <span className={styles.detailValue}>{viewingPatient.membershipId || '-'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Remark:</span>
                  <span className={styles.detailValue}>{viewingPatient.remark || '-'}</span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setViewingPatient(null)}
              >
                Close
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => {
                  const id = viewingPatient.uhid;
                  setViewingPatient(null);
                  navigate(`/patient-registration?id=${encodeURIComponent(id)}`);
                }}
              >
                <Edit2 size={14} />
                Edit This Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPatient && (
        <div className={styles.modalBackdrop} onClick={() => !isDeleting && setDeletingPatient(null)}>
          <div className={styles.modalContent} style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle} style={{ color: 'var(--danger)' }}>
                <Trash2 size={20} /> Confirm Patient Deletion
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => !isDeleting && setDeletingPatient(null)}
                aria-label="Cancel"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem', fontSize: '0.925rem', lineHeight: '1.5', color: 'var(--text-main)' }}>
              Are you sure you want to permanently delete patient{' '}
              <strong>{deletingPatient.firstName} {deletingPatient.lastName}</strong>{' '}
              (UHID: <strong style={{ color: 'var(--primary)' }}>{deletingPatient.uhid}</strong>)?
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                This record will be removed from the backend JSON storage.
              </p>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setDeletingPatient(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`${styles.btn}`}
                style={{ backgroundColor: 'var(--danger)', color: 'white' }}
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRegistrationList;
