import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Users, Search, Plus, Mail, Shield, UserPlus, Upload, Download, Check, X, FileSpreadsheet } from 'lucide-react';

export default function ManageEmployees() {
  const { users, teams, inviteEmployee, activatePendingUser, addNotification } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState('Intern');
  const [teamInput, setTeamInput] = useState('');
  
  // CSV Modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);

  // Filter users
  const employeeList = users.filter(u => u.role !== 'Admin');
  const filteredEmployees = employeeList.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;

    inviteEmployee(nameInput, emailInput, roleInput, teamInput);
    
    // Reset form
    setNameInput('');
    setEmailInput('');
    setRoleInput('Intern');
    setTeamInput('');
    addNotification('Account Created', `Created account invite for ${nameInput}.`);
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'Unassigned';
  };

  // CSV Import parser
  const handleImportCsv = (e) => {
    e.preventDefault();
    if (!importCsvText.trim()) return;
    
    try {
      const lines = importCsvText.split('\n');
      let count = 0;
      lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 2 && parts[0].trim() && parts[1].trim()) {
          const name = parts[0].trim();
          const email = parts[1].trim();
          const role = (parts[2] || 'Intern').trim();
          const teamId = (parts[3] || '').trim();
          inviteEmployee(name, email, role, teamId);
          count++;
        }
      });
      addNotification('Import Success', `Successfully imported ${count} users from CSV parser.`);
      alert(`Successfully imported ${count} users!`);
      setShowImportModal(false);
      setImportCsvText('');
    } catch (err) {
      alert('Error parsing CSV. Please use format: Name, Email, Role, TeamId');
    }
  };

  // CSV Export generator
  const getCsvContent = () => {
    const header = 'ID,Name,Email,Role,Team,Status\n';
    const rows = employeeList.map(u => 
      `${u.id},"${u.name}",${u.email},${u.role},"${getTeamName(u.team)}",${u.status}`
    ).join('\n');
    return header + rows;
  };

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Employee Directory</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure development permissions, invite interns, and verify onboarding setup files.</p>
      </div>

      {/* Control Actions Row */}
      <div className="glass-panel" style={{
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              background: 'rgba(15, 22, 42, 0.4)',
              border: '1px solid var(--border-glass)',
              padding: '0.5rem 1rem 0.5rem 2.25rem',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        {/* CSV Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={() => setShowImportModal(true)} style={{ display: 'flex', gap: '0.4rem', fontSize: '0.8rem' }}>
            <Upload size={14} /> Import CSV Users
          </button>
          <button className="btn btn-secondary" onClick={() => setShowExportModal(true)} style={{ display: 'flex', gap: '0.4rem', fontSize: '0.8rem' }}>
            <Download size={14} /> Export Directory
          </button>
        </div>
      </div>

      {/* Main split grid: Invitation form vs Registry table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem', marginTop: '1rem', alignItems: 'start' }}>
        
        {/* Form Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(15, 22, 42, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <UserPlus size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Dispatch Invitation</h3>
          </div>

          <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-group">
              <label>FULL NAME</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Ethan Harper"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>ENTERPRISE EMAIL</label>
              <input
                type="email"
                className="form-input"
                required
                placeholder="e.g. ethan@company.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>ROLE TYPE</label>
              <select className="form-select" value={roleInput} onChange={e => setRoleInput(e.target.value)}>
                <option value="Intern">Intern (Onboarding Setup)</option>
                <option value="Senior Developer">Senior Developer (Project Transition)</option>
              </select>
            </div>

            <div className="form-group">
              <label>ASSIGN SPRINT TEAM</label>
              <select className="form-select" value={teamInput} onChange={e => setTeamInput(e.target.value)}>
                <option value="">None / Floating Account</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Create Account Invite
            </button>
          </form>
        </div>

        {/* Directory Registry */}
        <div className="glass-panel" style={{ padding: '1.5rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            <Users size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Workspace Registries</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Developer</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Team</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>No employee records found.</td>
                  </tr>
                ) : (
                  filteredEmployees.map(emp => (
                    <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)' }}>
                      {/* Name & Avatar */}
                      <td style={{ padding: '0.75rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--text-main)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>{emp.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{emp.email}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{emp.role}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{getTeamName(emp.team)}</td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span className={`badge ${emp.status === 'Active' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                          {emp.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>
                        {emp.status === 'Pending Setup' && (
                          <button
                            onClick={() => activatePendingUser(emp.id)}
                            className="btn btn-success animate-fade-in"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                            title="Verify Setup Completion & Activate Account"
                          >
                            <Check size={12} /> Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CSV IMPORT MODAL */}
      {showImportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Upload size={18} /> Bulk Import Users</h3>
              <button onClick={() => setShowImportModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>×</button>
            </div>
            <form onSubmit={handleImportCsv}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Paste comma-separated user listings. Each line should contain: <strong>Name, Email, Role, TeamId</strong>.</p>
                <textarea
                  className="form-textarea"
                  rows="6"
                  required
                  placeholder="John Doe, john@company.com, Intern, t1&#10;Alice Smith, alice@company.com, Senior Developer, t2"
                  value={importCsvText}
                  onChange={e => setImportCsvText(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowImportModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Process Import</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV EXPORT MODAL */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Download size={18} /> Export CSV Registry</h3>
              <button onClick={() => setShowExportModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>×</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Below is your compiled employee roster. Copy this data to your local spreadsheet.</p>
              <textarea
                className="form-textarea"
                rows="6"
                readOnly
                value={getCsvContent()}
                style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: 'rgba(15,22,42,0.8)' }}
                onClick={e => e.target.select()}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => {
                navigator.clipboard.writeText(getCsvContent());
                alert('Copied CSV content to clipboard!');
                setShowExportModal(false);
              }}>Copy to Clipboard</button>
              <button className="btn btn-secondary" onClick={() => setShowExportModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
