import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { LayoutDashboard, Users, FolderKanban, FileText, ClipboardCheck, Activity, Plus, ShieldCheck } from 'lucide-react';

export default function AdminDashboard({ setActiveView }) {
  const { users, projects, documents, workflows, tasks } = useContext(AppContext);

  // Stats calculation
  const totalEmployees = users.filter(u => u.role !== 'Admin').length;
  const pendingInvites = users.filter(u => u.status === 'Pending Setup').length;
  const totalProjects = projects.length;
  const totalDocs = documents.length;
  const pendingApprovals = workflows.filter(w => w.status === 'Pending').length;

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Title block */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Admin Command Center</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage developer accounts, structure team divisions, optimize guidelines, and approve code tasks.</p>
        </div>
        <span className="badge badge-warning" style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} /> Supervisor Mode
        </span>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-grid" style={{ marginTop: '1rem' }}>
        
        {/* Metric 1 */}
        <div className="glass-card stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--card-accent-gradient': 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(0,0,0,0) 70%)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Active Developers</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{totalEmployees}</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{pendingInvites} Pending Invitation</span>
          </div>
          <div style={{ background: 'var(--primary-glow)', padding: '0.75rem', borderRadius: '10px', color: 'var(--primary-hover)' }}>
            <Users size={22} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--card-accent-gradient': 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 70%)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Active Projects</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{totalProjects}</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Linked Repository Clusters</span>
          </div>
          <div style={{ background: 'var(--secondary-glow)', padding: '0.75rem', borderRadius: '10px', color: '#60a5fa' }}>
            <FolderKanban size={22} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--card-accent-gradient': 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(0,0,0,0) 70%)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Documentation Guides</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{totalDocs}</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Required & Useful articles</span>
          </div>
          <div style={{ background: 'var(--success-glow)', padding: '0.75rem', borderRadius: '10px', color: 'var(--success)' }}>
            <FileText size={22} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card stat-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '--card-accent-gradient': 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, rgba(0,0,0,0) 70%)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Workflows Pending</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem', color: pendingApprovals > 0 ? 'var(--warning)' : '#fff' }}>{pendingApprovals}</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tasks awaiting review</span>
          </div>
          <div style={{
            background: pendingApprovals > 0 ? 'var(--warning-glow)' : 'rgba(255,255,255,0.03)',
            padding: '0.75rem',
            borderRadius: '10px',
            color: pendingApprovals > 0 ? 'var(--warning)' : 'var(--text-dim)'
          }}>
            <ClipboardCheck size={22} />
          </div>
        </div>

      </div>

      {/* Action Quick Links Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        
        {/* Left: Quick Actions */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
            <Plus size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Management Quick Links</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button className="btn btn-secondary" onClick={() => setActiveView('manage-employees')} style={{ fontSize: '0.8rem', justifyContent: 'flex-start' }}>
              + Create Employee Account
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveView('manage-projects')} style={{ fontSize: '0.8rem', justifyContent: 'flex-start' }}>
              + Create Teams & Tasks
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveView('manage-documents')} style={{ fontSize: '0.8rem', justifyContent: 'flex-start' }}>
              + Write Setup Document
            </button>
            <button className="btn btn-primary" onClick={() => setActiveView('manage-workflows')} style={{ fontSize: '0.8rem', justifyContent: 'flex-start' }}>
              Check Workflow Approvals ({pendingApprovals})
            </button>
          </div>
        </div>

        {/* Right: Activity timeline audit */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(15, 22, 42, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
            <Activity size={18} style={{ color: 'var(--success)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>System Activity Log</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '180px' }}>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--primary-hover)', fontWeight: 700 }}>[User Event]</span>
              <span style={{ color: 'var(--text-muted)' }}>Liam Chen initiated Plan Task for: IDE configuration settings.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--success)', fontWeight: 700 }}>[System]</span>
              <span style={{ color: 'var(--text-muted)' }}>Created repository link for Apollo core monolith billing branch.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--warning)', fontWeight: 700 }}>[Workflow]</span>
              <span style={{ color: 'var(--text-muted)' }}>New account invitation dispatched to: ethan@company.com</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
