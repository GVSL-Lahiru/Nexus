import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { BookOpen, Search, CheckCircle, Clock, Sparkles, Send, FileText, ChevronRight } from 'lucide-react';

export default function Documentation() {
  const { currentUser, documents, toggleDocRead, generateAIResponse } = useContext(AppContext);
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Sidebar State
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', text: 'Select a document and ask me to explain configurations or command lines outlined in it!' }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  if (!currentUser) return null;

  // Filter documents by search
  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedDoc) return;

    const userMessage = chatInput;
    setChatLog(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setAiLoading(true);

    try {
      const response = await generateAIResponse(userMessage, selectedDoc.title);
      setChatLog(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (err) {
      setChatLog(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error checking setup files.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  const getReadStatus = (doc) => {
    const isRead = doc.readBy.includes(currentUser.id);
    return isRead ? 'Read' : 'Unread';
  };

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Documentation Repository</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required onboarding configuration steps and project transition guides.</p>
      </div>

      {/* Main split view container */}
      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, overflow: 'hidden', marginTop: '0.5rem' }}>
        
        {/* Left Side: Directory Search & List */}
        <div className="glass-panel" style={{ width: '320px', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(15, 22, 42, 0.4)' }}>
          {/* Search Header */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search repository..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: 'rgba(15, 22, 42, 0.6)',
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

          {/* Folders & Documents Lists */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Required Group */}
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', paddingLeft: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required Guides</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.4rem' }}>
                {filteredDocs.filter(d => d.category === 'Required').map(doc => {
                  const isSelected = selectedDocId === doc.id;
                  const isRead = doc.readBy.includes(currentUser.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setChatLog([{ sender: 'ai', text: `Analyzing document: "${doc.title}". Ask me any questions about its installation steps!` }]);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.7rem 0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: isSelected ? 'var(--primary-glow)' : 'transparent',
                        color: isSelected ? 'var(--primary-hover)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        fontSize: '0.825rem',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                        <FileText size={15} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-dim)', flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: isSelected ? 600 : 500 }}>{doc.title}</span>
                      </div>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isRead ? 'var(--success)' : 'var(--primary)',
                        boxShadow: isRead ? '0 0 6px rgba(16, 185, 129, 0.4)' : '0 0 6px rgba(139, 92, 246, 0.4)',
                        flexShrink: 0
                      }} title={isRead ? "Read completed" : "Reading required"} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Useful Group */}
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', paddingLeft: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Useful Resources</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.4rem' }}>
                {filteredDocs.filter(d => d.category === 'Useful').map(doc => {
                  const isSelected = selectedDocId === doc.id;
                  const isRead = doc.readBy.includes(currentUser.id);
                  return (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setChatLog([{ sender: 'ai', text: `Analyzing document: "${doc.title}". Ask me any questions about its installation steps!` }]);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.7rem 0.75rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: isSelected ? 'var(--primary-glow)' : 'transparent',
                        color: isSelected ? 'var(--primary-hover)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        fontSize: '0.825rem',
                        transition: 'var(--transition-smooth)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                        <FileText size={15} style={{ color: isSelected ? 'var(--primary)' : 'var(--text-dim)', flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: isSelected ? 600 : 500 }}>{doc.title}</span>
                      </div>
                      {isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} title="Read" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Document Reader */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '2rem' }}>
          {selectedDoc ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              
              {/* Reader Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem', marginBottom: '1.5rem', flexShrink: 0 }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>{selectedDoc.category} Onboarding</span>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedDoc.title}</h3>
                </div>
                
                {/* Mark as read checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                  <input
                    type="checkbox"
                    id={`checkbox-read-${selectedDoc.id}`}
                    checked={selectedDoc.readBy.includes(currentUser.id)}
                    onChange={() => toggleDocRead(selectedDoc.id, currentUser.id)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--success)' }}
                  />
                  <label htmlFor={`checkbox-read-${selectedDoc.id}`} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}>
                    Mark as Read & Completed
                  </label>
                </div>
              </div>

              {/* Reader Body */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div style={{
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  {selectedDoc.content}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.75rem', color: 'var(--text-dim)' }}>
              <BookOpen size={48} />
              <h4>Select a document to read</h4>
            </div>
          )}
        </div>

        {/* Right Side: AI Assistant Sidebar Context */}
        <div className="glass-panel" style={{ width: '320px', display: 'flex', flexDirection: 'column', overflow: 'hidden', borderLeft: '1px solid var(--border-glass)' }}>
          {/* Sidebar Header */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.03)' }}>
            <Sparkles size={16} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Document Explainer</h3>
          </div>

          {/* AI Chat Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {chatLog.map((chat, idx) => (
              <div key={idx} style={{
                alignSelf: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                background: chat.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                color: chat.sender === 'user' ? '#fff' : 'var(--text-main)',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                borderTopRightRadius: chat.sender === 'user' ? '2px' : '12px',
                borderTopLeftRadius: chat.sender === 'ai' ? '2px' : '12px',
                maxWidth: '90%',
                fontSize: '0.8rem',
                border: chat.sender === 'ai' ? '1px solid var(--border-glass)' : 'none',
                boxShadow: chat.sender === 'user' ? '0 4px 10px rgba(139, 92, 246, 0.2)' : 'none',
                whiteSpace: 'pre-wrap'
              }}>
                {chat.text}
              </div>
            ))}
            {aiLoading && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'rgba(255,255,255,0.03)',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                borderTopLeftRadius: '2px',
                fontSize: '0.8rem',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-dim)',
                fontStyle: 'italic'
              }}>
                AI is compiling document metrics...
              </div>
            )}
          </div>

          {/* AI Input Form */}
          <form onSubmit={handleAskAI} style={{ padding: '0.75rem', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '0.5rem', background: 'rgba(15, 22, 42, 0.4)' }}>
            <input
              type="text"
              placeholder="Ask about this document..."
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              disabled={aiLoading || !selectedDoc}
              style={{
                background: 'rgba(15, 22, 42, 0.6)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                outline: 'none',
                flex: 1
              }}
            />
            <button
              type="submit"
              disabled={aiLoading || !selectedDoc || !chatInput.trim()}
              className="btn btn-primary"
              style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', width: '34px', height: '34px' }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
