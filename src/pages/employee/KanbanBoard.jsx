import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { Trello, ArrowRight, ArrowLeft, Send, CheckCircle, ClipboardList, Play } from 'lucide-react';

export default function KanbanBoard() {
  const { currentUser, tasks, updateTaskStatus, planTask } = useContext(AppContext);

  if (!currentUser) return null;

  const userTasks = tasks.filter(t => t.assigneeId === currentUser.id);

  const columns = [
    { id: 'To Do', title: 'To Do', color: '#64748b' },
    { id: 'In Progress', title: 'In Progress', color: 'var(--primary)' },
    { id: 'In Review', title: 'In Review', color: 'var(--warning)' },
    { id: 'Completed', title: 'Completed', color: 'var(--success)' }
  ];

  const moveTask = (taskId, newStatus) => {
    // If moving from To Do to In Progress, ask for a quick plan first
    if (newStatus === 'In Progress') {
      const task = userTasks.find(t => t.id === taskId);
      if (!task.plan) {
        const planText = prompt("Enter a brief implementation plan to start this task:");
        if (!planText || !planText.trim()) {
          alert("A plan is required to move this task to In Progress!");
          return;
        }
        planTask(taskId, planText);
        return;
      }
    }
    updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Project Kanban Board</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visualize task lifecycles. Drag/move items to track project milestones.</p>
      </div>

      {/* Kanban grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.25rem',
        marginTop: '1.5rem',
        alignItems: 'start'
      }}>
        {columns.map(col => {
          const colTasks = userTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="glass-panel" style={{
              background: 'rgba(15, 22, 42, 0.4)',
              minHeight: '480px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              borderTop: `3px solid ${col.color}`
            }}>
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }} />
                  {col.title}
                </h3>
                <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                  {colTasks.length}
                </span>
              </div>

              {/* Column list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
                {colTasks.length === 0 ? (
                  <div style={{
                    border: '1px dashed var(--border-glass)',
                    borderRadius: '8px',
                    padding: '2rem 1rem',
                    textAlign: 'center',
                    color: 'var(--text-dim)',
                    fontSize: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    height: '100%'
                  }}>
                    <span>No Cards</span>
                  </div>
                ) : (
                  colTasks.map(task => (
                    <div key={task.id} className="glass-card" style={{
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      background: 'rgba(30, 41, 59, 0.35)',
                      borderLeft: task.plan ? '3px solid var(--primary-hover)' : '3px solid var(--border-glass)'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{task.title}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {task.desc}
                        </p>
                      </div>

                      {task.plan && (
                        <div style={{
                          fontSize: '0.7rem',
                          background: 'rgba(139, 92, 246, 0.04)',
                          border: '1px solid rgba(139, 92, 246, 0.1)',
                          padding: '0.4rem',
                          borderRadius: '4px',
                          color: 'var(--text-muted)',
                          fontStyle: 'italic',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          Plan: "{task.plan}"
                        </div>
                      )}

                      {/* Card Move Actions */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '0.25rem',
                        borderTop: '1px solid var(--border-glass)',
                        paddingTop: '0.5rem'
                      }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 700 }}>ID: {task.id}</span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {col.id !== 'To Do' && (
                            <button
                              onClick={() => {
                                const prevs = ['To Do', 'In Progress', 'In Review', 'Completed'];
                                const prevIdx = prevs.indexOf(col.id) - 1;
                                moveTask(task.id, prevs[prevIdx]);
                              }}
                              title="Move Left"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-dim)',
                                padding: '0.2rem',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                            >
                              <ArrowLeft size={14} />
                            </button>
                          )}
                          
                          {col.id !== 'Completed' && (
                            <button
                              onClick={() => {
                                const nexts = ['To Do', 'In Progress', 'In Review', 'Completed'];
                                const nextIdx = nexts.indexOf(col.id) + 1;
                                moveTask(task.id, nexts[nextIdx]);
                              }}
                              title={col.id === 'In Progress' ? "Submit for Review" : "Move Right"}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--text-dim)',
                                padding: '0.2rem',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-hover)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                            >
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
