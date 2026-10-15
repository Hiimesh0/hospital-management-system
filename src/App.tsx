import React, { Suspense, lazy, useState, useEffect } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  UserPlus,
  History,
  CreditCard,
  BedDouble,
  DoorOpen,
  HeartPulse,
  BadgeDollarSign,
  FileSpreadsheet,
  Layers,
  Receipt,
  FileText,
  Wallet,
  Calculator,
  Stethoscope,
  Microscope,
  Hospital,
  FolderPlus,
  Pill,
  FileSignature,
  Bed,
  MessageSquareCheck,
  Boxes,
  Building,
  Clock,
  ListPlus,
  ClipboardList,
  Users,
  Building2,
  UserCheck,
  ShieldCheck,
  UserCog,
  BarChart3,
  FileCode,
  LayoutTemplate,
  LayoutDashboard,
  Award,
  FileX,
  FileCheck2,
  Scale,
  FileBadge,
  Contact,
  Radio
} from 'lucide-react';

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

// Reusable Sidebar NavLink with Lucide Icon and Active State
interface SidebarLinkProps {
  to: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  label: string;
  onClick: () => void;
  nestedLevel?: number;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, onClick, nestedLevel = 0 }) => {
  const paddingLeft = nestedLevel === 0 ? '12px' : nestedLevel === 1 ? '24px' : '36px';
  const fontSize = nestedLevel === 0 ? '13.5px' : nestedLevel === 1 ? '13px' : '12px';

  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        padding: `8px 12px 8px ${paddingLeft}`,
        borderRadius: '6px',
        backgroundColor: isActive ? 'var(--primary-soft)' : 'transparent',
        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
        textDecoration: 'none',
        fontWeight: isActive ? 600 : 500,
        fontSize,
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.15s ease-in-out',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        minHeight: '38px',
        borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
      })}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={18}
            strokeWidth={isActive ? 2.2 : 1.75}
            style={{
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              flexShrink: 0,
              transition: 'color 0.15s ease-in-out'
            }}
            aria-hidden="true"
          />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        </>
      )}
    </NavLink>
  );
};

// Collapsible Navigation Accordion Group with Lucide Icons
interface NavGroupProps {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  isOpen: boolean;
  onToggle: () => void;
  nestedLevel?: number;
  children: React.ReactNode;
}

const NavGroup: React.FC<NavGroupProps> = ({ title, icon: Icon, isOpen, onToggle, nestedLevel = 0, children }) => {
  const paddingLeft = nestedLevel === 0 ? '12px' : '24px';
  const fontSize = nestedLevel === 0 ? '13.5px' : '13px';

  return (
    <div style={{ marginTop: nestedLevel === 0 ? '6px' : '2px', paddingTop: nestedLevel === 0 ? '6px' : '0' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: `8px 12px 8px ${paddingLeft}`,
          backgroundColor: isOpen ? 'rgba(66, 133, 244, 0.05)' : 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: isOpen ? 'var(--text-main)' : 'var(--text-muted)',
          fontWeight: 600,
          fontSize,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '38px',
          transition: 'all 0.15s ease-in-out',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <Icon
            size={18}
            strokeWidth={1.8}
            style={{
              color: isOpen ? 'var(--primary)' : 'var(--text-muted)',
              flexShrink: 0
            }}
            aria-hidden="true"
          />
          {title}
        </span>
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: 'var(--text-muted)',
            flexShrink: 0
          }}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// Navigation Bar Component (only shown when authenticated)
interface NavigationBarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();
  const p = location.pathname;

  // Active route matching for accordion groups
  const isMasterActive = [
    '/patient-history', '/medicine-master', '/standard-prescription-master',
    '/advice-master', '/bed-master', '/operation-group-master',
    '/room-type-master', '/visiting-type-master', '/visit-procedure-header-master',
    '/opd-patient-category', '/opd-charges-master', '/department-master',
    '/doctor-master', '/insurance-company-master', '/opd-charges-profile'
  ].includes(p);
  const isMasterIpdActive = [
    '/advice-master', '/bed-master', '/operation-group-master',
    '/room-type-master', '/visiting-type-master', '/visit-procedure-header-master'
  ].includes(p);
  const isMasterOpdActive = [
    '/opd-patient-category', '/opd-charges-master', '/department-master',
    '/doctor-master', '/insurance-company-master', '/opd-charges-profile'
  ].includes(p);
  const isDiagActive = [
    '/echo-report', '/short-form-master', '/report-template', '/today-report-dashboard'
  ].includes(p);
  const isCertActive = [
    '/death-certificate', '/medical-certificate', '/mlc-certificate', '/certificate-template'
  ].includes(p);
  const isUtilActive = [
    '/contact-list', '/intercomm-display'
  ].includes(p);

  const [masterExpanded, setMasterExpanded] = useState<boolean | null>(null);
  const [ipdExpanded, setIpdExpanded] = useState<boolean | null>(null);
  const [opdExpanded, setOpdExpanded] = useState<boolean | null>(null);
  const [diagExpanded, setDiagExpanded] = useState<boolean | null>(null);
  const [certExpanded, setCertExpanded] = useState<boolean | null>(null);
  const [utilExpanded, setUtilExpanded] = useState<boolean | null>(null);

  const isMasterOpen = masterExpanded ?? isMasterActive;
  const isMasterIpdOpen = ipdExpanded ?? isMasterIpdActive;
  const isMasterOpdOpen = opdExpanded ?? isMasterOpdActive;
  const isDiagnosticsReportOpen = diagExpanded ?? isDiagActive;
  const isCertificateOpen = certExpanded ?? isCertActive;
  const isUtilityOpen = utilExpanded ?? isUtilActive;

  if (p === '/login') return null;

  return (
    <aside
      id="main-sidebar-nav"
      className={`sidebarNav ${isOpen ? 'drawerOpen' : ''}`}
      aria-label="Main Navigation"
    >
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
          aria-label="Close navigation"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="sidebarLinks">
        {/* 17 Primary Menu Items with Specific Healthcare Icons */}
        <SidebarLink to="/patient-registration" icon={UserPlus} label="Patient Registration" onClick={onClose} />
        <SidebarLink to="/patient-past-info" icon={History} label="Patient Past Info" onClick={onClose} />
        <SidebarLink to="/part-payment" icon={CreditCard} label="Part Payment" onClick={onClose} />
        <SidebarLink to="/room-charges" icon={BedDouble} label="Room Charges" onClick={onClose} />
        <SidebarLink to="/room-status" icon={DoorOpen} label="Room Status" onClick={onClose} />
        <SidebarLink to="/ot-entry" icon={HeartPulse} label="OT Entry" onClick={onClose} />
        <SidebarLink to="/operation-charges" icon={BadgeDollarSign} label="Operation Charges" onClick={onClose} />
        <SidebarLink to="/indoor-summary" icon={FileSpreadsheet} label="Indoor Summary" onClick={onClose} />
        <SidebarLink to="/indoor-option" icon={Layers} label="Indoor Option" onClick={onClose} />
        <SidebarLink to="/inpatient-receipt" icon={Receipt} label="Inpatient Receipt" onClick={onClose} />
        <SidebarLink to="/inpatient-bill" icon={FileText} label="Inpatient Bill" onClick={onClose} />
        <SidebarLink to="/discharge-card" icon={LogOut} label="Discharge Card" onClick={onClose} />
        <SidebarLink to="/deposit-entry" icon={Wallet} label="Deposit Entry" onClick={onClose} />
        <SidebarLink to="/billing" icon={Calculator} label="Billing" onClick={onClose} />
        <SidebarLink to="/dr-visit-procedure" icon={Stethoscope} label="Dr. Visit & Procedure" onClick={onClose} />
        <SidebarLink to="/investigation-ordered" icon={Microscope} label="Investigation Ordered" onClick={onClose} />
        <SidebarLink to="/indoor-register" icon={Hospital} label="Indoor Register" onClick={onClose} />

        {/* Master Accordion */}
        <NavGroup
          title="Master"
          icon={FolderPlus}
          isOpen={isMasterOpen}
          onToggle={() => setMasterExpanded(!isMasterOpen)}
        >
          <SidebarLink to="/patient-history" icon={History} label="Clinical / Patient History" onClick={onClose} nestedLevel={1} />
          <SidebarLink to="/medicine-master" icon={Pill} label="Medicine Master" onClick={onClose} nestedLevel={1} />
          <SidebarLink to="/standard-prescription-master" icon={FileSignature} label="Standard Prescription Master" onClick={onClose} nestedLevel={1} />

          {/* IPD Master Sub-group */}
          <NavGroup
            title="IPD Master"
            icon={Bed}
            isOpen={isMasterIpdOpen}
            onToggle={() => setIpdExpanded(!isMasterIpdOpen)}
            nestedLevel={1}
          >
            <SidebarLink to="/advice-master" icon={MessageSquareCheck} label="Advice Master" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/bed-master" icon={Bed} label="Bed Master" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/operation-group-master" icon={Boxes} label="Operation Group Master" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/room-type-master" icon={Building} label="Room Type Master" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/visiting-type-master" icon={Clock} label="Visiting Type Master" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/visit-procedure-header-master" icon={ListPlus} label="Visit Procedure Header Master" onClick={onClose} nestedLevel={2} />
          </NavGroup>

          {/* OPD Master Sub-group */}
          <NavGroup
            title="OPD Master"
            icon={ClipboardList}
            isOpen={isMasterOpdOpen}
            onToggle={() => setOpdExpanded(!isMasterOpdOpen)}
            nestedLevel={1}
          >
            <SidebarLink to="/opd-patient-category" icon={Users} label="OPD Patient Category" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/opd-charges-master" icon={BadgeDollarSign} label="OPD Charges Master" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/department-master" icon={Building2} label="Department Master" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/doctor-master" icon={UserCheck} label="Doctor Master" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/insurance-company-master" icon={ShieldCheck} label="Insurance Company Master" onClick={onClose} nestedLevel={2} />
            <SidebarLink to="/opd-charges-profile" icon={UserCog} label="OPD Charges Profile" onClick={onClose} nestedLevel={2} />
          </NavGroup>
        </NavGroup>

        {/* Diagnostics Report Accordion */}
        <NavGroup
          title="Diagnostics Report"
          icon={BarChart3}
          isOpen={isDiagnosticsReportOpen}
          onToggle={() => setDiagExpanded(!isDiagnosticsReportOpen)}
        >
          <SidebarLink to="/echo-report" icon={HeartPulse} label="Echo Report" onClick={onClose} nestedLevel={1} />
          <SidebarLink to="/short-form-master" icon={FileCode} label="Short Form Master" onClick={onClose} nestedLevel={1} />
          <SidebarLink to="/report-template" icon={LayoutTemplate} label="Report Template" onClick={onClose} nestedLevel={1} />
          <SidebarLink to="/today-report-dashboard" icon={LayoutDashboard} label="Today Report Dashboard" onClick={onClose} nestedLevel={1} />
        </NavGroup>

        {/* Certificate Accordion */}
        <NavGroup
          title="Certificate"
          icon={Award}
          isOpen={isCertificateOpen}
          onToggle={() => setCertExpanded(!isCertificateOpen)}
        >
          <SidebarLink to="/death-certificate" icon={FileX} label="Death Certificate" onClick={onClose} nestedLevel={1} />
          <SidebarLink to="/medical-certificate" icon={FileCheck2} label="Medical Certificate" onClick={onClose} nestedLevel={1} />
          <SidebarLink to="/mlc-certificate" icon={Scale} label="MLC Certificate" onClick={onClose} nestedLevel={1} />
          <SidebarLink to="/certificate-template" icon={FileBadge} label="Certificate Template" onClick={onClose} nestedLevel={1} />
        </NavGroup>

        {/* Utility Accordion */}
        <NavGroup
          title="Utility"
          icon={Contact}
          isOpen={isUtilityOpen}
          onToggle={() => setUtilExpanded(!isUtilityOpen)}
        >
          <SidebarLink to="/contact-list" icon={Contact} label="Contact List" onClick={onClose} nestedLevel={1} />
          <SidebarLink to="/intercomm-display" icon={Radio} label="Intercomm Display" onClick={onClose} nestedLevel={1} />
        </NavGroup>
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
          aria-label="Sign out of hospital management system"
        >
          <LogOut size={16} aria-hidden="true" />
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
          <header className="mobileTopBar" role="banner">
            <button 
              className="mobileMenuBtn" 
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              aria-label={isMobileNavOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileNavOpen}
              aria-controls="main-sidebar-nav"
            >
              {isMobileNavOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
            <div className="mobileTopBrand">
              <span className="mobileTopBrandCross" aria-hidden="true">+</span>
              Hospital System
            </div>
            <button 
              className="mobileLogoutBtn" 
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <LogOut size={14} aria-hidden="true" />
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
