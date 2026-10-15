import React, { Suspense, lazy, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';

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
const ShortFormMaster = lazy(() => import('./components/ShortFormMaster/ShortFormMaster'));
const ReportTemplate = lazy(() => import('./components/ReportTemplate/ReportTemplate'));
const TodayReportDashboard = lazy(() => import('./components/TodayReportDashboard/TodayReportDashboard'));
const DeathCertificate = lazy(() => import('./components/DeathCertificate/DeathCertificate'));
const MedicalCertificate = lazy(() => import('./components/MedicalCertificate/MedicalCertificate'));
const MlcCertificate = lazy(() => import('./components/MlcCertificate/MlcCertificate'));
const CertificateTemplate = lazy(() => import('./components/CertificateTemplate/CertificateTemplate'));

// Navigation Bar Component (only shown when authenticated)
interface NavigationBarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const [isMasterOpen, setIsMasterOpen] = useState(false);
  const [isMasterIpdOpen, setIsMasterIpdOpen] = useState(false);
  const [isMasterOpdOpen, setIsMasterOpdOpen] = useState(false);
  const [isDiagnosticsReportOpen, setIsDiagnosticsReportOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isUtilityOpen, setIsUtilityOpen] = useState(false);
  
  if (location.pathname === '/login') return null;

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: '10px 14px',
    borderRadius: '6px',
    backgroundColor: isActive ? 'var(--primary-soft)' : 'transparent',
    color: isActive ? 'var(--primary-hover)' : 'var(--text-muted)',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    transition: 'all 0.15s ease-in-out',
    whiteSpace: 'nowrap' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minHeight: '40px'
  });

  const nestedLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    ...navLinkStyle({ isActive }),
    paddingLeft: '28px',
    fontSize: '13px',
    minHeight: '36px'
  });

  return (
    <aside className={`sidebarNav ${isOpen ? 'drawerOpen' : ''}`} aria-label="Main Navigation">
      <div className="sidebarHeader">
        <div className="sidebarTitle">
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '28px', 
            height: '28px', 
            borderRadius: '6px', 
            backgroundColor: 'var(--primary)', 
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '15px'
          }}>+</span>
          Hospital System
        </div>
        <button 
          onClick={onClose} 
          className="sidebarCloseBtn"
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebarLinks">
        <NavLink to="/patient-registration" style={navLinkStyle} onClick={onClose}>
          Patient Registration
        </NavLink>
        <NavLink to="/patient-past-info" style={navLinkStyle} onClick={onClose}>
          Patient Past Info
        </NavLink>
        <NavLink to="/part-payment" style={navLinkStyle} onClick={onClose}>
          Part Payment
        </NavLink>
        <NavLink to="/room-charges" style={navLinkStyle} onClick={onClose}>
          Room Charges
        </NavLink>
        <NavLink to="/room-status" style={navLinkStyle} onClick={onClose}>
          Room Status
        </NavLink>
        <NavLink to="/ot-entry" style={navLinkStyle} onClick={onClose}>
          OT Entry
        </NavLink>
        <NavLink to="/operation-charges" style={navLinkStyle} onClick={onClose}>
          Operation Charges
        </NavLink>
        <NavLink to="/indoor-summary" style={navLinkStyle} onClick={onClose}>
          Indoor Summary
        </NavLink>
        <NavLink to="/indoor-option" style={navLinkStyle} onClick={onClose}>
          Indoor Option
        </NavLink>
        <NavLink to="/inpatient-receipt" style={navLinkStyle} onClick={onClose}>
          Inpatient Receipt
        </NavLink>
        <NavLink to="/inpatient-bill" style={navLinkStyle} onClick={onClose}>
          Inpatient Bill
        </NavLink>
        <NavLink to="/discharge-card" style={navLinkStyle} onClick={onClose}>
          Discharge Card
        </NavLink>
        <NavLink to="/deposit-entry" style={navLinkStyle} onClick={onClose}>
          Deposit Entry
        </NavLink>
        <NavLink to="/billing" style={navLinkStyle} onClick={onClose}>
          Billing
        </NavLink>
        <NavLink to="/dr-visit-procedure" style={navLinkStyle} onClick={onClose}>
          Dr. Visit & Procedure
        </NavLink>
        <NavLink to="/investigation-ordered" style={navLinkStyle} onClick={onClose}>
          Investigation Ordered
        </NavLink>
        <NavLink to="/indoor-register" style={navLinkStyle} onClick={onClose}>
          Indoor Register
        </NavLink>

        {/* Nested Master Menu */}
        <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
          <button 
            onClick={() => setIsMasterOpen(!isMasterOpen)}
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              padding: '10px 14px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontWeight: 600, 
              fontSize: '14px', 
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '40px'
            }}
          >
            Master
            <span style={{ fontSize: '10px' }}>{isMasterOpen ? '▼' : '▶'}</span>
          </button>
          {isMasterOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
              <NavLink to="/patient-history" style={nestedLinkStyle} onClick={onClose}>
                Clinical / Patient History
              </NavLink>
              <NavLink to="/medicine-master" style={nestedLinkStyle} onClick={onClose}>
                Medicine Master
              </NavLink>
              <NavLink to="/standard-prescription-master" style={nestedLinkStyle} onClick={onClose}>
                Standard Prescription Master
              </NavLink>
              
              {/* IPD Sub-menu */}
              <button 
                onClick={() => setIsMasterIpdOpen(!isMasterIpdOpen)}
                style={{ 
                  ...navLinkStyle({ isActive: false }),
                  paddingLeft: '28px',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  fontSize: '13px',
                  fontWeight: 600,
                  minHeight: '36px'
                }}
              >
                IPD Master
                <span style={{ fontSize: '10px' }}>{isMasterIpdOpen ? '▼' : '▶'}</span>
              </button>
              {isMasterIpdOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <NavLink to="/advice-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/advice-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    Advice Master
                  </NavLink>
                  <NavLink to="/bed-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/bed-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    Bed Master
                  </NavLink>
                  <NavLink to="/operation-group-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/operation-group-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    Operation Group Master
                  </NavLink>
                  <NavLink to="/room-type-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/room-type-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    Room Type Master
                  </NavLink>
                  <NavLink to="/visiting-type-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/visiting-type-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    Visiting Type Master
                  </NavLink>
                  <NavLink to="/visit-procedure-header-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/visit-procedure-header-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    Visit Procedure Header Master
                  </NavLink>
                </div>
              )}

              {/* OPD Sub-menu */}
              <button 
                onClick={() => setIsMasterOpdOpen(!isMasterOpdOpen)}
                style={{ 
                  ...navLinkStyle({ isActive: false }),
                  paddingLeft: '28px',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  fontSize: '13px',
                  fontWeight: 600,
                  minHeight: '36px'
                }}
              >
                OPD Master
                <span style={{ fontSize: '10px' }}>{isMasterOpdOpen ? '▼' : '▶'}</span>
              </button>
              {isMasterOpdOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <NavLink to="/opd-patient-category" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/opd-patient-category' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    OPD Patient Category
                  </NavLink>
                  <NavLink to="/opd-charges-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/opd-charges-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    OPD Charges Master
                  </NavLink>
                  <NavLink to="/department-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/department-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    Department Master
                  </NavLink>
                  <NavLink to="/doctor-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/doctor-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    Doctor Master
                  </NavLink>
                  <NavLink to="/insurance-company-master" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/insurance-company-master' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    Insurance Company Master
                  </NavLink>
                  <NavLink to="/opd-charges-profile" style={{ ...nestedLinkStyle({ isActive: location.pathname === '/opd-charges-profile' }), paddingLeft: '44px', fontSize: '12px' }} onClick={onClose}>
                    OPD Charges Profile
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Nested Diagnostics Report Menu */}
        <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
          <button 
            onClick={() => setIsDiagnosticsReportOpen(!isDiagnosticsReportOpen)}
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              padding: '10px 14px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontWeight: 600, 
              fontSize: '14px', 
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '40px'
            }}
          >
            Diagnostics Report
            <span style={{ fontSize: '10px' }}>{isDiagnosticsReportOpen ? '▼' : '▶'}</span>
          </button>
          {isDiagnosticsReportOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
              <NavLink to="/echo-report" style={nestedLinkStyle} onClick={onClose}>
                Echo Report
              </NavLink>
              <NavLink to="/short-form-master" style={nestedLinkStyle} onClick={onClose}>
                Short Form Master
              </NavLink>
              <NavLink to="/report-template" style={nestedLinkStyle} onClick={onClose}>
                Report Template
              </NavLink>
              <NavLink to="/today-report-dashboard" style={nestedLinkStyle} onClick={onClose}>
                Today Report Dashboard
              </NavLink>
            </div>
          )}
        </div>

        {/* Nested Certificate Menu */}
        <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
          <button 
            onClick={() => setIsCertificateOpen(!isCertificateOpen)}
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              padding: '10px 14px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontWeight: 600, 
              fontSize: '14px', 
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '40px'
            }}
          >
            Certificate
            <span style={{ fontSize: '10px' }}>{isCertificateOpen ? '▼' : '▶'}</span>
          </button>
          {isCertificateOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
              <NavLink to="/death-certificate" style={nestedLinkStyle} onClick={onClose}>
                Death Certificate
              </NavLink>
              <NavLink to="/medical-certificate" style={nestedLinkStyle} onClick={onClose}>
                Medical Certificate
              </NavLink>
              <NavLink to="/mlc-certificate" style={nestedLinkStyle} onClick={onClose}>
                MLC Certificate
              </NavLink>
              <NavLink to="/certificate-template" style={nestedLinkStyle} onClick={onClose}>
                Certificate Template
              </NavLink>
            </div>
          )}
        </div>

        {/* Nested Utility Menu */}
        <div style={{ marginTop: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
          <button 
            onClick={() => setIsUtilityOpen(!isUtilityOpen)}
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              padding: '10px 14px', 
              backgroundColor: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              fontWeight: 600, 
              fontSize: '14px', 
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: '40px'
            }}
          >
            Utility
            <span style={{ fontSize: '10px' }}>{isUtilityOpen ? '▼' : '▶'}</span>
          </button>
          {isUtilityOpen && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px' }}>
              <NavLink to="/contact-list" style={nestedLinkStyle} onClick={onClose}>
                Contact List
              </NavLink>
              <NavLink to="/intercomm-display" style={nestedLinkStyle} onClick={onClose}>
                Intercomm Display
              </NavLink>
            </div>
          )}
        </div>
      </div>

      <div className="sidebarFooter">
        <button 
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px 14px',
            backgroundColor: 'var(--danger-soft)',
            color: 'var(--danger)',
            border: '1px solid var(--danger-soft)',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileNavOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsMobileNavOpen(false);
    localStorage.removeItem('auth');
  };

  return (
    <HashRouter>
      <div className="appLayout">
        
        {/* Mobile Top Header */}
        {isAuthenticated && (
          <header className="mobileTopBar">
            <button 
              className="mobileMenuBtn" 
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="mobileTopBrand">
              <span className="mobileTopBrandCross">+</span>
              Hospital System
            </div>
            <button 
              className="mobileLogoutBtn" 
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <LogOut size={14} />
              Exit
            </button>
          </header>
        )}

        {/* Mobile Backdrop Overlay */}
        {isAuthenticated && (
          <div 
            className={`sidebarBackdrop ${isMobileNavOpen ? 'drawerOpen' : ''}`}
            onClick={() => setIsMobileNavOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar / Slide-in Drawer */}
        {isAuthenticated && (
          <NavigationBar 
            isOpen={isMobileNavOpen} 
            onClose={() => setIsMobileNavOpen(false)} 
            onLogout={handleLogout}
          />
        )}

        {/* Main Content Area */}
        <main className="appMainContent">
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
                  <Route path="/short-form-master" element={<ShortFormMaster />} />
                  <Route path="/report-template" element={<ReportTemplate />} />
                  <Route path="/today-report-dashboard" element={<TodayReportDashboard />} />
                  
                  {/* Certificate Routes */}
                  <Route path="/death-certificate" element={<DeathCertificate />} />
                  <Route path="/medical-certificate" element={<MedicalCertificate />} />
                  <Route path="/mlc-certificate" element={<MlcCertificate />} />
                  <Route path="/certificate-template" element={<CertificateTemplate />} />
                  
                  <Route path="*" element={<Navigate to="/patient-registration" replace />} />
                </>
              )}
            </Routes>
          </Suspense>
        </main>
      </div>
    </HashRouter>
  )
}

export default App;
