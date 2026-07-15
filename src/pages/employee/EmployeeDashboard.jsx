import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  Sparkles,
  BookOpen,
  CheckSquare,
  Trello,
  Cpu,
  ArrowRight,
  TrendingUp,
  Award,
  HelpCircle,
  X,
  Play
} from 'lucide-react';

export default function EmployeeDashboard({ setActiveView }) {
  const { currentUser, tasks, documents } = useContext(AppContext);
  const [showTour, setShowTour] = useState(() => {
    return !localStorage.getItem('nexus_tour_completed');
  });
  const [tourStep, setTourStep] = useState(0);

  if (!currentUser) return null;

  // Calculate statistics
  const userTasks = tasks.filter(t => t.assigneeId === currentUser.id);
  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(t => t.status === 'Completed').length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const requiredDocs = documents.filter(d => d.category === 'Required');
  const totalDocs = requiredDocs.length;
  const readDocs = requiredDocs.filter(d => d.readBy.includes(currentUser.id)).length;
  const docProgress = totalDocs > 0 ? Math.round((readDocs / totalDocs) * 100) : 0;

  const overallProgress = Math.round((taskProgress + docProgress) / 2);

  const tourSteps = [
    {
      title: "Welcome to Nexus Workspace!",
      content: "This assistant is designed to eliminate setup friction and documentation fatigue. Let's take a quick 4-step tour."
    },
    {
      title: "Onboarding Checklist & Progress",
      content: "Here on the Dashboard, you can monitor your required document completions and active task status. Aim for 100% completion!"
    },
    {
      title: "My Tasks & Kanban Board",
      content: "Review assignments in 'My Tasks'. Before starting, click 'Plan Task' to log your workflow. Drag or update tasks to 'In Review' on the Kanban Board to request supervisor approval."
    },
    {
      title: "AI Growth Guide & Documentation",
      content: "Stuck on setup? Ask the Nexus AI chatbot in the 'AI Growth Guide'. Use the 'Adaptive Roadmap' to discover required tools and add them directly to your tasks."
    }
  ];

  const handleNextTour = () => {
    if (tourStep < tourSteps.length - 1) {
      setTourStep(prev => prev + 1);
    } else {
      localStorage.setItem('nexus_tour_completed', 'true');
      setShowTour(false);
    }
  };

  const handleSkipTour = () => {
    localStorage.setItem('nexus_tour_completed', 'true');
    setShowTour(false);
  };

  const startTour = () => {
    setTourStep(0);
    setShowTour(true);
  };

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Onboarding Tour Overlay Modal */}
      {showTour && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', border: '1px solid var(--primary)' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Workspace Guide</h3>
              </div>
              <button onClick={handleSkipTour} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ color: 'var(--primary-hover)', fontSize: '1.1rem' }}>{tourSteps[tourStep].title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tourSteps[tourStep].content}</p>
              {/* Progress circles */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'center' }}>
                {tourSteps.map((_, i) => (
                  <div key={i} style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: i === tourStep ? 'var(--primary)' : 'var(--border-glass)',
                    transition: 'var(--transition-smooth)'
                  }} />
                ))}
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={handleSkipTour}>Skip</button>
              <button className="btn btn-primary" onClick={handleNextTour}>
                {tourStep === tourSteps.length - 1 ? 'Get Started' : 'Next Step'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Summary Banner */}
      <div className="glass-panel stat-card" style={{
        padding: '2.5rem',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 22, 42, 0.8) 100%)',
        borderLeft: '4px solid var(--primary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} style={{ color: 'var(--warning)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--warning)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Welcome back to the team</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome, {currentUser.name}!</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {currentUser.role === 'Intern' 
              ? "You are logged into the Intern Workspace. Focus on setting up your local environment, reviewing repository structures, and completing reading goals."
              : "You are logged into the Transition Workspace. Review the current database structures, project tasks, and documentation to prepare for migration updates."
            }
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button className="btn btn-primary" onClick={() => setActiveView('ai-growth-guide')} style={{ fontSize: '0.8rem' }}>
              Open AI Growth Guide <Sparkles size={14} />
            </button>
            <button className="btn btn-secondary" onClick={startTour} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Play size={12} /> Restart Guide Tour
            </button>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '160px', background: 'rgba(15, 22, 42, 0.5)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Overall Score</span>
          <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>{overallProgress}%</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Onboarding Goal</span>
        </div>
      </div>

      {/* Progress Checker Checklist */}
      <div className="dashboard-grid">
        {/* Required Documents Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} style={{ color: 'var(--primary-hover)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Required Documentation</h3>
            </div>
            <span className="badge badge-primary">{readDocs} / {totalDocs} Read</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Important architectural guides and IDE configuration setup tutorials.</p>
          
          {/* Progress bar */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Reading Completion</span>
              <span style={{ fontWeight: 600, color: 'var(--primary-hover)' }}>{docProgress}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${docProgress}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => setActiveView('documentation')} style={{ width: '100%', fontSize: '0.8rem', marginTop: 'auto' }}>
            Open Documents <ArrowRight size={14} />
          </button>
        </div>

        {/* Assigned Tasks Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare size={20} style={{ color: 'var(--secondary)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Assigned Tasks</h3>
            </div>
            <span className="badge badge-secondary">{completedTasks} / {totalTasks} Done</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tasks assigned to your team to align with local development standards.</p>
          
          {/* Progress bar */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Task Completion</span>
              <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{taskProgress}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${taskProgress}%`, height: '100%', background: 'var(--secondary)', borderRadius: '3px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => setActiveView('my-tasks')} style={{ width: '100%', fontSize: '0.8rem', marginTop: 'auto' }}>
            Open Tasks <ArrowRight size={14} />
          </button>
        </div>

        {/* Active Kanban Summary Card */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trello size={20} style={{ color: 'var(--success)' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Kanban Progress</h3>
            </div>
            <span className="badge badge-success">Interactive Board</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Manage project timelines by moving your cards through statuses and submitting for approval.</p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>To-Do</span>
              <h4 style={{ fontSize: '1rem', color: '#fff' }}>{userTasks.filter(t => t.status === 'To Do').length}</h4>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active</span>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-hover)' }}>{userTasks.filter(t => t.status === 'In Progress').length}</h4>
            </div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.4rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>In Review</span>
              <h4 style={{ fontSize: '1rem', color: 'var(--warning)' }}>{userTasks.filter(t => t.status === 'In Review').length}</h4>
            </div>
          </div>
          <button className="btn btn-secondary" onClick={() => setActiveView('kanban-board')} style={{ width: '100%', fontSize: '0.8rem' }}>
            Open Kanban Board <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Helpful Tips Section */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
          <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Quick Tips for a Smooth Onboarding</h3>
        </div>
        <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <li>Always read through the <strong>Required Documentation</strong> before pulling repos or initiating docker-compose to prevent setup lockouts.</li>
          <li>For any task in <strong>To Do</strong> state, click the task and define an <strong>Implementation Plan</strong> to automatically activate it to <strong>In Progress</strong>.</li>
          <li>Once tasks are finished, update them to <strong>In Review</strong> to notify the admin team. Approved tasks receive feedback comments.</li>
        </ul>
      </div>

    </div>
  );
}
