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
import { HOSPITAL_CONFIG } from './config/hospitalConfig';

// Lazy load the components
const Login = lazy(() => import('./components/Login/Login'));
const PatientRegistration = lazy(() => import('./components/PatientRegistration/PatientRegistration'));
const PatientRegistrationList = lazy(() => import('./components/PatientRegistrationList/PatientRegistrationList'));
const BillPreview = lazy(() => import('./components/BillPreview/BillPreview'));
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

// Configuration interface for recursive navigation items supporting arbitrary nesting levels
interface NavItemConfig {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  to?: string;
  children?: NavItemConfig[];
}

// Complete Navigation Tree discovered from the application
const NAVIGATION_TREE: NavItemConfig[] = [
  // 18 Primary Single Items
  { id: 'patient-registration', title: 'Patient Registration', icon: UserPlus, to: '/patient-registration' },
  { id: 'patient-registration-list', title: 'Patient Registration List', icon: Users, to: '/patient-registration-list' },
  { id: 'patient-past-info', title: 'Patient Past Info', icon: History, to: '/patient-past-info' },
  { id: 'part-payment', title: 'Part Payment', icon: CreditCard, to: '/part-payment' },
  { id: 'room-charges', title: 'Room Charges', icon: BedDouble, to: '/room-charges' },
  { id: 'room-status', title: 'Room Status', icon: DoorOpen, to: '/room-status' },
  { id: 'ot-entry', title: 'OT Entry', icon: HeartPulse, to: '/ot-entry' },
  { id: 'operation-charges', title: 'Operation Charges', icon: BadgeDollarSign, to: '/operation-charges' },
  { id: 'indoor-summary', title: 'Indoor Summary', icon: FileSpreadsheet, to: '/indoor-summary' },
  { id: 'indoor-option', title: 'Indoor Option', icon: Layers, to: '/indoor-option' },
  { id: 'inpatient-receipt', title: 'Inpatient Receipt', icon: Receipt, to: '/inpatient-receipt' },
  { id: 'inpatient-bill', title: 'Inpatient Bill', icon: FileText, to: '/inpatient-bill' },
  { id: 'discharge-card', title: 'Discharge Card', icon: LogOut, to: '/discharge-card' },
  { id: 'deposit-entry', title: 'Deposit Entry', icon: Wallet, to: '/deposit-entry' },
  { id: 'billing', title: 'Billing', icon: Calculator, to: '/billing' },
  { id: 'dr-visit-procedure', title: 'Dr. Visit & Procedure', icon: Stethoscope, to: '/dr-visit-procedure' },
  { id: 'investigation-ordered', title: 'Investigation Ordered', icon: Microscope, to: '/investigation-ordered' },
  { id: 'indoor-register', title: 'Indoor Register', icon: Hospital, to: '/indoor-register' },

  // Master with 3 Leaf Items + 2 Nested Groups (IPD Master & OPD Master)
  {
    id: 'master',
    title: 'Master',
    icon: FolderPlus,
    children: [
      { id: 'patient-history', title: 'Clinical / Patient History', icon: History, to: '/patient-history' },
      { id: 'medicine-master', title: 'Medicine Master', icon: Pill, to: '/medicine-master' },
      { id: 'standard-prescription-master', title: 'Standard Prescription Master', icon: FileSignature, to: '/standard-prescription-master' },
      {
        id: 'ipd-master',
        title: 'IPD Master',
        icon: Bed,
        children: [
          { id: 'advice-master', title: 'Advice Master', icon: MessageSquareCheck, to: '/advice-master' },
          { id: 'bed-master', title: 'Bed Master', icon: Bed, to: '/bed-master' },
          { id: 'operation-group-master', title: 'Operation Group Master', icon: Boxes, to: '/operation-group-master' },
          { id: 'room-type-master', title: 'Room Type Master', icon: Building, to: '/room-type-master' },
          { id: 'visiting-type-master', title: 'Visiting Type Master', icon: Clock, to: '/visiting-type-master' },
          { id: 'visit-procedure-header-master', title: 'Visit Procedure Header Master', icon: ListPlus, to: '/visit-procedure-header-master' },
        ]
      },
      {
        id: 'opd-master',
        title: 'OPD Master',
        icon: ClipboardList,
        children: [
          { id: 'opd-patient-category', title: 'OPD Patient Category', icon: Users, to: '/opd-patient-category' },
          { id: 'opd-charges-master', title: 'OPD Charges Master', icon: BadgeDollarSign, to: '/opd-charges-master' },
          { id: 'department-master', title: 'Department Master', icon: Building2, to: '/department-master' },
          { id: 'doctor-master', title: 'Doctor Master', icon: UserCheck, to: '/doctor-master' },
          { id: 'insurance-company-master', title: 'Insurance Company Master', icon: ShieldCheck, to: '/insurance-company-master' },
          { id: 'opd-charges-profile', title: 'OPD Charges Profile', icon: UserCog, to: '/opd-charges-profile' },
        ]
      }
    ]
  },

  // Diagnostics Report (4 Leaf Items)
  {
    id: 'diagnostics-report',
    title: 'Diagnostics Report',
    icon: BarChart3,
    children: [
      { id: 'echo-report', title: 'Echo Report', icon: HeartPulse, to: '/echo-report' },
      { id: 'short-form-master', title: 'Short Form Master', icon: FileCode, to: '/short-form-master' },
      { id: 'report-template', title: 'Report Template', icon: LayoutTemplate, to: '/report-template' },
      { id: 'today-report-dashboard', title: 'Today Report Dashboard', icon: LayoutDashboard, to: '/today-report-dashboard' },
    ]
  },

  // Certificate (4 Leaf Items)
  {
    id: 'certificate',
    title: 'Certificate',
    icon: Award,
    children: [
      { id: 'death-certificate', title: 'Death Certificate', icon: FileX, to: '/death-certificate' },
      { id: 'medical-certificate', title: 'Medical Certificate', icon: FileCheck2, to: '/medical-certificate' },
      { id: 'mlc-certificate', title: 'MLC Certificate', icon: Scale, to: '/mlc-certificate' },
      { id: 'certificate-template', title: 'Certificate Template', icon: FileBadge, to: '/certificate-template' },
    ]
  },

  // Utility (2 Leaf Items)
  {
    id: 'utility',
    title: 'Utility',
    icon: Contact,
    children: [
      { id: 'contact-list', title: 'Contact List', icon: Contact, to: '/contact-list' },
      { id: 'intercomm-display', title: 'Intercomm Display', icon: Radio, to: '/intercomm-display' },
    ]
  }
];

// Helper: Recursively test if item or any of its descendants matches the current path
const isNavItemActive = (item: NavItemConfig, currentPath: string): boolean => {
  if (item.to && item.to === currentPath) return true;
  if (item.children && item.children.length > 0) {
    return item.children.some(child => isNavItemActive(child, currentPath));
  }
  return false;
};

// Helper: Collect all ancestor group IDs for the active route to auto-expand them
const getActiveGroupIds = (items: NavItemConfig[], currentPath: string): string[] => {
  const activeIds: string[] = [];
  const traverse = (item: NavItemConfig): boolean => {
    let childActive = false;
    if (item.children && item.children.length > 0) {
      for (const child of item.children) {
        if (traverse(child)) {
          childActive = true;
        }
      }
    }
    if (item.to === currentPath || childActive) {
      if (item.children && item.children.length > 0) {
        activeIds.push(item.id);
      }
      return true;
    }
    return false;
  };
  items.forEach(traverse);
  return activeIds;
};

// Recursive Nav Item Component handling both Leaf NavLinks and Collapsible/Flyout Groups at any depth
interface RecursiveNavItemProps {
  item: NavItemConfig;
  nestedLevel?: number;
  isCollapsed: boolean;
  isInFlyout?: boolean;
  openGroupIds: Set<string>;
  hoveredRootGroupId: string | null;
  onToggleGroup: (groupId: string) => void;
  onRootGroupMouseEnter?: (item: NavItemConfig, e: React.MouseEvent<HTMLDivElement>) => void;
  onRootGroupMouseLeave?: () => void;
  onCloseMobile: () => void;
  onHoverTooltip?: (e: React.MouseEvent, label: string) => void;
  onLeaveTooltip?: () => void;
}

const RecursiveNavItem: React.FC<RecursiveNavItemProps> = ({
  item,
  nestedLevel = 0,
  isCollapsed,
  isInFlyout = false,
  openGroupIds,
  hoveredRootGroupId,
  onToggleGroup,
  onRootGroupMouseEnter,
  onRootGroupMouseLeave,
  onCloseMobile,
  onHoverTooltip,
  onLeaveTooltip
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isLeaf = !item.children || item.children.length === 0;
  const hasChildren = !isLeaf;
  const Icon = item.icon;

  const isChildActive = isNavItemActive(item, currentPath);
  const isFlyoutOpen = nestedLevel === 0 && isCollapsed && (hoveredRootGroupId === item.id || (openGroupIds.has(item.id) && !hoveredRootGroupId));
  const isOpen = hasChildren && (isInFlyout || nestedLevel > 0 || !isCollapsed) ? openGroupIds.has(item.id) : false;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const flyoutRef = useRef<HTMLDivElement | null>(null);
  const [flyoutStyle, setFlyoutStyle] = useState<{ top: number; maxHeight?: number }>({
    top: 0
  });

  // Calculate flyout top position aligned with parent button, clamping to viewport bottom if necessary
  useLayoutEffect(() => {
    if (!isCollapsed || nestedLevel !== 0 || !isFlyoutOpen) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const btnRect = buttonRef.current.getBoundingClientRect();
      const parentTop = btnRect.top;
      const viewportHeight = window.innerHeight;
      const margin = 12;

      const flyoutEl = flyoutRef.current;
      const flyoutHeight = flyoutEl ? flyoutEl.offsetHeight : 180;

      // Default: Top edge of submenu aligns directly with top edge of parent button
      let targetTop = parentTop;

      // Viewport bottom boundary: Adjust upward only as much as needed to avoid clipping
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
  }, [isCollapsed, nestedLevel, isFlyoutOpen, openGroupIds]);

  // Leaf Item Rendering
  if (isLeaf && item.to) {
    if (isCollapsed && nestedLevel === 0 && !isInFlyout) {
      // Collapsed root leaf
      return (
        <NavLink
          to={item.to}
          onClick={onCloseMobile}
          onMouseEnter={(e) => onHoverTooltip && onHoverTooltip(e, item.title)}
          onMouseLeave={() => onLeaveTooltip && onLeaveTooltip()}
          title={item.title}
          style={({ isActive }) => ({
            padding: '9px 0',
            borderRadius: '6px',
            backgroundColor: isActive ? 'var(--primary-soft)' : 'transparent',
            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontWeight: isActive ? 600 : 500,
            fontSize: '13.5px',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.15s ease-in-out',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '38px',
            borderRight: isActive ? '3px solid var(--primary)' : 'none',
            position: 'relative'
          })}
        >
          {({ isActive }) => (
            <Icon
              size={18}
              strokeWidth={isActive ? 2.2 : 1.75}
              style={{
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                flexShrink: 0
              }}
              aria-hidden="true"
            />
          )}
        </NavLink>
      );
    }

    if (isInFlyout) {
      // Leaf item inside floating flyout panel
      return (
        <NavLink
          to={item.to}
          onClick={onCloseMobile}
          style={({ isActive }) => ({
            padding: '7px 10px',
            borderRadius: '6px',
            backgroundColor: isActive ? 'var(--primary-soft)' : 'transparent',
            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
            textDecoration: 'none',
            fontWeight: isActive ? 600 : 500,
            fontSize: '12.5px',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.15s ease-in-out',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
          })}
          title={item.title}
        >
          {({ isActive }) => (
            <>
              <Icon
                size={16}
                strokeWidth={isActive ? 2.2 : 1.75}
                style={{
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  flexShrink: 0
                }}
                aria-hidden="true"
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
            </>
          )}
        </NavLink>
      );
    }

    // Leaf item in expanded sidebar / mobile drawer
    const paddingLeft = nestedLevel === 0 ? '12px' : nestedLevel === 1 ? '24px' : '36px';
    const fontSize = nestedLevel === 0 ? '13.5px' : nestedLevel === 1 ? '13px' : '12px';

    return (
      <NavLink
        to={item.to}
        onClick={onCloseMobile}
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
          borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
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
                flexShrink: 0
              }}
              aria-hidden="true"
            />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
          </>
        )}
      </NavLink>
    );
  }

  // Group Item with Children
  if (nestedLevel === 0 && isCollapsed && !isInFlyout) {
    // Root group in Collapsed Mode: Hover triggers floating flyout
    return (
      <div
        className="navGroupWrapper"
        onMouseEnter={(e) => onRootGroupMouseEnter && onRootGroupMouseEnter(item, e)}
        onMouseLeave={() => onRootGroupMouseLeave && onRootGroupMouseLeave()}
        style={{
          marginTop: '6px',
          paddingTop: '6px',
          position: 'relative'
        }}
      >
        <button
          ref={buttonRef}
          type="button"
          onClick={() => onToggleGroup(item.id)}
          aria-expanded={isFlyoutOpen}
          aria-label={`${item.title} menu`}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '9px 0',
            backgroundColor: isFlyoutOpen || isChildActive ? 'rgba(66, 133, 244, 0.08)' : 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: isFlyoutOpen || isChildActive ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '38px',
            transition: 'all 0.15s ease-in-out',
            fontFamily: 'Inter, sans-serif',
            position: 'relative',
            borderRight: isChildActive ? '3px solid var(--primary)' : 'none'
          }}
        >
          <Icon
            size={18}
            strokeWidth={isChildActive ? 2.1 : 1.8}
            style={{
              color: isChildActive || isFlyoutOpen ? 'var(--primary)' : 'var(--text-muted)',
              flexShrink: 0
            }}
            aria-hidden="true"
          />
          {isChildActive && (
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

        {/* Collapsed Mode Flyout Panel */}
        {isFlyoutOpen && (
          <div
            ref={flyoutRef}
            className="sidebarFlyout"
            style={{
              top: `${flyoutStyle.top}px`,
              maxHeight: flyoutStyle.maxHeight ? `${flyoutStyle.maxHeight}px` : 'calc(100vh - 24px)'
            }}
            role="region"
            aria-label={`${item.title} submenu`}
            onMouseEnter={(e) => {
              if (onRootGroupMouseEnter) {
                onRootGroupMouseEnter(item, e);
              }
            }}
            onMouseLeave={() => onRootGroupMouseLeave && onRootGroupMouseLeave()}
          >
            {/* Parent Section Title at the top */}
            <div className="flyoutHeader">
              <Icon size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title}
              </span>
            </div>

            {/* Clean vertical list of child items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {item.children?.map(child => (
                <RecursiveNavItem
                  key={child.id}
                  item={child}
                  nestedLevel={1}
                  isCollapsed={false}
                  isInFlyout={true}
                  openGroupIds={openGroupIds}
                  hoveredRootGroupId={hoveredRootGroupId}
                  onToggleGroup={onToggleGroup}
                  onCloseMobile={onCloseMobile}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Nested group inside floating flyout
  if (isInFlyout) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
        <button
          type="button"
          onClick={() => onToggleGroup(item.id)}
          aria-expanded={isOpen}
          aria-label={`${item.title} submenu`}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '7px 10px',
            backgroundColor: isOpen || isChildActive ? 'rgba(66, 133, 244, 0.08)' : 'transparent',
            border: 'none',
            borderRadius: '6px',
            color: isOpen || isChildActive ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '12.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease-in-out',
            fontFamily: 'Inter, sans-serif',
            borderLeft: isChildActive ? '3px solid var(--primary)' : '3px solid transparent'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <Icon
              size={16}
              strokeWidth={isChildActive || isOpen ? 2.1 : 1.8}
              style={{
                color: isChildActive || isOpen ? 'var(--primary)' : 'var(--text-muted)',
                flexShrink: 0
              }}
              aria-hidden="true"
            />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.title}
            </span>
          </span>
          <ChevronRight
            size={15}
            style={{
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
              color: isOpen || isChildActive ? 'var(--primary)' : 'var(--text-muted)',
              flexShrink: 0
            }}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              marginTop: '2px',
              marginLeft: '12px',
              paddingLeft: '6px',
              borderLeft: '2px solid rgba(66, 133, 244, 0.25)'
            }}
          >
            {item.children?.map(child => (
              <RecursiveNavItem
                key={child.id}
                item={child}
                nestedLevel={nestedLevel + 1}
                isCollapsed={false}
                isInFlyout={true}
                openGroupIds={openGroupIds}
                hoveredRootGroupId={hoveredRootGroupId}
                onToggleGroup={onToggleGroup}
                onCloseMobile={onCloseMobile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Expanded sidebar or mobile drawer: Accordion parent and nested groups
  const paddingLeft = nestedLevel === 0 ? '12px' : nestedLevel === 1 ? '24px' : '36px';
  const fontSize = nestedLevel === 0 ? '13.5px' : nestedLevel === 1 ? '13px' : '12px';

  return (
    <div
      className="navGroupWrapper"
      style={{
        marginTop: nestedLevel === 0 ? '6px' : '2px',
        paddingTop: nestedLevel === 0 ? '6px' : '0',
        position: 'relative'
      }}
    >
      <button
        type="button"
        onClick={() => onToggleGroup(item.id)}
        aria-expanded={isOpen}
        aria-label={`${item.title} submenu`}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: `8px 12px 8px ${paddingLeft}`,
          backgroundColor: isOpen || isChildActive ? 'rgba(66, 133, 244, 0.08)' : 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: isOpen || isChildActive ? 'var(--primary)' : 'var(--text-muted)',
          fontWeight: 600,
          fontSize,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '38px',
          transition: 'all 0.15s ease-in-out',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          borderLeft: isChildActive ? '3px solid var(--primary)' : '3px solid transparent'
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
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.title}
          </span>
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isChildActive && <span className="navGroupActiveDot" aria-label="Active indicator" />}
          {nestedLevel === 0 ? (
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
          ) : (
            <ChevronRight
              size={15}
              style={{
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                color: isOpen || isChildActive ? 'var(--primary)' : 'var(--text-muted)',
                flexShrink: 0
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </button>

      {isOpen && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            marginTop: '3px',
            borderLeft: nestedLevel > 0 ? '2px solid rgba(66, 133, 244, 0.2)' : 'none',
            marginLeft: nestedLevel > 0 ? '24px' : '0',
            paddingLeft: nestedLevel > 0 ? '4px' : '0'
          }}
        >
          {item.children?.map(child => (
            <RecursiveNavItem
              key={child.id}
              item={child}
              nestedLevel={nestedLevel + 1}
              isCollapsed={false}
              isInFlyout={false}
              openGroupIds={openGroupIds}
              hoveredRootGroupId={hoveredRootGroupId}
              onToggleGroup={onToggleGroup}
              onCloseMobile={onCloseMobile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Navigation Bar Component with Collapsible State, Flyout Positioning, and Recursive Navigation Tree
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
  const currentPath = location.pathname;

  // Track which groups are expanded (by id)
  const [openGroupIds, setOpenGroupIds] = useState<Set<string>>(() => {
    return new Set<string>(getActiveGroupIds(NAVIGATION_TREE, window.location.hash.replace(/^#/, '') || '/patient-registration'));
  });

  // Track which root group is hovered in collapsed mode
  const [hoveredRootGroupId, setHoveredRootGroupId] = useState<string | null>(null);

  // Single tooltip in collapsed mode for leaf items
  const [activeTooltip, setActiveTooltip] = useState<{ text: string; top: number } | null>(null);

  // Leave timer for debounce (180ms safe delay prevents flicker when moving pointer into submenu)
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-expand parent groups on route change and clear hover/tooltip
  useEffect(() => {
    const activeIds = getActiveGroupIds(NAVIGATION_TREE, currentPath);
    setOpenGroupIds(prev => {
      const next = new Set(prev);
      activeIds.forEach(id => next.add(id));
      return next;
    });
    setHoveredRootGroupId(null);
    setActiveTooltip(null);
  }, [currentPath]);

  // Close flyout and tooltip on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHoveredRootGroupId(null);
        setActiveTooltip(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleGroup = (groupId: string) => {
    setOpenGroupIds(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const handleRootGroupMouseEnter = (item: NavItemConfig) => {
    if (window.innerWidth <= 1024) return;
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredRootGroupId(item.id);
    setActiveTooltip(null);
  };

  const handleRootGroupMouseLeave = () => {
    if (window.innerWidth <= 1024) return;
    leaveTimerRef.current = setTimeout(() => {
      setHoveredRootGroupId(null);
      if (isCollapsed) {
        setOpenGroupIds(prev => {
          const next = new Set(prev);
          NAVIGATION_TREE.forEach(root => {
            if (root.children && root.children.length > 0) {
              next.delete(root.id);
            }
          });
          return next;
        });
      }
    }, 180);
  };

  const handleHoverTooltip = (e: React.MouseEvent, text: string) => {
    if (!isCollapsed || window.innerWidth <= 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({ text, top: rect.top + 4 });
  };

  const handleLeaveTooltip = () => {
    setActiveTooltip(null);
  };

  if (currentPath === '/login') return null;

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
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>{HOSPITAL_CONFIG.name}</span>
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

      {/* Sidebar Links Scroll Area - Rendered Recursively */}
      <div className="sidebarLinks" role="navigation" aria-label="Hospital modules">
        {NAVIGATION_TREE.map(item => (
          <RecursiveNavItem
            key={item.id}
            item={item}
            nestedLevel={0}
            isCollapsed={isCollapsed}
            isInFlyout={false}
            openGroupIds={openGroupIds}
            hoveredRootGroupId={hoveredRootGroupId}
            onToggleGroup={handleToggleGroup}
            onRootGroupMouseEnter={handleRootGroupMouseEnter}
            onRootGroupMouseLeave={handleRootGroupMouseLeave}
            onCloseMobile={onCloseMobile}
            onHoverTooltip={handleHoverTooltip}
            onLeaveTooltip={handleLeaveTooltip}
          />
        ))}
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
              {HOSPITAL_CONFIG.name}
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
                  <Route path="/patient-registration-list" element={<PatientRegistrationList />} />
                  <Route path="/bill-preview" element={<BillPreview />} />
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
