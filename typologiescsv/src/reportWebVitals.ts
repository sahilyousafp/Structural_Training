import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

type ReportFn = (metric: any) => void;

const reportWebVitals = (onPerfEntry?: ReportFn) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
    onINP(onPerfEntry);
  }
};

export default reportWebVitals;
