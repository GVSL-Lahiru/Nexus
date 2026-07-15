import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { FileText, Plus, Edit, BookOpen, Sparkles, Send, Check } from 'lucide-react';

export default function ManageDocuments() {
  const { documents, createDocument, editDocument, improveDocByAI } = useContext(AppContext);
  
  // Selection & Mode
  const [selectedDocId, setSelectedDocId] = useState(null); // null = Create Mode
  const [isEditing, setIsEditing] = useState(false);

  // Form inputs
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Required');
  const [content, setContent] = useState('');

  // AI Refine states
  const [aiInstruction, setAiInstruction] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleEditSelect = (doc) => {
    setSelectedDocId(doc.id);
    setTitle(doc.title);
    setCategory(doc.category);
    setContent(doc.content);
    setIsEditing(true);
  };

  const handleCreateMode = () => {
    setSelectedDocId(null);
    setTitle('');
    setCategory('Required');
    setContent('');
    setIsEditing(true);
  };

  const handleSaveDocument = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (selectedDocId) {
      editDocument(selectedDocId, title, category, content);
      alert('Document draft saved and published successfully!');
    } else {
      createDocument(title, category, content);
      alert('New document guidelines created successfully!');
    }

    setIsEditing(false);
    setSelectedDocId(null);
  };

  const handleAIImprove = async () => {
    if (!content.trim()) {
      alert('Please write a basic document outline before utilizing AI improvements!');
      return;
    }
    setAiLoading(true);
    try {
      const improvedText = await improveDocByAI(content, aiInstruction);
      setContent(improvedText);
      setAiInstruction('');
      alert('AI has successfully expanded your document draft!');
    } catch (err) {
      alert('Error running AI Improvement script.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="page-content animate-fade-in" style={{ padding: '2rem', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Workspace Documentation</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Publish configuration standards, WSDL structures, and IDE formatting guides.</p>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={handleCreateMode} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <Plus size={16} /> Create Document
          </button>
        )}
      </div>

      {/* Main split dashboard view */}
      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, overflow: 'hidden', marginTop: '0.5rem' }}>
        
        {/* Left pane: list of existing docs */}
        <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'rgba(15, 22, 42, 0.4)' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Document Guidelines
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {documents.map(doc => (
              <div
                key={doc.id}
                onClick={() => handleEditSelect(doc)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: selectedDocId === doc.id ? 'var(--primary-glow)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${selectedDocId === doc.id ? 'var(--primary-hover)' : 'var(--border-glass)'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ minWidth: 0, paddingRight: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title}</h4>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Category: {doc.category}</span>
                </div>
                <Edit size={14} style={{ color: selectedDocId === doc.id ? 'var(--primary-hover)' : 'var(--text-dim)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Center pane: Form Editor */}
        {isEditing ? (
          <form onSubmit={handleSaveDocument} className="glass-panel" style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedDocId ? 'Edit Guidelines Document' : 'Compose New Onboarding Guide'}</h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setIsEditing(false); setSelectedDocId(null); }} style={{ fontSize: '0.8rem' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>Save & Publish</button>
              </div>
            </div>

            {/* Inputs */}
            <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label>DOCUMENT TITLE</label>
                <input type="text" className="form-input" required placeholder="e.g. Docker Development Environments" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>CATEGORY CLASSIFICATION</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="Required">Required Onboarding</option>
                  <option value="Useful">Useful Resource</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label>MARKDOWN CONTENT</label>
              <textarea
                className="form-textarea"
                required
                placeholder="# Document Title&#10;&#10;Write markdown specifications or configuration guidelines here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.8rem', resize: 'none' }}
              />
            </div>
          </form>
        ) : (
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', gap: '0.75rem' }}>
            <BookOpen size={48} />
            <h4 style={{ color: 'var(--text-muted)' }}>Select or create a document guidelines draft</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', maxWidth: '300px', textAlign: 'center' }}>Click an item on the left folder to edit it, or click the "Create Document" button to write a new one.</p>
          </div>
        )}

        {/* Right pane: AI improver sidebar */}
        {isEditing && (
          <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.03)' }}>
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Document Improver</h3>
            </div>
            
            <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Provide refinement parameters. Clicking improve will automatically format, expand, and structure your draft contents.</p>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>AI REFINEMENT GUIDELINES</label>
                <textarea
                  className="form-textarea"
                  rows="5"
                  placeholder="e.g. Add Checkstyles warnings diagnostics, append common compile troubleshooting guides, explain SOAP configuration flags..."
                  value={aiInstruction}
                  onChange={e => setAiInstruction(e.target.value)}
                  disabled={aiLoading}
                  style={{ fontSize: '0.8rem' }}
                />
              </div>

              <button
                type="button"
                onClick={handleAIImprove}
                disabled={aiLoading || !content.trim()}
                className="btn btn-primary"
                style={{ width: '100%', display: 'flex', gap: '0.4rem', justifyContent: 'center' }}
              >
                {aiLoading ? 'Improving Draft...' : 'Improve Document by AI'} <Sparkles size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
