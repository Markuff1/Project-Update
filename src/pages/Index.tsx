import { useProjectData } from '@/hooks/useProjectData';
import { TrustCard } from '@/components/TrustCard';
import { ExcelUpload } from '@/components/ExcelUpload';
import { Plus } from 'lucide-react';

const Index = () => {
  const { trusts, loading, updateTrust, addTrust, deleteTrust, updateSSA, addSSA, deleteSSA, importTrusts } = useProjectData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  const totalSSAs = trusts.reduce((sum, t) => sum + t.ssas.length, 0);
  const completeSSAs = trusts.reduce((sum, t) => sum + t.ssas.filter(s => s.ssaStatus === 'Complete').length, 0);
  const inProgressSSAs = trusts.reduce((sum, t) => sum + t.ssas.filter(s => s.ssaStatus === 'In Progress').length, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'rgba(220, 225, 235, 1)', letterSpacing: '-0.01em' }}>Project Testing Tracker</h1>
            <p style={{ fontSize: 12, color: 'rgba(140, 150, 170, 0.8)', marginTop: 2 }}>
              {trusts.length} Trust{trusts.length !== 1 ? 's' : ''} · {totalSSAs} SSA{totalSSAs !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="trust-header-stats">
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
                <span className="trust-stat-value">{totalSSAs - completeSSAs - inProgressSSAs}</span>
                <span className="trust-stat-label">Not Tested</span>
              </span>
            </div>
            <ExcelUpload onImport={importTrusts} />
            <button onClick={addTrust} className="add-trust-btn">
              <Plus size={16} /> Add Trust
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1600, margin: '0 auto', padding: '24px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {trusts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ color: 'rgba(140, 150, 170, 0.8)', marginBottom: 16 }}>No trusts yet. Add your first trust or upload an Excel file.</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <button onClick={addTrust} className="add-trust-btn">Add Trust</button>
                <ExcelUpload onImport={importTrusts} />
              </div>
            </div>
          ) : (
            trusts.map(trust => (
              <TrustCard
                key={trust.id}
                trust={trust}
                onUpdateTrust={updates => updateTrust(trust.id, updates)}
                onDeleteTrust={() => deleteTrust(trust.id)}
                onUpdateSSA={(ssaId, updates) => updateSSA(trust.id, ssaId, updates)}
                onAddSSA={() => addSSA(trust.id)}
                onDeleteSSA={ssaId => deleteSSA(trust.id, ssaId)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
