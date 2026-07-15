import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import {
  LayoutDashboard,
  CheckSquare,
  Kanban,
  BookOpen,
  Briefcase,
  Sparkles,
  Users,
  FolderKanban,
  FileText,
  ClipboardCheck,
  Bell,
  LogOut,
  ChevronRight,
  Search,
  Settings,
  ShieldCheck,
  User,
  X
} from 'lucide-react';

export default function DashboardLayout({ children, activeView, setActiveView }) {
  const { currentUser, logout, notifications, setNotifications, addNotification } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'Admin';

  const menuItems = isAdmin
    ? [
        { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
        { id: 'manage-employees', label: 'Manage Employees', icon: Users },
        { id: 'manage-projects', label: 'Projects & Teams', icon: FolderKanban },
        { id: 'manage-documents', label: 'Manage Documents', icon: FileText },
        { id: 'manage-workflows', label: 'Workflow Approvals', icon: ClipboardCheck },
      ]
    : [
        { id: 'employee-dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-tasks', label: 'My Tasks', icon: CheckSquare },
        { id: 'kanban-board', label: 'Kanban Board', icon: Kanban },
        { id: 'documentation', label: 'Documentation', icon: BookOpen },
        { id: 'project-overview', label: 'Project Overview', icon: Briefcase },
        { id: 'ai-growth-guide', label: 'AI Growth Guide', icon: Sparkles },
      ];

  const handleLogout = () => {
    logout();
    setActiveView('login');
  };

  const getBreadcrumb = () => {
    const activeItem = menuItems.find(item => item.id === activeView);
    return activeItem ? activeItem.label : 'Overview';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addNotification('System', 'All notifications marked as read.');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addNotification('Search', `Searching for: "${searchQuery}"`);
      // Propagate search to view if it has search capabilities
      if (!isAdmin) {
        if (activeView !== 'my-tasks' && activeView !== 'documentation') {
          setActiveView('my-tasks');
        }
      }
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <aside className="glass-panel" style={{
        width: '260px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0',
        borderRight: '1px solid var(--border-glass)',
        borderTop: '0',
        borderBottom: '0',
        borderLeft: '0',
        zIndex: 50,
      }}>
        {/* Brand Header */}
        <div style={{
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-glass)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, #3b82f6 100%)',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
          }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.05em', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NEXUS</h2>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500, textTransform: 'uppercase' }}>AI Employer Advisor</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  width: '100%',
                  padding: '0.8rem 1rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'linear-gradient(90deg, var(--primary-glow) 0%, rgba(139, 92, 246, 0.02) 100%)' : 'transparent',
                  color: isActive ? 'var(--primary-hover)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.925rem',
                  fontWeight: isActive ? 600 : 500,
                  textAlign: 'left',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--primary)' : 'var(--text-dim)' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Current User Card */}
        <div style={{
          padding: '1.25rem',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(15, 22, 42, 0.2)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isAdmin ? 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)' : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#fff',
            border: '2px solid var(--border-glass)'
          }}>
            {currentUser.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.name}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {isAdmin && <ShieldCheck size={12} style={{ color: 'var(--warning)' }} />}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{currentUser.role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-dim)',
              padding: '0.25rem',
              borderRadius: '6px',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN VIEW SYSTEM */}
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        
        {/* TOP HEADER */}
        <header className="glass-panel" style={{
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          borderRadius: '0',
          borderBottom: '1px solid var(--border-glass)',
          borderTop: '0',
          borderLeft: '0',
          borderRight: '0',
          zIndex: 40,
          background: 'rgba(15, 22, 42, 0.4)'
        }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Nexus</span>
            <ChevronRight size={14} style={{ color: 'var(--text-dim)' }} />
            <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>{getBreadcrumb()}</span>
          </div>

          {/* Search bar & Utility Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Global Search */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder={isAdmin ? "Search workflows..." : "Search docs or tasks..."}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(15, 22, 42, 0.8)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.5rem 1rem 0.5rem 2.25rem',
                  borderRadius: '30px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '240px',
                  transition: 'var(--transition-smooth)'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-glass)'}
              />
            </form>

            {/* Notification Icon */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  position: 'relative',
                  transition: 'var(--transition-smooth)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: 'var(--danger)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Overlay Menu */}
              {showNotifications && (
                <div className="glass-panel" style={{
                  position: 'absolute',
                  top: '48px',
                  right: '0',
                  width: '320px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  borderRadius: 'var(--radius-md)',
                  background: '#0f162a',
                  zIndex: 100,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Notifications</h4>
                    {unreadCount > 0 && (
                      <button onClick={markAllNotificationsAsRead} style={{ background: 'none', border: 'none', color: 'var(--primary-hover)', cursor: 'pointer', fontSize: '0.75rem' }}>Mark all read</button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {notifications.length === 0 ? (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', padding: '1rem' }}>No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          padding: '0.65rem',
                          borderRadius: '8px',
                          background: n.read ? 'transparent' : 'rgba(139, 92, 246, 0.05)',
                          borderLeft: n.read ? 'none' : '3px solid var(--primary)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.02)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: n.read ? 'var(--text-main)' : 'var(--primary-hover)' }}>{n.title}</span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{n.time}</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CORE SCROLLABLE PAGE BODY */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'radial-gradient(ellipse at top, #0f162c 0%, var(--bg-base) 80%)' }}>
          {children}
        </main>
      </div>

    </div>
  );
}
