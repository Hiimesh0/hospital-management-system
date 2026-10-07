import React, { Suspense, lazy, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';

// Lazy load the components
const Login = lazy(() => import('./components/Login/Login'));
const PatientRegistration = lazy(() => import('./components/PatientRegistration/PatientRegistration'));
const PatientPastInfo = lazy(() => import('./components/PatientPastInfo/PatientPastInfo'));
const PartPayment = lazy(() => import('./components/PartPayment/PartPayment'));
const RoomCharges = lazy(() => import('./components/RoomCharges/RoomCharges'));
const RoomStatus = lazy(() => import('./components/RoomStatus/RoomStatus'));
const OtEntry = lazy(() => import('./components/OtEntry/OtEntry'));
const OperationCharges = lazy(() => import('./components/OperationCharges/OperationCharges'));
const IndoorSummaryChart = lazy(() => import('./components/IndoorSummaryChart/IndoorSummaryChart'));
const InvestigationOrdered = lazy(() => import('./components/InvestigationOrdered/InvestigationOrdered'));
const IndoorRegister = lazy(() => import('./components/IndoorRegister/IndoorRegister'));
const IndoorOption = lazy(() => import('./components/IndoorOption/IndoorOption'));
const InpatientReceipt = lazy(() => import('./components/InpatientReceipt/InpatientReceipt'));
const InpatientBill = lazy(() => import('./components/InpatientBill/InpatientBill'));
const DischargeCard = lazy(() => import('./components/DischargeCard/DischargeCard'));
const DepositEntry = lazy(() => import('./components/DepositEntry/DepositEntry'));
const Billing = lazy(() => import('./components/Billing/Billing'));
const DrVisitProcedure = lazy(() => import('./components/DrVisitProcedure/DrVisitProcedure'));
const ContactList = lazy(() => import('./components/ContactList/ContactList'));
const IntercommDisplay = lazy(() => import('./components/IntercommDisplay/IntercommDisplay'));
const PatientHistory = lazy(() => import('./components/PatientHistory/PatientHistory'));
const MedicineMaster = lazy(() => import('./components/MedicineMaster/MedicineMaster'));
const StandardPrescriptionMaster = lazy(() => import('./components/StandardPrescriptionMaster/StandardPrescriptionMaster'));
const AdviceMaster = lazy(() => import('./components/AdviceMaster/AdviceMaster'));
const BedMaster = lazy(() => import('./components/BedMaster/BedMaster'));
const OperationGroupMaster = lazy(() => import('./components/OperationGroupMaster/OperationGroupMaster'));
const RoomTypeMaster = lazy(() => import('./components/RoomTypeMaster/RoomTypeMaster'));
const VisitingTypeMaster = lazy(() => import('./components/VisitingTypeMaster/VisitingTypeMaster'));
const VisitProcedureHeaderMaster = lazy(() => import('./components/VisitProcedureHeaderMaster/VisitProcedureHeaderMaster'));
const OPDPatientCategory = lazy(() => import('./components/OPDPatientCategory/OPDPatientCategory'));
const OPDChargesMaster = lazy(() => import('./components/OPDChargesMaster/OPDChargesMaster'));
const DepartmentMaster = lazy(() => import('./components/DepartmentMaster/DepartmentMaster'));
const DoctorMaster = lazy(() => import('./components/DoctorMaster/DoctorMaster'));
const InsuranceCompanyMaster = lazy(() => import('./components/InsuranceCompanyMaster/InsuranceCompanyMaster'));
const OPDChargesProfile = lazy(() => import('./components/OPDChargesProfile/OPDChargesProfile'));
const EchoReport = lazy(() => import('./components/EchoReport/EchoReport'));

// Navigation Bar Component (only shown when authenticated)
const NavigationBar = () => {
  const location = useLocation();
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [isMasterIpdOpen, setIsMasterIpdOpen] = useState(false);
  const [isMasterOpdOpen, setIsMasterOpdOpen] = useState(false);
  const [isDiagnosticsReportOpen, setIsDiagnosticsReportOpen] = useState(false);
  const [isUtilityOpen, setIsUtilityOpen] = useState(false);
  
  if (location.pathname === '/login') return null;

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: '10px 16px',
    borderRadius: '6px',
    backgroundColor: isActive ? '#EFF6FF' : 'transparent',
    color: isActive ? '#1D4ED8' : '#475467',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
    display: 'block'
  });

  const nestedLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    ...navLinkStyle({ isActive }),
    paddingLeft: '32px',
    fontSize: '13px'
  });

  return (
    <nav style={{ 
      width: '250px', 
      minWidth: '250px',
      padding: '24px 16px', 
      backgroundColor: '#FFFFFF', 
      borderRight: '1px solid #E2E8F0', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '8px', 
      overflowY: 'auto',
      boxSizing: 'border-box',
      height: '100vh'
    }}>
      <div style={{ padding: '0 16px 16px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 'bold', color: '#172033', flexShrink: 0 }}>
        Hospital System
      </div>
      <NavLink to="/patient-registration" style={navLinkStyle}>
        Patient Registration
      </NavLink>
      <NavLink to="/patient-past-info" style={navLinkStyle}>
        Patient Past Info
      </NavLink>
      <NavLink to="/part-payment" style={navLinkStyle}>
        Part Payment
      </NavLink>
      <NavLink to="/room-charges" style={navLinkStyle}>
        Room Charges
      </NavLink>
      <NavLink to="/room-status" style={navLinkStyle}>
        Room Status
      </NavLink>
      <NavLink to="/ot-entry" style={navLinkStyle}>
        OT Entry
      </NavLink>
      <NavLink to="/operation-charges" style={navLinkStyle}>
        Operation Charges
      </NavLink>
      <NavLink to="/indoor-summary" style={navLinkStyle}>
        Indoor Summary
      </NavLink>
      <NavLink to="/indoor-option" style={navLinkStyle}>
        Indoor Option
      </NavLink>
      <NavLink to="/inpatient-receipt" style={navLinkStyle}>
        Inpatient Receipt
      </NavLink>
      <NavLink to="/inpatient-bill" style={navLinkStyle}>
        Inpatient Bill
      </NavLink>
      <NavLink to="/discharge-card" style={navLinkStyle}>
        Discharge Card
      </NavLink>
      <NavLink to="/deposit-entry" style={navLinkStyle}>
        Deposit Entry
      </NavLink>
      <NavLink to="/billing" style={navLinkStyle}>
        Billing
      </NavLink>
      <NavLink to="/dr-visit-procedure" style={navLinkStyle}>
        Dr. Visit & Procedure
      </NavLink>
      <NavLink to="/investigation-ordered" style={navLinkStyle}>
        Investigation Ordered
      </NavLink>
      <NavLink to="/indoor-register" style={navLinkStyle}>
        Indoor Register
      </NavLink>

      {/* Nested Master Menu */}
      <div style={{ marginTop: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
        <button 
          onClick={() => setIsMasterOpen(!isMasterOpen)}
          style={{ 
            width: '100%', 
            textAlign: 'left', 
            padding: '10px 16px', 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: '#475467', 
            fontWeight: 600, 
            fontSize: '14px', 
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Master
          <span style={{ fontSize: '10px' }}>{isMasterOpen ? '▼' : '▶'}</span>
        </button>
        {isMasterOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <NavLink to="/patient-history" style={nestedLinkStyle}>
              Clinical / Patient History
            </NavLink>
            <NavLink to="/medicine-master" style={nestedLinkStyle}>
              Medicine Master
            </NavLink>
            <NavLink to="/standard-prescription-master" style={nestedLinkStyle}>
              Standard Prescription Master
            </NavLink>
            
            {/* IPD Sub-menu */}
            <button 
              onClick={() => setIsMasterIpdOpen(!isMasterIpdOpen)}
              style={{ 
                ...navLinkStyle({ isActive: false }),
                paddingLeft: '32px',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              IPD Master
              <span style={{ fontSize: '10px' }}>{isMasterIpdOpen ? '▼' : '▶'}</span>
            </button>
            {isMasterIpdOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <NavLink to="/advice-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/advice-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  Advice Master
                </NavLink>
                <NavLink to="/bed-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/bed-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  Bed Master
                </NavLink>
                <NavLink to="/operation-group-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/operation-group-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  Operation Group Master
                </NavLink>
                <NavLink to="/room-type-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/room-type-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  Room Type Master
                </NavLink>
                <NavLink to="/visiting-type-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/visiting-type-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  Visiting Type Master
                </NavLink>
                <NavLink to="/visit-procedure-header-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/visit-procedure-header-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  Visit Procedure Header Master
                </NavLink>
              </div>
            )}

            {/* OPD Sub-menu */}
            <button 
              onClick={() => setIsMasterOpdOpen(!isMasterOpdOpen)}
              style={{ 
                ...navLinkStyle({ isActive: false }),
                paddingLeft: '32px',
                textAlign: 'left',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                fontSize: '13px',
                fontWeight: 600
              }}
            >
              OPD Master
              <span style={{ fontSize: '10px' }}>{isMasterOpdOpen ? '▼' : '▶'}</span>
            </button>
            {isMasterOpdOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <NavLink to="/opd-patient-category" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/opd-patient-category' }), paddingLeft: '48px', fontSize: '12px' }}>
                  OPD Patient Category
                </NavLink>
                <NavLink to="/opd-charges-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/opd-charges-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  OPD Charges Master
                </NavLink>
                <NavLink to="/department-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/department-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  Department Master
                </NavLink>
                <NavLink to="/doctor-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/doctor-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  Doctor Master
                </NavLink>
                <NavLink to="/insurance-company-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/insurance-company-master' }), paddingLeft: '48px', fontSize: '12px' }}>
                  Insurance Company Master
                </NavLink>
                <NavLink to="/opd-charges-profile" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/opd-charges-profile' }), paddingLeft: '48px', fontSize: '12px' }}>
                  OPD Charges Profile
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nested Diagnostics Report Menu */}
      <div style={{ marginTop: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
        <button 
          onClick={() => setIsDiagnosticsReportOpen(!isDiagnosticsReportOpen)}
          style={{ 
            width: '100%', 
            textAlign: 'left', 
            padding: '10px 16px', 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: '#475467', 
            fontWeight: 600, 
            fontSize: '14px', 
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Diagnostics Report
          <span style={{ fontSize: '10px' }}>{isDiagnosticsReportOpen ? '▼' : '▶'}</span>
        </button>
        {isDiagnosticsReportOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <NavLink to="/echo-report" style={nestedLinkStyle}>
              Echo Report
            </NavLink>
          </div>
        )}
      </div>

      {/* Nested Utility Menu */}
      <div style={{ marginTop: '8px', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
        <button 
          onClick={() => setIsUtilityOpen(!isUtilityOpen)}
          style={{ 
            width: '100%', 
            textAlign: 'left', 
            padding: '10px 16px', 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: '#475467', 
            fontWeight: 600, 
            fontSize: '14px', 
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Utility
          <span style={{ fontSize: '10px' }}>{isUtilityOpen ? '▼' : '▶'}</span>
        </button>
        {isUtilityOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
            <NavLink to="/contact-list" style={nestedLinkStyle}>
              Contact List
            </NavLink>
            <NavLink to="/intercomm-display" style={nestedLinkStyle}>
              Intercomm Display
            </NavLink>
          </div>
        )}
      </div>

    </nav>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('auth', 'true');
  };

  return (
    <HashRouter>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', backgroundColor: '#F7F8FA' }}>
        
        {isAuthenticated && <NavigationBar />}

        {/* Main Content Area */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Loading...</div>}>
            <Routes>
              {!isAuthenticated ? (
                <>
                  <Route path="/login" element={<Login onLogin={handleLogin} />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              ) : (
                <>
                  <Route path="/login" element={<Navigate to="/patient-registration" replace />} />
                  <Route path="/" element={<Navigate to="/patient-registration" replace />} />
                  <Route path="/patient-registration" element={<PatientRegistration />} />
                  <Route path="/patient-past-info" element={<PatientPastInfo />} />
                  <Route path="/part-payment" element={<PartPayment />} />
                  <Route path="/room-charges" element={<RoomCharges />} />
                  <Route path="/room-status" element={<RoomStatus />} />
                  <Route path="/ot-entry" element={<OtEntry />} />
                  <Route path="/operation-charges" element={<OperationCharges />} />
                  <Route path="/indoor-summary" element={<IndoorSummaryChart />} />
                  <Route path="/indoor-option" element={<IndoorOption />} />
                  <Route path="/inpatient-receipt" element={<InpatientReceipt />} />
                  <Route path="/inpatient-bill" element={<InpatientBill />} />
                  <Route path="/discharge-card" element={<DischargeCard />} />
                  <Route path="/deposit-entry" element={<DepositEntry />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/dr-visit-procedure" element={<DrVisitProcedure />} />
                  <Route path="/investigation-ordered" element={<InvestigationOrdered />} />
                  <Route path="/indoor-register" element={<IndoorRegister />} />
                  <Route path="/contact-list" element={<ContactList />} />
                  <Route path="/intercomm-display" element={<IntercommDisplay />} />
                  <Route path="/patient-history" element={<PatientHistory />} />
                  <Route path="/medicine-master" element={<MedicineMaster />} />
                  <Route path="/standard-prescription-master" element={<StandardPrescriptionMaster />} />
                  <Route path="/advice-master" element={<AdviceMaster />} />
                  <Route path="/bed-master" element={<BedMaster />} />
                  <Route path="/operation-group-master" element={<OperationGroupMaster />} />
                  <Route path="/room-type-master" element={<RoomTypeMaster />} />
                  <Route path="/visiting-type-master" element={<VisitingTypeMaster />} />
                  <Route path="/visit-procedure-header-master" element={<VisitProcedureHeaderMaster />} />
                  
                  {/* OPD Master Routes */}
                  <Route path="/opd-patient-category" element={<OPDPatientCategory />} />
                  <Route path="/opd-charges-master" element={<OPDChargesMaster />} />
                  <Route path="/department-master" element={<DepartmentMaster />} />
                  <Route path="/doctor-master" element={<DoctorMaster />} />
                  <Route path="/insurance-company-master" element={<InsuranceCompanyMaster />} />
                  <Route path="/opd-charges-profile" element={<OPDChargesProfile />} />
                  
                  {/* Diagnostics Report Routes */}
                  <Route path="/echo-report" element={<EchoReport />} />
                  
                  <Route path="*" element={<Navigate to="/patient-registration" replace />} />
                </>
              )}
            </Routes>
          </Suspense>
        </div>
      </div>
    </HashRouter>
  )
}

export default App;
