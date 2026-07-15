import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Send, AlertCircle, FileText } from 'lucide-react';

export default function ManageWorkflows() {
  const { workflows, tasks, users, approveWorkflow, rejectWorkflow } = useContext(AppContext);
  const [selectedWfId, setSelectedWfId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Get active and resolved workflow lists
  const pendingWorkflows = workflows.filter(w => w.status === 'Pending');
  const resolvedWorkflows = workflows.filter(w => w.status === 'Approved' || w.status === 'Rejected');

  const getTaskTitle = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : 'Unknown Task';
  };

  const getEmployeeName = (empId) => {
    const user = users.find(u => u.id === empId);
    return user ? user.name : 'Unknown Employee';
  };

  const handleSelectWf = (wf) => {
    setSelectedWfId(wf.id);
    setReviewNotes('');
  };

  const handleApprove = () => {
    if (!selectedWfId) return;
    approveWorkflow(selectedWfId, reviewNotes);
    alert('Task approved successfully and marked as Completed.');
    setSelectedWfId(null);
    setReviewNotes('');
  };

  const handleReject = () => {
    if (!selectedWfId) return;
    if (!reviewNotes.trim()) {
      alert('Please write rejection comments explaining why this task is not complete.');
      return;
    }
    rejectWorkflow(selectedWfId, reviewNotes);
    alert('Task returned to employee with feedback notes.');
    setSelectedWfId(null);
    setReviewNotes('');
  };

  const selectedWf = workflows.find(w => w.id === selectedWfId);

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Workflow & Tasks Approvals</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Review developer plans, verify setup completions, and submit performance evaluations.</p>
      </div>

      {/* Main split queue grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', marginTop: '1rem', alignItems: 'start' }}>
        
        {/* Left: Approvals queue lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Queue */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(15, 22, 42, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <Clock size={18} style={{ color: 'var(--warning)' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Awaiting Supervisor Review ({pendingWorkflows.length})</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {pendingWorkflows.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  No pending task reviews in the supervisor queue.
                </div>
              ) : (
                pendingWorkflows.map(wf => (
                  <div
                    key={wf.id}
                    className="glass-card"
                    onClick={() => handleSelectWf(wf)}
                    style={{
                      cursor: 'pointer',
                      background: selectedWfId === wf.id ? 'var(--primary-glow)' : 'rgba(30, 41, 59, 0.25)',
                      borderColor: selectedWfId === wf.id ? 'var(--primary-hover)' : 'var(--border-glass)',
                      padding: '1rem 1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '0.35rem' }}>
                      <span>REQ ID: {wf.id}</span>
                      <span>{new Date(wf.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{getTaskTitle(wf.taskId)}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submitted by: <strong>{getEmployeeName(wf.employeeId)}</strong></span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Historical Log */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(15, 22, 42, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <ClipboardCheck size={18} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Resolved Workflows History</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {resolvedWorkflows.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  No historical approvals logged yet.
                </div>
              ) : (
                resolvedWorkflows.map(wf => (
                  <div key={wf.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid var(--border-glass)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem'
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{getTaskTitle(wf.taskId)}</h4>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Dev: {getEmployeeName(wf.employeeId)}</span>
                    </div>
                    <span className={`badge ${wf.status === 'Approved' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.65rem', flexShrink: 0 }}>
                      {wf.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Review Details Panel & Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px' }}>
          {selectedWf ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
              <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Evaluating Request {selectedWf.id}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{getTaskTitle(selectedWf.taskId)}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned to Developer: <strong>{getEmployeeName(selectedWf.employeeId)}</strong></span>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <FileText size={14} style={{ color: 'var(--primary)' }} /> Developer Implementation Plan
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(15,22,42,0.6)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-glass)', fontStyle: 'italic' }}>
                  "{selectedWf.employeeNotes || 'No notes submitted.'}"
                </p>
              </div>

              {/* Review inputs */}
              <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label>SUPERVISOR EVALUATION FEEDBACK</label>
                <textarea
                  className="form-textarea"
                  rows="5"
                  required
                  placeholder="Outline any code fixes needed, or write confirmation feedback notes for the developer..."
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  style={{ flex: 1, fontSize: '0.8rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                <button
                  type="button"
                  onClick={handleReject}
                  className="btn btn-danger"
                  style={{ flex: 1, display: 'flex', gap: '0.4rem', justifyContent: 'center' }}
                >
                  <XCircle size={15} /> Reject & Return
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="btn btn-success"
                  style={{ flex: 1.5, display: 'flex', gap: '0.4rem', justifyContent: 'center' }}
                >
                  <CheckCircle2 size={15} /> Approve Setup
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', gap: '0.5rem', textAlign: 'center', padding: '3rem 1rem' }}>
              <AlertCircle size={36} />
              <h4 style={{ color: 'var(--text-muted)' }}>No request selected</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '240px' }}>Select an active task evaluation from the review queue on the left to begin auditing details.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
