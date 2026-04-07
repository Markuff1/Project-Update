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
  ssaStatus: SSAStatus;
  ssaComment: string;
  crvStatus: CRVStatus;
}

export interface Trust {
  id: string;
  trustName: string;
  trustNumber: string;
  trustStatus: TrustStatus;
  crvComment: string;
  generalComments: string;
  ssas: SSA[];
}
