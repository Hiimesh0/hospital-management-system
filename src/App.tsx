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

// Navigation Bar Component (only shown when authenticated)
const NavigationBar = () => {
  const location = useLocation();
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
    <nav style={{ width: '250px', padding: '24px 16px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
      <div style={{ padding: '0 16px 16px', marginBottom: '16px', borderBottom: '1px solid #E2E8F0', fontSize: '18px', fontWeight: 'bold', color: '#172033' }}>
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
