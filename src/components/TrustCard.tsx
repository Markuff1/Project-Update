import { useState } from 'react';
import { Trust, SSA, TrustStatus, SSAStatus, CRVStatus } from '@/types/project';
import { EditableCell } from './EditableCell';
import { StatusDropdown } from './StatusDropdown';
import { ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react';

interface TrustCardProps {
  trust: Trust;
  onUpdateTrust: (updates: Partial<Trust>) => void;
  onDeleteTrust: () => void;
  onUpdateSSA: (ssaId: string, updates: Partial<SSA>) => void;
  onAddSSA: () => void;
  onDeleteSSA: (ssaId: string) => void;
}

const trustStatusOptions: TrustStatus[] = ['Live', 'Customer Testing', 'Not Live'];

const trustBadgeClass = (status: TrustStatus) => {
  switch (status) {
    case 'Live': return 'trust-badge-live';
    case 'Customer Testing': return 'trust-badge-testing';
    case 'Not Live': return 'trust-badge-not-live';
  }
};

const trustHeaderClass = (status: TrustStatus) => {
  switch (status) {
    case 'Live': return 'trust-header--live';
    case 'Customer Testing': return 'trust-header--testing';
    case 'Not Live': return 'trust-header--not-live';
  }
};

export function TrustCard({
  trust,
  onUpdateTrust,
  onDeleteTrust,
  onUpdateSSA,
  onAddSSA,
  onDeleteSSA
}: TrustCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div className={`trust-header ${trustHeaderClass(trust.trustStatus)}`}>
        <div className="trust-header-left">
          <button onClick={() => setExpanded(!expanded)} className="expand-btn">
            {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>

          <div className="trust-header-fields">
            <div className="flex-shrink-0">
              <EditableCell
                value={trust.trustNumber}
                onChange={v => onUpdateTrust({ trustNumber: v })}
                placeholder="Trust #"
                className="trust-number-field"
              />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <EditableCell
                value={trust.trustName}
                onChange={v => onUpdateTrust({ trustName: v })}
                placeholder="Trust Name"
                className="trust-name-field"
              />
            </div>

            <select
              value={trust.trustStatus}
              onChange={e => onUpdateTrust({ trustStatus: e.target.value as TrustStatus })}
              className={trustBadgeClass(trust.trustStatus)}
            >
              {trustStatusOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="trust-header-right">
          <div className="trust-header-stats">
            <span className="trust-stat">
              <span className="trust-stat-value">{trust.ssas.length}</span>
              <span className="trust-stat-label">SSAs</span>
            </span>

            <span className="trust-stat-divider" />

            <span className="trust-stat">
              <span className="trust-stat-value">
                {trust.ssas.filter(s => s.ssaStatus === 'Complete').length}
              </span>
              <span className="trust-stat-label">Complete</span>
            </span>

            <span className="trust-stat-divider" />

            <span className="trust-stat">
              <span className="trust-stat-value">
                {trust.ssas.filter(s => s.ssaStatus === 'In Progress').length}
              </span>
              <span className="trust-stat-label">In Progress</span>
            </span>

            <span className="trust-stat-divider" />

            <span className="trust-stat">
              <span className="trust-stat-value">
                {trust.ssas.filter(s => s.ssaStatus === 'Not Tested').length}
              </span>
              <span className="trust-stat-label">Not Tested</span>
            </span>
          </div>

          <button onClick={onDeleteTrust} className="delete-trust-btn" title="Delete Trust">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="overflow-x-auto">
          <table className="ssa-table">
            <thead>
              <tr className="ssa-table-header border-t border-border">
                <th style={{ width: 32 }}></th>
                <th>SSA #</th>
                <th>SSA Name</th>
                <th>Source System</th>
                <th>Epic</th>
                <th>AD</th>
                <th>Test Suite</th>
                <th>Data</th>
                <th style={{ textAlign: 'center' }}>SSA Status</th>
                <th className="col-ssa-comment">SSA Comment</th>
                <th style={{ textAlign: 'center' }}>CRV Status</th>
                <th className="col-crv-comment">CRV Comment</th>
                <th className="col-general-comments">Comments</th>
              </tr>
            </thead>

            <tbody>
              {trust.ssas.map((ssa, i) => (
                <tr key={ssa.id} className={`ssa-table-row ${i % 2 !== 0 ? 'ssa-table-row--alt' : ''}`}>
                  <td>
                    <button onClick={() => onDeleteSSA(ssa.id)} className="delete-ssa-btn" title="Delete SSA">
                      <Trash2 size={14} />
                    </button>
                  </td>

                  <td>
                    <EditableCell
                      value={ssa.ssaNumber}
                      onChange={v => onUpdateSSA(ssa.id, { ssaNumber: v })}
                      placeholder="—"
                      className="ssa-number-field"
                    />
                  </td>

                  <td><EditableCell value={ssa.ssaName} onChange={v => onUpdateSSA(ssa.id, { ssaName: v })} /></td>
                  <td><EditableCell value={ssa.sourceSystem} onChange={v => onUpdateSSA(ssa.id, { sourceSystem: v })} /></td>
                  <td><EditableCell value={ssa.epicLink} onChange={v => onUpdateSSA(ssa.id, { epicLink: v })} isLink placeholder="Add link" /></td>
                  <td><EditableCell value={ssa.adLink} onChange={v => onUpdateSSA(ssa.id, { adLink: v })} isLink placeholder="Add link" /></td>
                  <td><EditableCell value={ssa.testSuiteLink} onChange={v => onUpdateSSA(ssa.id, { testSuiteLink: v })} isLink placeholder="Add link" /></td>
                  <td><EditableCell value={ssa.data} onChange={v => onUpdateSSA(ssa.id, { data: v })} /></td>

                  <td style={{ textAlign: 'center' }}>
                    <StatusDropdown
                      value={ssa.ssaStatus}
                      onChange={v => onUpdateSSA(ssa.id, { ssaStatus: v as SSAStatus })}
                    />
                  </td>

                  <td>
                    <EditableCell
                      value={ssa.ssaComment}
                      onChange={v => onUpdateSSA(ssa.id, { ssaComment: v })}
                      multiline
                    />
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <StatusDropdown
                      value={ssa.crvStatus}
                      onChange={v => onUpdateSSA(ssa.id, { crvStatus: v as CRVStatus })}
                    />
                  </td>

                  {i === 0 && (
                    <td className="merged-cell" rowSpan={trust.ssas.length}>
                      <EditableCell
                        value={trust.crvComment}
                        onChange={v => onUpdateTrust({ crvComment: v })}
                        placeholder="CRV Comment"
                        multiline
                      />
                    </td>
                  )}

                  {i === 0 && (
                    <td className="merged-cell" rowSpan={trust.ssas.length}>
                      <EditableCell
                        value={trust.generalComments}
                        onChange={v => onUpdateTrust({ generalComments: v })}
                        placeholder="Comments"
                        multiline
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ padding: '8px 16px', borderTop: '1px solid rgba(50, 55, 70, 0.5)' }}>
            <button onClick={onAddSSA} className="add-ssa-btn">
              <Plus size={14} /> Add SSA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}