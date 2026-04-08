import { useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import { Trust, SSA, SSAStatus, CRVStatus, TrustStatus } from '@/types/project';
import * as XLSX from 'xlsx';

interface ExcelUploadProps {
  onImport: (trusts: Trust[]) => void;
}

const generateId = () => crypto.randomUUID();

const validSSAStatus = (v: string): SSAStatus => {
  if (v === 'Complete' || v === 'In Progress') return v;
  return 'Not Tested';
};

const validCRVStatus = (v: string): CRVStatus => {
  if (v === 'Complete' || v === 'In Progress') return v;
  return 'Not Tested';
};

const validTrustStatus = (v: string): TrustStatus => {
  if (v === 'Live' || v === 'Customer Testing') return v;
  return 'Not Live';
};

function downloadTemplate() {
  const headers = [
    'Trust Name', 'Trust Number', 'Trust Status',
    'SSA Number', 'SSA Name', 'Source System',
    'Epic Link', 'AD Link', 'Test Suite Link', 'Data',
    'SSA Status', 'SSA Comment', 'CRV Status', 'CRV Comment', 'General Comments'
  ];

  const sampleRows = [
    ['Example Trust', 'T001', 'Live', 'SSA-001', 'First SSA', 'System A', '', '', '', '', 'Complete', '', 'In Progress', '', 'Sample comment'],
    ['Example Trust', 'T001', 'Live', 'SSA-002', 'Second SSA', 'System B', '', '', '', '', 'Not Tested', '', 'Not Tested', '', ''],
    ['Another Trust', 'T002', 'Not Live', 'SSA-003', 'Third SSA', 'System C', '', '', '', '', 'In Progress', 'WIP', 'Not Tested', '', ''],
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);

  // Set column widths
  ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 2, 14) }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  XLSX.writeFile(wb, 'trust_upload_template.xlsx');
}

function parseExcelData(data: ArrayBuffer): Trust[] {
  const wb = XLSX.read(data, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

  const trustMap = new Map<string, Trust>();

  for (const row of rows) {
    const trustKey = row['Trust Name'] || row['Trust name'] || '';
    if (!trustKey) continue;

    if (!trustMap.has(trustKey)) {
      trustMap.set(trustKey, {
        id: generateId(),
        trustName: trustKey,
        trustNumber: String(row['Trust Number'] || row['Trust number'] || ''),
        trustStatus: validTrustStatus(String(row['Trust Status'] || row['Trust status'] || '')),
        crvComment: String(row['CRV Comment'] || row['CRV comment'] || ''),
        generalComments: String(row['General Comments'] || row['General comments'] || row['Comments'] || ''),
        ssas: [],
      });
    }

    const trust = trustMap.get(trustKey)!;
    const ssaName = row['SSA Name'] || row['SSA name'] || '';

    if (ssaName || row['SSA Number'] || row['SSA number']) {
      const ssa: SSA = {
        id: generateId(),
        ssaNumber: String(row['SSA Number'] || row['SSA number'] || ''),
        ssaName: String(ssaName),
        sourceSystem: String(row['Source System'] || row['Source system'] || ''),
        epicLink: String(row['Epic Link'] || row['Epic link'] || ''),
        adLink: String(row['AD Link'] || row['AD link'] || ''),
        testSuiteLink: String(row['Test Suite Link'] || row['Test suite link'] || ''),
        data: String(row['Data'] || ''),
        ssaStatus: validSSAStatus(String(row['SSA Status'] || row['SSA status'] || '')),
        ssaComment: String(row['SSA Comment'] || row['SSA comment'] || ''),
        crvStatus: validCRVStatus(String(row['CRV Status'] || row['CRV status'] || '')),
      };
      trust.ssas.push(ssa);
    }
  }

  return Array.from(trustMap.values());
}

export function ExcelUpload({ onImport }: ExcelUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as ArrayBuffer;
      const trusts = parseExcelData(data);
      if (trusts.length > 0) {
        onImport(trusts);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Upload size={16} />
      </button>
      <button
        onClick={downloadTemplate}
        className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded-md text-sm font-medium hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        <Download size={16} /> Template
      </button>
    </div>
  );
}
