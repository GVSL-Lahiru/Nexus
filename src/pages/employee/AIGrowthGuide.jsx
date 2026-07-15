import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Sparkles, MessageSquare, Link, GitFork, Send, Plus, CheckCircle, BookOpen, ChevronRight, HelpCircle, Terminal } from 'lucide-react';

export default function AIGrowthGuide() {
  const { currentUser, generateAIResponse, addTask, tasks, addNotification } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('Chat'); // Chat, Resources, Roadmap

  // Chat tab states
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: 'Hello! I am your AI Employer Advisor. Ask me anything about IDE setups, Docker configurations, git workflows, or team structures.' }
  ]);
  const [loading, setLoading] = useState(false);

  // Import Resources states
  const [resourceText, setResourceText] = useState('');
  const [resourceAnalysis, setResourceAnalysis] = useState('');
  const [resourceLoading, setResourceLoading] = useState(false);

  // Roadmap states
  const [selectedNodeId, setSelectedNodeId] = useState(1);

  if (!currentUser) return null;

  // Adaptive Roadmap nodes data
  const roadmapNodes = [
    {
      id: 1,
      title: "LDAP & VPN Credentials",
      desc: "Configure secure corporate directory access and verify FortiClient VPN authentication paths.",
      duration: "Day 1",
      prereq: "None",
      commands: "ping gate.company.com",
      docId: "doc1"
    },
    {
      id: 2,
      title: "IDE Setup & Checkstyles",
      desc: "Configure editor formatters using eclipse-java-google-style.xml and import checkstyle rules.",
      duration: "Day 2",
      prereq: "VPN Access",
      commands: "./scripts/install-hooks.sh",
      docId: "doc1"
    },
    {
      id: 3,
      title: "Docker Cluster Launch",
      desc: "Download and deploy local microservices cluster databases for Project Phoenix module.",
      duration: "Day 3",
      prereq: "IDE Setup",
      commands: "docker-compose up -d --build",
      docId: "doc2"
    },
    {
      id: 4,
      title: "WSDL SOAP Mappings",
      desc: "Review billing legacy endpoints, parse SOAP packages, and trace schema validations.",
      duration: "Day 4",
      prereq: "Docker Setup",
      commands: "mvn clean test -P soap-test",
      docId: "doc3"
    },
    {
      id: 5,
      title: "First Pull Request",
      desc: "Create local feature branch off main, run verify compiler checkstyles, and submit PR to supervisor.",
      duration: "Day 5",
      prereq: "WSDL Mapping",
      commands: "git checkout -b feature/setup; git push origin feature/setup",
      docId: "doc1"
    }
  ];

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput;
    setChatLog(prev => [...prev, { sender: 'user', text: query }]);
    setChatInput('');
    setLoading(true);

    try {
      const reply = await generateAIResponse(query);
      setChatLog(prev => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setChatLog(prev => [...prev, { sender: 'ai', text: 'Error compiling response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeResource = (e) => {
    e.preventDefault();
    if (!resourceText.trim()) return;

    setResourceLoading(true);
    setResourceAnalysis('');

    setTimeout(() => {
      let analysis = `### Nexus AI - Logs & Resources Analysis
**Identified Issue**: Local Docker service fails to bind to port \`5432\` (PostgreSQL default port).
**Reason**: An existing instance of PostgreSQL server is running natively on your Windows host machine, causing a port binding conflict.
**Recommended Solutions**:
1. Open Windows Command Prompt and stop the local postgres service:
   \`net stop postgresql-x64-15\` (or your version number).
2. Or, modify your \`docker-compose.yml\` mapping from:
   \`- "5432:5432"\` to \`- "5433:5432"\` and update your local JDBC database URL properties to target port \`5433\`.`;
      setResourceAnalysis(analysis);
      setResourceLoading(false);
      addNotification('AI Analysis Complete', 'Successfully scanned checkstyle logs for configuration conflicts.');
    }, 1500);
  };

  const handleAddRoadmapTask = (node) => {
    // Check if task already exists in workspace
    const exists = tasks.some(t => t.title.includes(node.title) && t.assigneeId === currentUser.id);
    if (exists) {
      alert("This roadmap task is already in your workspace tasks list!");
      return;
    }
    
    // Add task
    addTask(
      `Roadmap: ${node.title}`,
      `Setup item from your Adaptive Roadmap: ${node.desc} Commands: ${node.commands}`,
      currentUser.team || 't1',
      currentUser.id
    );
    alert(`Successfully added "${node.title}" to your My Tasks list!`);
  };

  const selectedNode = roadmapNodes.find(n => n.id === selectedNodeId);

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>AI Growth Guide</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Interactive roadmap planning, resource analyzers, and intelligent setup assistance.</p>
        </div>
        
        {/* Sub tabs */}
        <div className="glass-panel" style={{ display: 'flex', gap: '0.15rem', padding: '0.25rem', borderRadius: '8px' }}>
          {['Chat', 'Resources', 'Roadmap'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              style={{
                background: activeSubTab === tab ? 'var(--primary)' : 'transparent',
                color: activeSubTab === tab ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* View Switcher */}
      <div style={{ flex: 1, overflow: 'hidden', marginTop: '1rem', display: 'flex' }}>
        
        {/* CHAT TAB */}
        {activeSubTab === 'Chat' && (
          <div className="glass-panel animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(15, 22, 42, 0.4)' }}>
            {/* Chat logs */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {chatLog.map((chat, idx) => (
                <div key={idx} style={{
                  alignSelf: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: chat.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                  color: chat.sender === 'user' ? '#fff' : 'var(--text-main)',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '14px',
                  borderTopRightRadius: chat.sender === 'user' ? '2px' : '14px',
                  borderTopLeftRadius: chat.sender === 'ai' ? '2px' : '14px',
                  maxWidth: '75%',
                  fontSize: '0.85rem',
                  border: chat.sender === 'ai' ? '1px solid var(--border-glass)' : 'none',
                  boxShadow: chat.sender === 'user' ? '0 5px 15px rgba(139, 92, 246, 0.15)' : 'none',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6'
                }}>
                  {chat.text}
                </div>
              ))}
              {loading && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '14px',
                  borderTopLeftRadius: '2px',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-dim)',
                  fontSize: '0.85rem',
                  fontStyle: 'italic'
                }}>
                  Nexus AI is analyzing setup specifications...
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendChat} style={{ padding: '1rem', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '0.75rem', background: 'rgba(15, 22, 42, 0.5)' }}>
              <input
                type="text"
                placeholder="Ask about checkstyle parameters, environment issues, WSDL routes..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                disabled={loading}
                style={{
                  background: 'rgba(15, 22, 42, 0.8)',
                  border: '1px solid var(--border-glass)',
                  padding: '0.75rem 1rem',
                  color: '#fff',
                  fontSize: '0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                  flex: 1
                }}
              />
              <button
                type="submit"
                disabled={loading || !chatInput.trim()}
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.25rem' }}
              >
                Send <Send size={14} />
              </button>
            </form>
          </div>
        )}

        {/* IMPORT RESOURCES TAB */}
        {activeSubTab === 'Resources' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', flex: 1, width: '100%' }}>
            {/* Input resources panel */}
            <form onSubmit={handleAnalyzeResource} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(15, 22, 42, 0.4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                <Terminal size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Log & Config File Scanner</h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Paste compile error outputs, build checkstyle violations, or console trace blocks to resolve setup bugs.</p>
              
              <textarea
                className="form-textarea"
                rows="10"
                required
                value={resourceText}
                onChange={e => setResourceText(e.target.value)}
                placeholder="Paste code logs or console scripts here... e.g. Port 5432 connection refused, checkstyle rule violation"
                style={{ flex: 1, fontSize: '0.8rem', fontFamily: 'monospace' }}
              />

              <button type="submit" disabled={resourceLoading || !resourceText.trim()} className="btn btn-primary" style={{ width: '100%' }}>
                {resourceLoading ? 'Processing file analytics...' : 'Analyze Stack Trace'}
              </button>
            </form>

            {/* Analysis output panel */}
            <div className="glass-panel" style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--success)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>AI Scanner Summary</h3>
              </div>

              {resourceAnalysis ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {resourceAnalysis}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', gap: '0.5rem' }}>
                  <HelpCircle size={36} />
                  <p style={{ fontSize: '0.8rem' }}>Awaiting log file scan submissions...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ADAPTIVE ROADMAP TAB */}
        {activeSubTab === 'Roadmap' && (
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.25rem', flex: 1, width: '100%' }}>
            
            {/* Visual Timeline Path */}
            <div className="glass-panel" style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(15, 22, 42, 0.4)' }}>
              <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Onboarding Integration Tree</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complete these nodes sequentially. Click any step to read configurations.</p>
              </div>

              {/* Node timelines */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '1rem', position: 'relative', marginTop: '1rem' }}>
                {/* Vertical Line */}
                <div style={{
                  position: 'absolute',
                  left: '19px',
                  top: '10px',
                  bottom: '10px',
                  width: '2px',
                  background: 'linear-gradient(to bottom, var(--primary) 0%, var(--success) 100%)',
                  opacity: 0.3
                }} />

                {roadmapNodes.map((node, index) => {
                  const isSelected = selectedNodeId === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      style={{
                        display: 'flex',
                        gap: '1.25rem',
                        cursor: 'pointer',
                        position: 'relative',
                        zIndex: 10,
                        transform: isSelected ? 'translateX(5px)' : 'none',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      {/* Node circle */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isSelected ? 'var(--primary)' : 'var(--bg-surface-solid)',
                        border: `2px solid ${isSelected ? 'var(--primary-hover)' : 'var(--border-glass)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        boxShadow: isSelected ? '0 0 15px rgba(139, 92, 246, 0.5)' : 'none',
                        transition: 'var(--transition-smooth)'
                      }}>
                        {node.id}
                      </div>

                      {/* Node Text preview */}
                      <div className="glass-card" style={{
                        flex: 1,
                        padding: '0.85rem 1.25rem',
                        background: isSelected ? 'rgba(30, 41, 59, 0.65)' : 'rgba(30, 41, 59, 0.25)',
                        borderColor: isSelected ? 'var(--primary-hover)' : 'var(--border-glass)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: isSelected ? 'var(--primary-hover)' : '#fff' }}>{node.title}</h4>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Expected Timeline: {node.duration}</span>
                        </div>
                        <ChevronRight size={16} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-dim)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Node Details Card & Actions */}
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {selectedNode ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
                  <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', marginBottom: '0.5rem' }}>Node {selectedNode.id} Guidelines</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedNode.title}</h3>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Description</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedNode.desc}</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Target Day</span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--primary-hover)' }}>{selectedNode.duration}</strong>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.01)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', textTransform: 'uppercase' }}>Prerequisites</span>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>{selectedNode.prereq}</strong>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.35rem' }}>Verification Script</h4>
                    <code style={{
                      background: 'rgba(15, 22, 42, 0.8)',
                      color: 'var(--text-main)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      border: '1px solid var(--border-glass)',
                      display: 'block',
                      overflowX: 'auto'
                    }}>
                      {selectedNode.commands}
                    </code>
                  </div>

                  {/* Add to my tasks action button */}
                  <button
                    onClick={() => handleAddRoadmapTask(selectedNode)}
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: 'auto', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
                  >
                    <Plus size={16} /> Add to My Tasks
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-dim)', gap: '0.5rem' }}>
                  <HelpCircle size={36} />
                  <p style={{ fontSize: '0.8rem' }}>Select a roadmap node to view details.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
