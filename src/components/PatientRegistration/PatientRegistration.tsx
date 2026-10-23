import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, X, Search, UserCheck } from 'lucide-react';
import styles from './PatientRegistration.module.css';

interface PatientRecord {
  uhid: string;
  category: string;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  age: string;
  ageUnit: string;
  sex: string;
  hospitalDoctor: string;
  referenceBy: string;
  religion: string;
  maritalStatus: string;
  weight: string;
  height: string;
  mobile: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  pinCode: string;
  autoSms: boolean;
  estimate: string;
  aadharNo: string;
  panNo: string;
  mediclaim: string;
  membershipId: string;
  employeeId: string;
  companyName: string;
  remark: string;
  registeredAt: string;
}

const STORAGE_KEY = 'mixu_registered_patients';

const defaultFormState = {
  category: 'NEW',
  firstName: '',
  middleName: '',
  lastName: '',
  birthDate: '',
  age: '',
  ageUnit: 'Years',
  sex: 'Male',
  hospitalDoctor: 'Dr. NILESH MAHALE',
  referenceBy: 'DR. NIKUNJ VITHALANI',
  religion: 'Hindu',
  maritalStatus: '',
  weight: '',
  height: '',
  mobile: '',
  email: '',
  streetAddress: '',
  city: 'SURAT',
  state: 'GUJARAT',
  pinCode: '',
  autoSms: true,
  estimate: '',
  aadharNo: '',
  panNo: '',
  mediclaim: '',
  membershipId: '',
  employeeId: '',
  companyName: '',
  remark: ''
};

const PatientRegistration: React.FC = () => {
  const [formData, setFormData] = useState(defaultFormState);
  const [records, setRecords] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentUhid = `UHID-${1000 + records.length + 1}`;
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Birth Date change to auto-calculate Age
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateVal = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, birthDate: dateVal };
      if (dateVal) {
        const birthYear = new Date(dateVal).getFullYear();
        const currentYear = new Date().getFullYear();
        if (birthYear && birthYear <= currentYear) {
          updated.age = String(Math.max(0, currentYear - birthYear));
          updated.ageUnit = 'Years';
        }
      }
      return updated;
    });
  };

  // Handle Age change to approximate Birth Date
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ageVal = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, age: ageVal };
      const parsedAge = parseInt(ageVal, 10);
      if (!isNaN(parsedAge) && parsedAge >= 0 && parsedAge <= 125) {
        const birthYear = new Date().getFullYear() - parsedAge;
        updated.birthDate = `${birthYear}-01-01`;
      }
      return updated;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddPatient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Required fields validation
    if (!formData.firstName.trim()) {
      setNotification({ type: 'error', message: 'First Name is required.' });
      return;
    }
    if (!formData.age.trim()) {
      setNotification({ type: 'error', message: 'Age is required.' });
      return;
    }
    if (!formData.mobile.trim()) {
      setNotification({ type: 'error', message: 'Mobile Number is required.' });
      return;
    }
    if (!formData.hospitalDoctor.trim()) {
      setNotification({ type: 'error', message: 'Hospital Doctor is required.' });
      return;
    }

    const newPatient: PatientRecord = {
      uhid: currentUhid,
      category: formData.category,
      firstName: formData.firstName.trim(),
      middleName: formData.middleName.trim(),
      lastName: formData.lastName.trim(),
      birthDate: formData.birthDate,
      age: formData.age.trim(),
      ageUnit: formData.ageUnit,
      sex: formData.sex,
      hospitalDoctor: formData.hospitalDoctor.trim(),
      referenceBy: formData.referenceBy.trim(),
      religion: formData.religion,
      maritalStatus: formData.maritalStatus,
      weight: formData.weight.trim(),
      height: formData.height.trim(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim(),
      streetAddress: formData.streetAddress.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      pinCode: formData.pinCode.trim(),
      autoSms: formData.autoSms,
      estimate: formData.estimate.trim(),
      aadharNo: formData.aadharNo.trim(),
      panNo: formData.panNo.trim(),
      mediclaim: formData.mediclaim.trim(),
      membershipId: formData.membershipId.trim(),
      employeeId: formData.employeeId.trim(),
      companyName: formData.companyName.trim(),
      remark: formData.remark.trim(),
      registeredAt: new Date().toLocaleDateString('en-GB')
    };

    const updatedRecords = [newPatient, ...records];
    setRecords(updatedRecords);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords));
    } catch {
      // LocalStorage quota fallback
    }

    setNotification({
      type: 'success',
      message: `Patient ${newPatient.firstName} ${newPatient.lastName} registered successfully with ${currentUhid}!`
    });

    // Reset form for next patient registration
    setFormData(defaultFormState);
  };

  const handleResetForm = () => {
    setFormData(defaultFormState);
    setNotification(null);
  };

  const filteredRecords = records.filter(p => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.uhid.toLowerCase().includes(query) ||
      p.firstName.toLowerCase().includes(query) ||
      p.lastName.toLowerCase().includes(query) ||
      p.mobile.includes(query)
    );
  });

  return (
    <div className={`${styles.container} ${styles.pageContainer}`}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Patient Registration</h1>
          <p className={styles.subtitle}>Register and manage patient information</p>
        </div>
        <div className={styles.metaInfo}>
          <span className={styles.badge}>
            Records: {records.length}
          </span>
          <span className={styles.badge}>
            Assigned: {currentUhid}
          </span>
        </div>
      </header>

      {/* Notifications */}
      {notification && (
        <div className={notification.type === 'success' ? styles.alertSuccess : styles.alertError} role="alert">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex' }}
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form onSubmit={handleAddPatient}>
        {/* Primary Identity Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Primary Identity</h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.colSpan2}`}>
              <label className={styles.label}>UHID</label>
              <input
                type="text"
                className={styles.input}
                value={currentUhid}
                readOnly
                title="Auto-generated UHID"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan2}`}>
              <label className={`${styles.label} ${styles.required}`}>Category</label>
              <select
                name="category"
                className={styles.select}
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="NEW">NEW</option>
                <option value="OLD">OLD</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={`${styles.label} ${styles.required}`}>First Name</label>
              <input
                type="text"
                name="firstName"
                className={styles.input}
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="e.g. Vinubhai"
                required
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan2}`}>
              <label className={styles.label}>Middle Name</label>
              <input
                type="text"
                name="middleName"
                className={styles.input}
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="e.g. Kantibhai"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Last Name</label>
              <input
                type="text"
                name="lastName"
                className={styles.input}
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="e.g. Sakariya"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Birth Date</label>
              <input
                type="date"
                name="birthDate"
                className={styles.input}
                value={formData.birthDate}
                onChange={handleBirthDateChange}
                max="2099-12-31"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={`${styles.label} ${styles.required}`}>Age</label>
              <div className={styles.inputGroup}>
                <input
                  type="number"
                  name="age"
                  className={styles.input}
                  style={{ flex: 1 }}
                  value={formData.age}
                  onChange={handleAgeChange}
                  min="0"
                  max="125"
                  placeholder="45"
                  required
                />
                <select
                  name="ageUnit"
                  className={styles.select}
                  style={{ flex: 1, minWidth: '90px' }}
                  value={formData.ageUnit}
                  onChange={handleInputChange}
                >
                  <option value="Years">Years</option>
                  <option value="Months">Months</option>
                  <option value="Days">Days</option>
                </select>
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Sex</label>
              <select
                name="sex"
                className={styles.select}
                value={formData.sex}
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Photograph</label>
              <div className={styles.inputGroup} style={{ alignItems: 'center' }}>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>Select Picture</button>
                <label className={styles.checkboxGroup}>
                  <input type="checkbox" className={styles.checkbox} />
                  <span style={{ fontSize: '0.85rem' }}>Clear</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Demographics & Clinical Section (Language & Wedding Date removed) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Demographics & Clinical</h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.colSpan6}`}>
              <label className={`${styles.label} ${styles.required}`}>Hospital Doctor</label>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="hospitalDoctor"
                  className={styles.input}
                  value={formData.hospitalDoctor}
                  onChange={handleInputChange}
                  required
                />
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>Change</button>
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan6}`}>
              <label className={styles.label}>Reference By</label>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="referenceBy"
                  className={styles.input}
                  value={formData.referenceBy}
                  onChange={handleInputChange}
                />
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`}>Search</button>
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Religion</label>
              <select
                name="religion"
                className={styles.select}
                value={formData.religion}
                onChange={handleInputChange}
              >
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Marital Status</label>
              <select
                name="maritalStatus"
                className={styles.select}
                value={formData.maritalStatus}
                onChange={handleInputChange}
              >
                <option value="">Select...</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                className={styles.input}
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g. 68"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Height (cm)</label>
              <input
                type="number"
                name="height"
                className={styles.input}
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g. 172"
              />
            </div>
          </div>
        </section>

        {/* Communication & Address Details */}
        <div className={styles.formGrid}>
          <div className={`${styles.colSpan6} ${styles.splitSectionLeft}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Communication</h2>
              <label className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="autoSms"
                  className={styles.checkbox}
                  checked={formData.autoSms}
                  onChange={handleCheckboxChange}
                />
                <span style={{ fontSize: '0.85rem' }}>Auto SMS</span>
              </label>
            </div>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.colSpan12}`}>
                <label className={`${styles.label} ${styles.required}`}>Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  className={styles.input}
                  pattern="[0-9]{10,15}"
                  title="Please enter a valid mobile number (10-15 digits)"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="9879745263"
                  required
                />
              </div>
              <div className={`${styles.formGroup} ${styles.colSpan12}`}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  className={styles.input}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="patient@example.com"
                />
              </div>
            </div>
          </div>

          <div className={`${styles.colSpan6} ${styles.splitSectionRight}`}>
            <h2 className={styles.sectionTitle}>Address Details</h2>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.colSpan12}`}>
                <label className={styles.label}>Street Address</label>
                <input
                  type="text"
                  name="streetAddress"
                  className={styles.input}
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  placeholder="398 Shubh Nandini Rasi Kamrej"
                />
              </div>
              <div className={`${styles.formGroup} ${styles.colSpan6}`}>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  className={styles.input}
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.colSpan6}`}>
                <label className={styles.label}>State</label>
                <input
                  type="text"
                  name="state"
                  className={styles.input}
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.colSpan12}`}>
                <label className={styles.label}>Pin Code</label>
                <input
                  type="text"
                  name="pinCode"
                  className={styles.input}
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  placeholder="395006"
                />
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2.5rem 0' }} />

        {/* Other Details Section (Education, Occupation, Spouse Occupation removed) */}
        <section className={styles.section} style={{ marginBottom: 0 }}>
          <h2 className={styles.sectionTitle}>Other Details</h2>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Estimate</label>
              <input
                type="text"
                name="estimate"
                className={styles.input}
                value={formData.estimate}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Aadhar No</label>
              <input
                type="text"
                name="aadharNo"
                className={styles.input}
                value={formData.aadharNo}
                onChange={handleInputChange}
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Pan No</label>
              <input
                type="text"
                name="panNo"
                className={styles.input}
                value={formData.panNo}
                onChange={handleInputChange}
                placeholder="ABCDE1234F"
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Mediclaim</label>
              <input
                type="text"
                name="mediclaim"
                className={styles.input}
                value={formData.mediclaim}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Membership Id</label>
              <input
                type="text"
                name="membershipId"
                className={styles.input}
                value={formData.membershipId}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Employee Id</label>
              <input
                type="text"
                name="employeeId"
                className={styles.input}
                value={formData.employeeId}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Company Name</label>
              <input
                type="text"
                name="companyName"
                className={styles.input}
                value={formData.companyName}
                onChange={handleInputChange}
              />
            </div>
            <div className={`${styles.formGroup} ${styles.colSpan3}`}>
              <label className={styles.label}>Remark</label>
              <input
                type="text"
                name="remark"
                className={styles.input}
                value={formData.remark}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={handleResetForm}
          >
            Exit / Clear
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => setIsSearchOpen(true)}
          >
            <Search size={15} style={{ marginRight: '6px' }} />
            Search Patient ({records.length})
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => handleAddPatient()}
          >
            Update
          </button>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            <UserCheck size={16} style={{ marginRight: '6px' }} />
            Add Patient
          </button>
        </div>
      </form>

      {/* Patient Search Lookup Modal */}
      {isSearchOpen && (
        <div className={styles.modalBackdrop} onClick={() => setIsSearchOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 600 }}>
                Registered Patients ({records.length})
              </h3>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                className={styles.input}
                placeholder="Search by UHID, Name, or Mobile..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ maxHeight: '360px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredRecords.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No registered patients found. Register a new patient to view here.
                </div>
              ) : (
                filteredRecords.map(p => (
                  <div
                    key={p.uhid}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--bg-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {p.firstName} {p.middleName} {p.lastName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        UHID: <strong style={{ color: 'var(--primary)' }}>{p.uhid}</strong> • Mobile: {p.mobile} • Age: {p.age} {p.ageUnit} • Gender: {p.sex}
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      onClick={() => {
                        setFormData({
                          category: p.category,
                          firstName: p.firstName,
                          middleName: p.middleName,
                          lastName: p.lastName,
                          birthDate: p.birthDate,
                          age: p.age,
                          ageUnit: p.ageUnit,
                          sex: p.sex,
                          hospitalDoctor: p.hospitalDoctor,
                          referenceBy: p.referenceBy,
                          religion: p.religion,
                          maritalStatus: p.maritalStatus,
                          weight: p.weight,
                          height: p.height,
                          mobile: p.mobile,
                          email: p.email,
                          streetAddress: p.streetAddress,
                          city: p.city,
                          state: p.state,
                          pinCode: p.pinCode,
                          autoSms: p.autoSms,
                          estimate: p.estimate,
                          aadharNo: p.aadharNo,
                          panNo: p.panNo,
                          mediclaim: p.mediclaim,
                          membershipId: p.membershipId,
                          employeeId: p.employeeId,
                          companyName: p.companyName,
                          remark: p.remark
                        });
                        setIsSearchOpen(false);
                        setNotification({ type: 'success', message: `Loaded patient ${p.uhid} into form.` });
                      }}
                    >
                      Load Record
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;
