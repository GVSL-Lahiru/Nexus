import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { CheckSquare, Search, ClipboardList, Clock, CheckCircle2, ChevronRight, FileCode, AlertCircle } from 'lucide-react';

export default function MyTasks() {
  const { currentUser, tasks, planTask, updateTaskStatus } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [planInput, setPlanInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!currentUser) return null;

  // Filter tasks for current user
  const userTasks = tasks.filter(t => t.assigneeId === currentUser.id);

  // Filter by tab
  const tabFiltered = userTasks.filter(t => {
    if (activeTab === 'All') return true;
    if (activeTab === 'To Do') return t.status === 'To Do';
    if (activeTab === 'In Progress') return t.status === 'In Progress';
    if (activeTab === 'In Review') return t.status === 'In Review';
    if (activeTab === 'Completed') return t.status === 'Completed';
    return true;
  });

  // Filter by search query
  const finalFiltered = tabFiltered.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenTask = (task) => {
    setSelectedTask(task);
    setPlanInput(task.plan || '');
    setErrorMsg('');
  };

  const handleCloseTask = () => {
    setSelectedTask(null);
  };

  const handlePlanSubmit = (e) => {
    e.preventDefault();
    if (!planInput.trim()) {
      setErrorMsg('Please outline your setup or code changes before activating the task.');
      return;
    }
    planTask(selectedTask.id, planInput);
    setSelectedTask({ ...selectedTask, plan: planInput, status: 'In Progress' });
    setErrorMsg('');
  };

  const handleSubmitForReview = () => {
    updateTaskStatus(selectedTask.id, 'In Review');
    setSelectedTask({ ...selectedTask, status: 'In Review' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'To Do': return <ClipboardList size={16} style={{ color: 'var(--text-muted)' }} />;
      case 'In Progress': return <Clock size={16} style={{ color: 'var(--primary)' }} />;
      case 'In Review': return <AlertCircle size={16} style={{ color: 'var(--warning)' }} />;
      case 'Completed': return <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />;
      default: return <ClipboardList size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'To Do': return <span className="badge badge-primary">To Do</span>;
      case 'In Progress': return <span className="badge badge-secondary" style={{ background: 'var(--primary-glow)', color: 'var(--primary-hover)' }}>In Progress</span>;
      case 'In Review': return <span className="badge badge-warning">In Review</span>;
      case 'Completed': return <span className="badge badge-success">Completed</span>;
      default: return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Header Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Work Items</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Search and execute tasks assigned to your role setup flow.</p>
      </div>

      {/* Filters and Search row */}
      <div className="glass-panel" style={{
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
          {['All', 'To Do', 'In Progress', 'In Review', 'Completed'].map(tab => {
            const count = tab === 'All' 
              ? userTasks.length 
              : userTasks.filter(t => t.status === tab).length;
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 0.85rem',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <span>{tab}</span>
                <span style={{
                  background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                  color: isSelected ? '#fff' : 'var(--text-dim)',
                  padding: '1px 6px',
                  borderRadius: '20px',
                  fontSize: '0.7rem'
                }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search tasks..."
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
      </div>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        {finalFiltered.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <ClipboardList size={36} style={{ color: 'var(--text-dim)' }} />
            <h3 style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>No tasks found</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', maxWidth: '300px' }}>There are no tasks matching your selected filters or search queries.</p>
          </div>
        ) : (
          finalFiltered.map(task => (
            <div
              key={task.id}
              className="glass-card"
              onClick={() => handleOpenTask(task)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '1.25rem 1.5rem',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-glass)'
                }}>
                  {getStatusIcon(task.status)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.2rem' }}>{task.desc}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                {getStatusBadge(task.status)}
                <ChevronRight size={16} style={{ color: 'var(--text-dim)' }} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Details / Plan Form Modal */}
      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Task Execution</h3>
              </div>
              <button className="btn-secondary" onClick={handleCloseTask} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}>×</button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Task ID: {selectedTask.id}</span>
                  {getStatusBadge(selectedTask.status)}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedTask.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>{selectedTask.desc}</p>
              </div>

              {/* Feedback from Admin if exists */}
              {selectedTask.feedback && (
                <div style={{
                  background: selectedTask.status === 'Completed' ? 'var(--success-glow)' : 'var(--danger-glow)',
                  border: `1px solid ${selectedTask.status === 'Completed' ? 'var(--success)' : 'var(--danger)'}`,
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedTask.status === 'Completed' ? 'var(--success)' : '#fca5a5' }}>
                    {selectedTask.status === 'Completed' ? 'SUPERVISOR APPROVAL FEEDBACK' : 'REJECTION COMMENTS'}
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>{selectedTask.feedback}</p>
                </div>
              )}

              {/* Status Section details */}
              {selectedTask.status === 'To Do' && (
                <form onSubmit={handlePlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileCode size={16} style={{ color: 'var(--primary)' }} />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Create Implementation Plan</h4>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Before you begin, write down your strategy (e.g. IDE commands, configuration file formats, repositories to download). This encourages recognition rather than recall.
                  </p>
                  
                  {errorMsg && <p style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{errorMsg}</p>}

                  <textarea
                    rows="4"
                    className="form-textarea"
                    placeholder="Describe how you plan to complete this task (tools, configs, steps)..."
                    value={planInput}
                    onChange={e => setPlanInput(e.target.value)}
                    required
                    style={{ fontSize: '0.85rem' }}
                  />

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Save Plan & Start Task
                  </button>
                </form>
              )}

              {selectedTask.status === 'In Progress' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileCode size={16} style={{ color: 'var(--primary)' }} />
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Saved Implementation Plan</h4>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(15,22,42,0.6)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-glass)', fontStyle: 'italic' }}>
                    "{selectedTask.plan}"
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>When you are fully finished with the task requirements, submit it to your supervisor for verification.</p>
                  <button type="button" className="btn btn-success" onClick={handleSubmitForReview} style={{ width: '100%', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    Submit Task for Supervisor Review
                  </button>
                </div>
              )}

              {selectedTask.status === 'In Review' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem', textAlign: 'center', padding: '1.5rem 0' }}>
                  <Clock size={36} style={{ color: 'var(--warning)', margin: '0 auto' }} />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--warning)' }}>Awaiting Approval</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto' }}>
                    This task has been sent to the supervisor queue. You will receive a notification feedback notes when it is approved or rejected.
                  </p>
                </div>
              )}

              {selectedTask.status === 'Completed' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem', textAlign: 'center', padding: '1.5rem 0' }}>
                  <CheckCircle2 size={36} style={{ color: 'var(--success)', margin: '0 auto' }} />
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--success)' }}>Task Complete</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto' }}>
                    This task has been fully resolved and verified. No further action is required.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseTask}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
