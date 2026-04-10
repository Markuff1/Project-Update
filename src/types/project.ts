export type TrustStatus = 'Live' | 'Customer Testing' | 'Not Live';
export type SSAStatus = 'Complete' | 'In Progress' | 'Not Tested';
export type CRVStatus = 'Complete' | 'In Progress' | 'Not Tested';

export interface SSA {
  id: string;
  ssaNumber: string;
  ssaName: string;
  sourceSystem: string;
  epicLink: string;
  adLink: string;
  testSuiteLink: string;
  data: string;
  documents?: boolean; 
  ssaStatus: SSAStatus;
  ssaComment: string;
  crvStatus: CRVStatus;
}

export interface Trust {
  id: string;
  PM: string;
  TL: string;
  ConflLink: string;
  globalExpanded?: boolean;
  trustName: string;
  trustNumber: string;
  trustStatus: TrustStatus;
  crvComment: string;
  generalComments: string;
  crvUrl?: string; 
  ssas: SSA[];
}
