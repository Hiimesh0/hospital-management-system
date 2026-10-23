import React, { Suspense, lazy, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
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
import mixuLogo from './assets/mixu-infosystem-logo.png';

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
  isCollapsed?: boolean;
  onHoverTooltip?: (e: React.MouseEvent, label: string) => void;
  onLeaveTooltip?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  label,
  onClick,
  nestedLevel = 0,
  isCollapsed = false,
  onHoverTooltip,
  onLeaveTooltip
}) => {
  const paddingLeft = isCollapsed ? '0px' : nestedLevel === 0 ? '12px' : nestedLevel === 1 ? '24px' : '36px';
  const fontSize = nestedLevel === 0 ? '13.5px' : nestedLevel === 1 ? '13px' : '12px';

  return (
    <NavLink
      to={to}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (isCollapsed && onHoverTooltip) onHoverTooltip(e, label);
      }}
      onMouseLeave={() => {
        if (isCollapsed && onLeaveTooltip) onLeaveTooltip();
      }}
      title={isCollapsed ? label : undefined}
      style={({ isActive }) => ({
        padding: isCollapsed ? '9px 0' : `8px 12px 8px ${paddingLeft}`,
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
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '9px',
        minHeight: '38px',
        borderLeft: isCollapsed ? 'none' : isActive ? '3px solid var(--primary)' : '3px solid transparent',
        borderRight: isCollapsed && isActive ? '3px solid var(--primary)' : 'none',
        position: 'relative'
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
          {!isCollapsed && (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          )}
        </>
      )}
    </NavLink>
  );
};

// Collapsible Navigation Group with Smart Hover & Flyout Support
interface NavGroupProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  isOpen: boolean;
  isChildActive: boolean;
  isCollapsed: boolean;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  onToggle: () => void;
  nestedLevel?: number;
  flyoutTop?: number;
  children: React.ReactNode;
}

const NavGroup: React.FC<NavGroupProps> = ({
  title,
  icon: Icon,
  isOpen,
  isChildActive,
  isCollapsed,
  onMouseEnter,
  onMouseLeave,
  onToggle,
  nestedLevel = 0,
  flyoutTop = 0,
  children
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const flyoutRef = useRef<HTMLDivElement | null>(null);
  const [flyoutStyle, setFlyoutStyle] = useState<{ top: number; maxHeight?: number }>({
    top: flyoutTop || 0
  });

  useLayoutEffect(() => {
    if (!isCollapsed || !isOpen) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const btnRect = buttonRef.current.getBoundingClientRect();
      const parentTop = btnRect.top;
      const viewportHeight = window.innerHeight;
      const margin = 12;

      const flyoutEl = flyoutRef.current;
      const flyoutHeight = flyoutEl ? flyoutEl.offsetHeight : 180;

      // Primary rule: Top edge of submenu aligns directly with top edge of parent button
      let targetTop = parentTop;

      // Boundary rule: If extending beyond bottom of viewport, adjust upward only as much as necessary
      if (targetTop + flyoutHeight + margin > viewportHeight) {
        targetTop = Math.max(margin, viewportHeight - flyoutHeight - margin);
      }

      const availableMaxHeight = Math.max(160, viewportHeight - (2 * margin));

      setFlyoutStyle({
        top: targetTop,
        maxHeight: availableMaxHeight
      });
    };

    updatePosition();

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isCollapsed, isOpen, flyoutTop]);

  const paddingLeft = isCollapsed ? '0px' : nestedLevel === 0 ? '12px' : '24px';
  const fontSize = nestedLevel === 0 ? '13.5px' : '13px';

  return (
    <div
      className="navGroupWrapper"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        marginTop: nestedLevel === 0 ? '6px' : '2px',
        paddingTop: nestedLevel === 0 ? '6px' : '0',
        position: 'relative'
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: isCollapsed ? '9px 0' : `8px 12px 8px ${paddingLeft}`,
          backgroundColor: isOpen || isChildActive ? 'rgba(66, 133, 244, 0.08)' : 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: isOpen || isChildActive ? 'var(--primary)' : 'var(--text-muted)',
          fontWeight: 600,
          fontSize,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          minHeight: '38px',
          transition: 'all 0.15s ease-in-out',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          borderLeft: isCollapsed ? 'none' : isChildActive ? '3px solid var(--primary)' : '3px solid transparent',
          borderRight: isCollapsed && isChildActive ? '3px solid var(--primary)' : 'none'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
          <Icon
            size={18}
            strokeWidth={isChildActive ? 2.1 : 1.8}
            style={{
              color: isChildActive || isOpen ? 'var(--primary)' : 'var(--text-muted)',
              flexShrink: 0
            }}
            aria-hidden="true"
          />
          {!isCollapsed && (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {title}
            </span>
          )}
        </span>

        {!isCollapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isChildActive && <span className="navGroupActiveDot" aria-label="Active category indicator" />}
            <ChevronDown
              size={16}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                color: isOpen || isChildActive ? 'var(--primary)' : 'var(--text-muted)',
                flexShrink: 0
              }}
              aria-hidden="true"
            />
          </div>
        )}

        {isCollapsed && isChildActive && (
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)'
            }}
          />
        )}
      </button>

      {/* Expanded Mode: Inline Accordion Submenu beneath Parent */}
      {!isCollapsed && isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '3px' }}>
          {children}
        </div>
      )}

      {/* Collapsed Mode: Anchored Floating Flyout Submenu */}
      {isCollapsed && isOpen && (
        <div
          ref={flyoutRef}
          className="sidebarFlyout"
          style={{
            top: `${flyoutStyle.top}px`,
            maxHeight: flyoutStyle.maxHeight ? `${flyoutStyle.maxHeight}px` : 'calc(100vh - 24px)'
          }}
          role="region"
          aria-label={`${title} submenu`}
        >
          <div className="flyoutHeader">
            <Icon size={16} style={{ color: 'var(--primary)' }} />
            <span>{title}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Navigation Bar Component with Collapsible State & Smart Hover
interface NavigationBarProps {
  isMobileOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  isMobileOpen,
  isCollapsed,
  onToggleCollapse,
  onCloseMobile,
  onLogout
}) => {
  const location = useLocation();
  const p = location.pathname;

  // Active route matching for parent and sub-groups
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

  // Smart hover state management (Only hovered parent opens; unrelated remain closed)
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);
  const [hoveredSubGroupId, setHoveredSubGroupId] = useState<string | null>(null);
  const [tappedGroupId, setTappedGroupId] = useState<string | null>(null);
  const [tappedSubGroupId, setTappedSubGroupId] = useState<string | null>(null);

  const [flyoutTop, setFlyoutTop] = useState<number>(0);
  const [activeTooltip, setActiveTooltip] = useState<{ text: string; top: number } | null>(null);

  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const subLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close flyouts and tooltips on route change or Escape
  useEffect(() => {
    setHoveredGroupId(null);
    setHoveredSubGroupId(null);
    setActiveTooltip(null);
  }, [p]);

  const handleGroupMouseEnter = (groupId: string, e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth <= 1024) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredGroupId(groupId);
    if (isCollapsed) {
      const btn = e.currentTarget.querySelector('button');
      const rect = btn ? btn.getBoundingClientRect() : e.currentTarget.getBoundingClientRect();
      setFlyoutTop(rect.top);
      setActiveTooltip(null);
    }
  };

  const handleGroupMouseLeave = () => {
    if (window.innerWidth <= 1024) return;
    leaveTimerRef.current = setTimeout(() => {
      setHoveredGroupId(null);
      setHoveredSubGroupId(null);
    }, 180); // 180ms safe delay prevents flicker when moving pointer into submenu
  };

  const handleSubGroupMouseEnter = (subGroupId: string) => {
    if (window.innerWidth <= 1024) return;
    if (subLeaveTimerRef.current) {
      clearTimeout(subLeaveTimerRef.current);
      subLeaveTimerRef.current = null;
    }
    setHoveredSubGroupId(subGroupId);
  };

  const handleSubGroupMouseLeave = () => {
    if (window.innerWidth <= 1024) return;
    subLeaveTimerRef.current = setTimeout(() => {
      setHoveredSubGroupId(null);
    }, 180);
  };

  const handleGroupToggle = (groupId: string) => {
    setTappedGroupId(prev => (prev === groupId ? null : groupId));
  };

  const handleSubGroupToggle = (subGroupId: string) => {
    setTappedSubGroupId(prev => (prev === subGroupId ? null : subGroupId));
  };

  const handleHoverTooltip = (e: React.MouseEvent, text: string) => {
    if (!isCollapsed || window.innerWidth <= 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({ text, top: rect.top + 4 });
  };

  const handleLeaveTooltip = () => {
    setActiveTooltip(null);
  };

  if (p === '/login') return null;

  // Decide if group is open based on hover (desktop) or tap (mobile/click)
  const isMasterOpen = hoveredGroupId === 'master' || tappedGroupId === 'master';
  const isMasterIpdOpen = hoveredSubGroupId === 'ipd' || tappedSubGroupId === 'ipd';
  const isMasterOpdOpen = hoveredSubGroupId === 'opd' || tappedSubGroupId === 'opd';
  const isDiagnosticsReportOpen = hoveredGroupId === 'diag' || tappedGroupId === 'diag';
  const isCertificateOpen = hoveredGroupId === 'cert' || tappedGroupId === 'cert';
  const isUtilityOpen = hoveredGroupId === 'util' || tappedGroupId === 'util';

  return (
    <aside
      id="main-sidebar-nav"
      className={`sidebarNav ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'drawerOpen' : ''}`}
      aria-label="Main Navigation"
    >
      {/* Floating Tooltip in Collapsed Mode */}
      {isCollapsed && activeTooltip && (
        <div className="sidebarTooltip" style={{ top: activeTooltip.top }}>
          {activeTooltip.text}
        </div>
      )}

      {/* Sidebar Header with Mixu Infosystem Emblem & Toggle Button */}
      <div className="sidebarHeader">
        {!isCollapsed ? (
          <>
            <div className="sidebarTitle">
              <img
                src={mixuLogo}
                alt="Mixu Infosystem Logo"
                style={{
                  width: '28px',
                  height: '28px',
                  objectFit: 'contain',
                  flexShrink: 0,
                  borderRadius: '4px'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>Hospital System</span>
                <span style={{ fontSize: '10.5px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>Mixu Infosystem</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="sidebarToggleBtn"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={18} aria-hidden="true" />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '8px' }}>
            <img
              src={mixuLogo}
              alt="Mixu Infosystem Logo"
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain',
                borderRadius: '4px'
              }}
            />
            <button
              type="button"
              onClick={onToggleCollapse}
              className="sidebarToggleBtn"
              title="Expand sidebar"
              aria-label="Expand sidebar"
              style={{ width: '100%' }}
            >
              <PanelLeftOpen size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        <button
          onClick={onCloseMobile}
          className="sidebarCloseBtn"
          aria-label="Close navigation"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      {/* Sidebar Links Scroll Area */}
      <div className="sidebarLinks">
        {/* 17 Primary Menu Items with Specific Healthcare Icons */}
        <SidebarLink to="/patient-registration" icon={UserPlus} label="Patient Registration" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/patient-past-info" icon={History} label="Patient Past Info" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/part-payment" icon={CreditCard} label="Part Payment" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/room-charges" icon={BedDouble} label="Room Charges" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/room-status" icon={DoorOpen} label="Room Status" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/ot-entry" icon={HeartPulse} label="OT Entry" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/operation-charges" icon={BadgeDollarSign} label="Operation Charges" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/indoor-summary" icon={FileSpreadsheet} label="Indoor Summary" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/indoor-option" icon={Layers} label="Indoor Option" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/inpatient-receipt" icon={Receipt} label="Inpatient Receipt" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/inpatient-bill" icon={FileText} label="Inpatient Bill" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/discharge-card" icon={LogOut} label="Discharge Card" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/deposit-entry" icon={Wallet} label="Deposit Entry" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/billing" icon={Calculator} label="Billing" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/dr-visit-procedure" icon={Stethoscope} label="Dr. Visit & Procedure" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/investigation-ordered" icon={Microscope} label="Investigation Ordered" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />
        <SidebarLink to="/indoor-register" icon={Hospital} label="Indoor Register" onClick={onCloseMobile} isCollapsed={isCollapsed} onHoverTooltip={handleHoverTooltip} onLeaveTooltip={handleLeaveTooltip} />

        {/* Master Accordion / Flyout */}
        <NavGroup
          id="master"
          title="Master"
          icon={FolderPlus}
          isOpen={isMasterOpen}
          isChildActive={isMasterActive}
          isCollapsed={isCollapsed}
          flyoutTop={flyoutTop}
          onMouseEnter={(e) => handleGroupMouseEnter('master', e)}
          onMouseLeave={handleGroupMouseLeave}
          onToggle={() => handleGroupToggle('master')}
        >
          <SidebarLink to="/patient-history" icon={History} label="Clinical / Patient History" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
          <SidebarLink to="/medicine-master" icon={Pill} label="Medicine Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
          <SidebarLink to="/standard-prescription-master" icon={FileSignature} label="Standard Prescription Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />

          {/* IPD Master Sub-group */}
          <NavGroup
            id="ipd"
            title="IPD Master"
            icon={Bed}
            isOpen={isMasterIpdOpen}
            isChildActive={isMasterIpdActive}
            isCollapsed={false}
            nestedLevel={isCollapsed ? 0 : 1}
            onMouseEnter={() => handleSubGroupMouseEnter('ipd')}
            onMouseLeave={handleSubGroupMouseLeave}
            onToggle={() => handleSubGroupToggle('ipd')}
          >
            <SidebarLink to="/advice-master" icon={MessageSquareCheck} label="Advice Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/bed-master" icon={Bed} label="Bed Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/operation-group-master" icon={Boxes} label="Operation Group Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/room-type-master" icon={Building} label="Room Type Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/visiting-type-master" icon={Clock} label="Visiting Type Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/visit-procedure-header-master" icon={ListPlus} label="Visit Procedure Header Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
          </NavGroup>

          {/* OPD Master Sub-group */}
          <NavGroup
            id="opd"
            title="OPD Master"
            icon={ClipboardList}
            isOpen={isMasterOpdOpen}
            isChildActive={isMasterOpdActive}
            isCollapsed={false}
            nestedLevel={isCollapsed ? 0 : 1}
            onMouseEnter={() => handleSubGroupMouseEnter('opd')}
            onMouseLeave={handleSubGroupMouseLeave}
            onToggle={() => handleSubGroupToggle('opd')}
          >
            <SidebarLink to="/opd-patient-category" icon={Users} label="OPD Patient Category" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/opd-charges-master" icon={BadgeDollarSign} label="OPD Charges Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/department-master" icon={Building2} label="Department Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/doctor-master" icon={UserCheck} label="Doctor Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/insurance-company-master" icon={ShieldCheck} label="Insurance Company Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
            <SidebarLink to="/opd-charges-profile" icon={UserCog} label="OPD Charges Profile" onClick={onCloseMobile} nestedLevel={isCollapsed ? 1 : 2} />
          </NavGroup>
        </NavGroup>

        {/* Diagnostics Report Accordion / Flyout */}
        <NavGroup
          id="diag"
          title="Diagnostics Report"
          icon={BarChart3}
          isOpen={isDiagnosticsReportOpen}
          isChildActive={isDiagActive}
          isCollapsed={isCollapsed}
          flyoutTop={flyoutTop}
          onMouseEnter={(e) => handleGroupMouseEnter('diag', e)}
          onMouseLeave={handleGroupMouseLeave}
          onToggle={() => handleGroupToggle('diag')}
        >
          <SidebarLink to="/echo-report" icon={HeartPulse} label="Echo Report" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
          <SidebarLink to="/short-form-master" icon={FileCode} label="Short Form Master" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
          <SidebarLink to="/report-template" icon={LayoutTemplate} label="Report Template" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
          <SidebarLink to="/today-report-dashboard" icon={LayoutDashboard} label="Today Report Dashboard" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
        </NavGroup>

        {/* Certificate Accordion / Flyout */}
        <NavGroup
          id="cert"
          title="Certificate"
          icon={Award}
          isOpen={isCertificateOpen}
          isChildActive={isCertActive}
          isCollapsed={isCollapsed}
          flyoutTop={flyoutTop}
          onMouseEnter={(e) => handleGroupMouseEnter('cert', e)}
          onMouseLeave={handleGroupMouseLeave}
          onToggle={() => handleGroupToggle('cert')}
        >
          <SidebarLink to="/death-certificate" icon={FileX} label="Death Certificate" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
          <SidebarLink to="/medical-certificate" icon={FileCheck2} label="Medical Certificate" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
          <SidebarLink to="/mlc-certificate" icon={Scale} label="MLC Certificate" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
          <SidebarLink to="/certificate-template" icon={FileBadge} label="Certificate Template" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
        </NavGroup>

        {/* Utility Accordion / Flyout */}
        <NavGroup
          id="util"
          title="Utility"
          icon={Contact}
          isOpen={isUtilityOpen}
          isChildActive={isUtilActive}
          isCollapsed={isCollapsed}
          flyoutTop={flyoutTop}
          onMouseEnter={(e) => handleGroupMouseEnter('util', e)}
          onMouseLeave={handleGroupMouseLeave}
          onToggle={() => handleGroupToggle('util')}
        >
          <SidebarLink to="/contact-list" icon={Contact} label="Contact List" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
          <SidebarLink to="/intercomm-display" icon={Radio} label="Intercomm Display" onClick={onCloseMobile} nestedLevel={isCollapsed ? 0 : 1} />
        </NavGroup>
      </div>

      {/* Sidebar Footer with Sign Out */}
      <div className="sidebarFooter">
        <button 
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '8px',
            width: '100%',
            padding: isCollapsed ? '10px 0' : '10px 14px',
            backgroundColor: 'var(--danger-soft)',
            color: 'var(--danger)',
            border: '1px solid var(--danger-soft)',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          title={isCollapsed ? "Sign Out" : undefined}
          aria-label="Sign out of hospital management system"
        >
          <LogOut size={16} aria-hidden="true" />
          {!isCollapsed && <span>Sign Out</span>}
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('mixu_sidebar_collapsed') === 'true';
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('mixu_sidebar_collapsed', String(next));
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 260);
      return next;
    });
  };

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileNavOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock background body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

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
      <div
        className={`appLayout ${!isAuthenticated ? 'unauthenticated' : isSidebarCollapsed ? 'sidebarCollapsed' : 'sidebarExpanded'}`}
        style={{
          '--sidebar-width': '270px',
          '--sidebar-collapsed-width': '72px',
          '--sidebar-actual-width': !isAuthenticated ? '0px' : isSidebarCollapsed ? '72px' : '270px',
          '--watermark-url': `url(${mixuLogo})`
        } as React.CSSProperties}
      >
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
              <img
                src={mixuLogo}
                alt="Mixu Infosystem Emblem"
                style={{
                  width: '24px',
                  height: '24px',
                  objectFit: 'contain',
                  flexShrink: 0
                }}
              />
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
            isMobileOpen={isMobileNavOpen}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={toggleSidebarCollapse}
            onCloseMobile={() => setIsMobileNavOpen(false)} 
            onLogout={handleLogout}
          />
        )}

        {/* Main Content Area */}
        <main className={`appMainContent ${isSidebarCollapsed ? 'sidebarCollapsed' : 'sidebarExpanded'}`}>
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
