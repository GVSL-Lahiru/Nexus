import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Briefcase, GitBranch, Terminal, Users, CheckCircle, Clock, BookOpen } from 'lucide-react';

export default function ProjectOverview() {
  const { currentUser, projects, teams, users, tasks } = useContext(AppContext);

  if (!currentUser) return null;

  // Find user's team
  const userTeam = teams.find(t => t.id === currentUser.team) || { name: 'Unassigned Team', members: [], projectId: '' };
  const userProject = projects.find(p => p.id === userTeam.projectId) || { name: 'No Assigned Project', desc: 'Contact your workspace supervisor to assign a team project.', techStack: 'N/A', repos: 'N/A' };
  
  // Find team members
  const teamMembers = users.filter(u => userTeam.members.includes(u.id) || u.team === userTeam.id);

  // Stats for the active project
  const projectTasks = tasks.filter(t => t.teamId === userTeam.id);
  const completedCount = projectTasks.filter(t => t.status === 'Completed').length;
  const inProgressCount = projectTasks.filter(t => t.status === 'In Progress').length;
  const totalCount = projectTasks.length;

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Project & Team Portal</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Overview of your assigned software module repository and developer circles.</p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* Left: Project details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Project Spec card */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  background: 'var(--primary-glow)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-hover)'
                }}>
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{userProject.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Active Module Assignment</span>
                </div>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Active Development</span>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Project Mission</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{userProject.desc}</p>
            </div>

            {/* Tech Stack items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={16} style={{ color: 'var(--secondary)' }} />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Tooling Ecosystem</h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                {userProject.techStack.split(',').map((tech, i) => (
                  <span key={i} style={{
                    background: 'rgba(59, 130, 246, 0.08)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.15)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Repositories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GitBranch size={16} style={{ color: 'var(--primary)' }} />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Git SSH Endpoint</h4>
              </div>
              <code style={{
                background: 'rgba(15, 22, 42, 0.8)',
                color: '#fff',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                border: '1px solid var(--border-glass)',
                fontFamily: 'monospace',
                display: 'block',
                overflowX: 'auto',
                marginTop: '0.25rem'
              }}>
                {userProject.repos}
              </code>
            </div>
          </div>

          {/* Project progress stats summary */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Team Sprint Completion</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accumulated team tasks in this project setup lifecycle.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>{completedCount}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Done</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-hover)' }}>{inProgressCount}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-glass)', paddingLeft: '1rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>{totalCount}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Team Directory */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(15, 22, 42, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
            <Users size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Team Directory</h3>
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned to: <strong>{userTeam.name}</strong></p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {teamMembers.map(member => {
              const memberTasks = tasks.filter(t => t.assigneeId === member.id);
              const doneTasks = memberTasks.filter(t => t.status === 'Completed').length;
              return (
                <div key={member.id} style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--primary-glow)',
                      color: 'var(--primary-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      flexShrink: 0
                    }}>
                      {member.avatar}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{member.name}</h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{member.role}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>{doneTasks} / {memberTasks.length}</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>Tasks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
