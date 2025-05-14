export interface Point {
  x: number;
  y: number;
  z: number;
}

export interface CSVData {
  points: Point[];
  name: string;
  id: string;
}

export interface GridLine {
  id: string;
  start: Point;
  end: Point;
  direction: 'horizontal' | 'vertical';
}

export interface Column {
  id: string;
  position: Point;
  size: number;
}

export interface UserData {
  gridLines: GridLine[];
  columns: Column[];
  placementDecisions?: string;
}

export interface AccuracyResult {
  score: number;
  feedback: string;
  details: string;
}

export interface UserCredentials {
  username: string;
  email: string;
  engineerType: string;
  lastLogin: string;
}

export interface ExportData {
  floorPlan: CSVData;
  userData: UserData;
  accuracy?: AccuracyResult;
  userCredentials?: UserCredentials;
}
