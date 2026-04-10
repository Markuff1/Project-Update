import { useState } from 'react';
import { useProjectData } from '@/hooks/useProjectData';
import { TrustCard } from '@/components/TrustCard';
import { ExcelUpload } from '@/components/ExcelUpload';
import { Plus, HelpCircle } from 'lucide-react';

const Index = () => {
  const {
    trusts,
    loading,
    updateTrust,
    addTrust,
    deleteTrust,
    updateSSA,
    addSSA,
    deleteSSA,
    importTrusts
  } = useProjectData();

  const [showHelp, setShowHelp] = useState(false);
  const [globalExpanded, setGlobalExpanded] = useState(true);

  if (loading) {
    return (
      <div className="loading-screen">
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  const totalSSAs = trusts.reduce((sum, t) => sum + t.ssas.length, 0);
  const completeSSAs = trusts.reduce(
    (sum, t) => sum + t.ssas.filter(s => s.ssaStatus === 'Complete').length,
    0
  );
  const inProgressSSAs = trusts.reduce(
    (sum, t) => sum + t.ssas.filter(s => s.ssaStatus === 'In Progress').length,
    0
  );

  const liveTrusts = trusts.filter(t => t.trustStatus === 'Live').length;
  const notLiveTrusts = trusts.filter(t => t.trustStatus === 'Not Live').length;
  const customerTestingTrusts = trusts.filter(
    t => t.trustStatus === 'Customer Testing'
  ).length;

  const handleAddTrust = () => {
    addTrust();

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-inner">
          {/* Left */}
          <div>
            <h1 className="app-title">Project Testing Tracker</h1>
            <p className="app-subtitle">
              {trusts.length} Trust{trusts.length !== 1 ? 's' : ''} · {totalSSAs} SSA
              {totalSSAs !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Right */}
          <div className="app-header-actions">
            {/* Trust Stats */}
            <div className="trust-header-stats">
              <div className="stats-label">Trusts:</div>

              <span className="trust-stat">
                <span className="trust-stat-value">{liveTrusts}</span>
                <span className="trust-stat-label">Live</span>
              </span>

              <span className="trust-stat-divider" />

              <span className="trust-stat">
                <span className="trust-stat-value">{customerTestingTrusts}</span>
                <span className="trust-stat-label">Customer Testing</span>
              </span>

              <span className="trust-stat-divider" />

              <span className="trust-stat">
                <span className="trust-stat-value">{notLiveTrusts}</span>
                <span className="trust-stat-label">Not Live</span>
              </span>
            </div>

            {/* SSA Stats */}
            <div className="trust-header-stats">
              <div className="stats-label">SSAs:</div>

              <span className="trust-stat">
                <span className="trust-stat-value">{completeSSAs}</span>
                <span className="trust-stat-label">Complete</span>
              </span>

              <span className="trust-stat-divider" />

              <span className="trust-stat">
                <span className="trust-stat-value">{inProgressSSAs}</span>
                <span className="trust-stat-label">In Progress</span>
              </span>

              <span className="trust-stat-divider" />

              <span className="trust-stat">
                <span className="trust-stat-value">
                  {totalSSAs - completeSSAs - inProgressSSAs}
                </span>
                <span className="trust-stat-label">Not Tested</span>
              </span>
            </div>

            <ExcelUpload onImport={importTrusts} />

            <button onClick={handleAddTrust} className="general-btn">
              <Plus size={20} />
            </button>

            <button onClick={() => setShowHelp(true)} className="general-btn">
              <HelpCircle size={20} />
            </button>

            <button
              onClick={() => setGlobalExpanded(prev => !prev)}
              className="general-btn"
              title={globalExpanded ? "Collapse all trusts" : "Expand all trusts"}
            >
              {globalExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="trust-list">
          {trusts.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">
                No trusts yet. Add your first trust or upload an Excel file.
              </p>

              <div className="empty-actions">
                <button onClick={addTrust} className="general-btn">
                  Add Trust
                </button>
                <ExcelUpload onImport={importTrusts} />
              </div>
            </div>
          ) : (
            trusts.map(trust => (
              <TrustCard
                key={trust.id}
                trust={trust}
                globalExpanded={globalExpanded}
                onUpdateTrust={updates => updateTrust(trust.id, updates)}
                onDeleteTrust={() => deleteTrust(trust.id)}
                onUpdateSSA={(ssaId, updates) =>
                  updateSSA(trust.id, ssaId, updates)
                }
                onAddSSA={() => addSSA(trust.id)}
                onDeleteSSA={ssaId => deleteSSA(trust.id, ssaId)}
              />
            ))
          )}
        </div>
      </main>

      {/* Help Modal */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">
              How to use the Project Testing Tracker
            </h2>

            <ul className="modal-list">
              <li>To Add a Trust using the "+" button</li>
              <li>Edit fields inline by clicking into cells</li>
              <li>Use SSA Status and CRV Status dropdowns</li>
              <li>Use Trust Status to classify progress</li>
              <li>Delete SSAs or Trusts using the trash icons</li>
            </ul>

            <div className="modal-footer">
              <button onClick={() => setShowHelp(false)} className="general-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;