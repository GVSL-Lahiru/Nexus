import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { FolderKanban, Plus, Users, FolderPlus, ClipboardPlus, UserPlus, Trash } from 'lucide-react';

export default function ManageProjects() {
  const {
    projects,
    teams,
    users,
    createTeam,
    createProject,
    addTask,
    assignMemberToTeam,
    unassignMemberFromTeam
  } = useContext(AppContext);

  // Forms states
  // Project Creator
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projRepo, setProjRepo] = useState('');

  // Team Creator
  const [teamName, setTeamName] = useState('');
  const [teamProjId, setTeamProjId] = useState(projects[0]?.id || '');

  // Task Creator
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskTeamId, setTaskTeamId] = useState(teams[0]?.id || '');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');

  // Active Team Assignment Selector
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');

  // Handle submits
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projName.trim()) return;

    createProject(projName, projDesc, projTech, projRepo);
    setProjName('');
    setProjDesc('');
    setProjTech('');
    setProjRepo('');
    alert(`Successfully launched project: "${projName}"!`);
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!teamName.trim() || !teamProjId) return;

    createTeam(teamName, teamProjId);
    setTeamName('');
    alert(`Successfully launched team: "${teamName}"!`);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskTeamId || !taskAssigneeId) return;

    addTask(taskTitle, taskDesc, taskTeamId, taskAssigneeId);
    setTaskTitle('');
    setTaskDesc('');
    alert(`Successfully created and assigned task: "${taskTitle}"!`);
  };

  const selectedTeam = teams.find(t => t.id === selectedTeamId);
  const selectedTeamProject = projects.find(p => p.id === selectedTeam?.projectId);
  const teamMembers = users.filter(u => selectedTeam?.members.includes(u.id) || u.team === selectedTeamId);
  const unassignedUsers = users.filter(u => u.role !== 'Admin' && u.team !== selectedTeamId);

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Project & Team Engineering</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure module repositories, form development circles, and assign setup milestones.</p>
      </div>

      {/* Main Grid: Management Forms */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        
        {/* Panel 1: Create Projects */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(15, 22, 42, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <FolderPlus size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Initialize Repository Project</h3>
          </div>
          <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-group">
              <label>PROJECT NAME</label>
              <input type="text" className="form-input" required placeholder="e.g. Project Phoenix" value={projName} onChange={e => setProjName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>PROJECT DESCRIPTION</label>
              <textarea className="form-textarea" rows="2" placeholder="High-level migration goals or legacy systems description..." value={projDesc} onChange={e => setProjDesc(e.target.value)} />
            </div>
            <div className="form-group">
              <label>TECHNOLOGY STACK</label>
              <input type="text" className="form-input" placeholder="e.g. Docker, Git, Spring Boot, React (comma separated)" value={projTech} onChange={e => setProjTech(e.target.value)} />
            </div>
            <div className="form-group">
              <label>GIT REPOSITORY ENDPOINT</label>
              <input type="text" className="form-input" placeholder="e.g. git@github.com:enterprise/phoenix.git" value={projRepo} onChange={e => setProjRepo(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Launch Project</button>
          </form>
        </div>

        {/* Panel 2: Create Teams */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(15, 22, 42, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <Users size={18} style={{ color: 'var(--secondary)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Launch Sprint Team</h3>
          </div>
          <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-group">
              <label>TEAM DIVISION NAME</label>
              <input type="text" className="form-input" required placeholder="e.g. Alpha-Phoenix" value={teamName} onChange={e => setTeamName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>ASSIGN SPEC PROJECT</label>
              <select className="form-select" value={teamProjId} onChange={e => setTeamProjId(e.target.value)} required>
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '3rem' }}>Launch Team</button>
          </form>
        </div>

        {/* Panel 3: Add Tasks */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(15, 22, 42, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            <ClipboardPlus size={18} style={{ color: 'var(--success)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Dispatch Setup Task</h3>
          </div>
          <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="form-group">
              <label>TASK TITLE</label>
              <input type="text" className="form-input" required placeholder="e.g. Configure IDE Formatter Settings" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>TASK DETAILS</label>
              <textarea className="form-textarea" rows="2" placeholder="Specify configuration targets, eclipse xml formatter downloads..." value={taskDesc} onChange={e => setTaskDesc(e.target.value)} />
            </div>
            <div className="form-group">
              <label>TARGET SPRINT TEAM</label>
              <select className="form-select" value={taskTeamId} onChange={e => { setTaskTeamId(e.target.value); setTaskAssigneeId(''); }} required>
                <option value="">Select Team</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>ASSIGN SPEC DEVELOPER</label>
              <select className="form-select" value={taskAssigneeId} onChange={e => setTaskAssigneeId(e.target.value)} required>
                <option value="">Select Developer</option>
                {users.filter(u => u.role !== 'Admin' && (!taskTeamId || u.team === taskTeamId)).map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Dispatch Task</button>
          </form>
        </div>

      </div>

      {/* Interactive Team Members Assignation Panel */}
      <div className="glass-panel" style={{ padding: '2rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <UserPlus size={18} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Team Roster Management</h3>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Select team list */}
          <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>SELECT TEAM</label>
            {teams.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTeamId(t.id)}
                style={{
                  background: selectedTeamId === t.id ? 'var(--primary-glow)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${selectedTeamId === t.id ? 'var(--primary-hover)' : 'var(--border-glass)'}`,
                  color: selectedTeamId === t.id ? 'var(--primary-hover)' : 'var(--text-muted)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  fontWeight: selectedTeamId === t.id ? 600 : 500
                }}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Roster list editor */}
          {selectedTeam ? (
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Active members */}
              <div style={{ background: 'rgba(15,22,42,0.2)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.75rem' }}>Active Team Members ({teamMembers.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {teamMembers.length === 0 ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>No members assigned to this team.</span>
                  ) : (
                    teamMembers.map(m => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                        <span style={{ fontSize: '0.8rem', color: '#fff' }}>{m.name} ({m.role})</span>
                        <button
                          onClick={() => unassignMemberFromTeam(m.id, selectedTeam.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                          title="Remove from Team"
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add members list */}
              <div style={{ background: 'rgba(15,22,42,0.2)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-hover)', marginBottom: '0.75rem' }}>Assign Other Developers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {unassignedUsers.length === 0 ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>All developers are currently allocated to this team.</span>
                  ) : (
                    unassignedUsers.map(m => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.name} ({m.role})</span>
                        <button
                          onClick={() => assignMemberToTeam(m.id, selectedTeam.id)}
                          className="btn btn-primary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                        >
                          + Assign
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
              <span>Please select a team division to manage roster assignments.</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
