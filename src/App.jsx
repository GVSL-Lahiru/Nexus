import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';

// Employee Views
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MyTasks from './pages/employee/MyTasks';
import KanbanBoard from './pages/employee/KanbanBoard';
import Documentation from './pages/employee/Documentation';
import ProjectOverview from './pages/employee/ProjectOverview';
import AIGrowthGuide from './pages/employee/AIGrowthGuide';

// Admin Views
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageProjects from './pages/admin/ManageProjects';
import ManageDocuments from './pages/admin/ManageDocuments';
import ManageWorkflows from './pages/admin/ManageWorkflows';

import { Sparkles, RefreshCw } from 'lucide-react';

function AppContent() {
  const { currentUser, logout, login } = useContext(AppContext);
  const [activeView, setActiveView] = useState('login');
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // If user log state resets on refresh or logout, direct to login
  if (!currentUser && activeView !== 'login') {
    setActiveView('login');
  }

  // Quick Role Swapper helper to ease local evaluations
  const handleRoleQuickSwap = (role) => {
    logout();
    if (role === 'intern') {
      login('intern@company.com', 'password123');
      setActiveView('employee-dashboard');
    } else if (role === 'senior') {
      login('senior@company.com', 'password123');
      setActiveView('employee-dashboard');
    } else if (role === 'admin') {
      login('admin@company.com', 'password123');
      setActiveView('admin-dashboard');
    }
    setShowRoleSwitcher(false);
  };

  const renderActiveView = () => {
    switch (activeView) {
      // Employee Portal
      case 'employee-dashboard':
        return <EmployeeDashboard setActiveView={setActiveView} />;
      case 'my-tasks':
        return <MyTasks />;
      case 'kanban-board':
        return <KanbanBoard />;
      case 'documentation':
        return <Documentation />;
      case 'project-overview':
        return <ProjectOverview />;
      case 'ai-growth-guide':
        return <AIGrowthGuide />;

      // Admin Portal
      case 'admin-dashboard':
        return <AdminDashboard setActiveView={setActiveView} />;
      case 'manage-employees':
        return <ManageEmployees />;
      case 'manage-projects':
        return <ManageProjects />;
      case 'manage-documents':
        return <ManageDocuments />;
      case 'manage-workflows':
        return <ManageWorkflows />;

      default:
        return <EmployeeDashboard setActiveView={setActiveView} />;
    }
  };

  if (activeView === 'login' || !currentUser) {
    return <Login setActiveView={setActiveView} />;
  }

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderActiveView()}

      {/* Floating Evaluator Portal Switcher */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <button
          onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
          className="btn btn-primary"
          style={{
            borderRadius: '50px',
            padding: '0.6rem 1rem',
            boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <RefreshCw size={14} /> Switch View
        </button>

        {showRoleSwitcher && (
          <div className="glass-panel" style={{
            position: 'absolute',
            bottom: '48px',
            right: '0',
            width: '200px',
            padding: '0.5rem',
            background: '#0f162a',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem'
          }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', padding: '0.25rem 0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Onboarding Roles</span>
            <button onClick={() => handleRoleQuickSwap('intern')} style={{ textAlign: 'left', padding: '0.5rem', border: 'none', background: 'transparent', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.target.style.background = 'transparent'}>Liam (Intern)</button>
            <button onClick={() => handleRoleQuickSwap('senior')} style={{ textAlign: 'left', padding: '0.5rem', border: 'none', background: 'transparent', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.target.style.background = 'transparent'}>Sophia (Senior)</button>
            <button onClick={() => handleRoleQuickSwap('admin')} style={{ textAlign: 'left', padding: '0.5rem', border: 'none', background: 'transparent', color: '#fff', fontSize: '0.8rem', cursor: 'pointer', borderRadius: '4px' }} onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => e.target.style.background = 'transparent'}>Marcus (Manager)</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
