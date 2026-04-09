import { useState } from 'react';
import { useProjectData } from '@/hooks/useProjectData';
import { TrustCard } from '@/components/TrustCard';
import { ExcelUpload } from '@/components/ExcelUpload';
import { Plus, HelpCircle } from 'lucide-react';
import { TrustStatus } from '@/types/project';

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
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

  // Trust status stats (from enum)
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
        <div
          style={{
            maxWidth: 2000,
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Left */}
          <div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'rgba(220, 225, 235, 1)',
                letterSpacing: '-0.01em'
              }}
            >
              Project Testing Tracker
            </h1>
            <p
              style={{
                fontSize: 12,
                color: 'rgba(140, 150, 170, 0.8)',
                marginTop: 2
              }}
            >
              {trusts.length} Trust{trusts.length !== 1 ? 's' : ''} · {totalSSAs} SSA
              {totalSSAs !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Trust Status Stats */}
            <div className="trust-header-stats">
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(140, 150, 170, 0.8)',
                  marginBottom: 4
                }}
              >
                Trusts:
              </div>

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
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(140, 150, 170, 0.8)',
                  marginBottom: 4
                }}
              >
                SSAs:
              </div>

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

            <button onClick={handleAddTrust} className="add-trust-btn">
              <Plus size={20} />
            </button>

            <button onClick={() => setShowHelp(true)} className="add-trust-btn">
              <HelpCircle size={20} />
            </button>

            <button
              onClick={() => setGlobalExpanded(prev => !prev)}
              className="add-trust-btn"
              title={globalExpanded ? "Collapse all trusts" : "Expand all trusts"}
            >
              {globalExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 2150, margin: '0 auto', padding: '24px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {trusts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p
                style={{
                  color: 'rgba(140, 150, 170, 0.8)',
                  marginBottom: 16
                }}
              >
                No trusts yet. Add your first trust or upload an Excel file.
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12
                }}
              >
                <button onClick={addTrust} className="add-trust-btn" title="Add a new trust">
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
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}
          onClick={() => setShowHelp(false)}
        >
          <div
            style={{
              background: '#1e1f26',
              padding: 24,
              borderRadius: 12,
              maxWidth: 600,
              width: '90%'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
              How to use the Project Testing Tracker
            </h2>

            <ul
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'rgba(220,225,235,0.85)'
              }}
            >
              <li>To Add a Trust using the “+" button and in there you can change the name, add SSAs and change status</li>
              <li>Edit fields inline by clicking into cells.</li>
              <li>Use SSA Status and CRV Status dropdowns to track progress.</li>
              <li>Use Trust Status to classify overall progress.</li>
              <li>Delete SSAs or Trusts using the trash icons.</li>
            </ul>

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button
                onClick={() => setShowHelp(false)}
                className="add-trust-btn"
              >
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