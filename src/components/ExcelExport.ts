import { Trust } from '@/types/project';
import * as XLSX from 'xlsx';

export function downloadExcel(trusts: Trust[]) {
  const rows: any[] = [];

  trusts.forEach(trust => {
    trust.ssas.forEach(ssa => {
      rows.push({
        'Trust Name': trust.trustName,
        'Trust Number': trust.trustNumber,
        'Trust Status': trust.trustStatus,
        'PM': trust.PM || '',
        'TL': trust.TL || '',
        'Confluence Link': trust.ConflLink || '',

        'SSA Number': ssa.ssaNumber,
        'SSA Name': ssa.ssaName,
        'Source System': ssa.sourceSystem,
        'Epic Link': ssa.epicLink,
        'AD Link': ssa.adLink,
        'Test Suite Link': ssa.testSuiteLink,
        'Data': ssa.data,
        'Documents': ssa.documents ? 'Yes' : 'No',

        'SSA Status': ssa.ssaStatus,
        'SSA Comment': ssa.ssaComment,
        'CRV Status': ssa.crvStatus,

        'CRV URL': trust.crvUrl || '',
        'CRV Comment': trust.crvComment || '',
        'General Comments': trust.generalComments || '',
      });
    });
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // 🎨 HEADER STYLING
  const range = XLSX.utils.decode_range(ws['!ref'] || '');

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });

    if (!ws[cellAddress]) continue;

    ws[cellAddress].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4472C4' } },
      alignment: { horizontal: 'center' }
    };
  }

  // 📏 COLUMN WIDTHS
  ws['!cols'] = Object.keys(rows[0] || {}).map(key => ({
    wch: Math.max(key.length + 2, 18)
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Trust Data');

  XLSX.writeFile(wb, 'trust_data_export.xlsx');
}