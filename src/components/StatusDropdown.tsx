import { SSAStatus, CRVStatus } from '@/types/project';

type StatusType = SSAStatus | CRVStatus;

interface StatusDropdownProps {
  value: StatusType;
  onChange: (value: StatusType) => void;
}

const options: StatusType[] = ['Complete', 'In Progress', 'Not Tested Yet','Not Needed'];

const statusClass = (status: StatusType) => {
  switch (status) {
    case 'Complete': return 'status-complete';
    case 'In Progress': return 'status-in-progress';
    case 'Not Tested Yet': return 'status-not-tested';
    case 'Not Needed': return 'status-Not-Needed';
  }
};

export function StatusDropdown({ value, onChange }: StatusDropdownProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as StatusType)}
      className={statusClass(value)}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}
