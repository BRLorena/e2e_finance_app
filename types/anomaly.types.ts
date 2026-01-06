/**
 * Type definitions for HAR analysis anomalies and reports
 */

export type IssueType = 'error' | 'performance' | 'size';

export type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Issue {
  type: IssueType;
  description: string;
  impact: string;
  recommendation: string;
  severity?: IssueSeverity;
}

export interface Anomaly {
  url: string;
  status: number;
  time: number;
  size: string;
  issues: Issue[];
}

export interface AnalysisSummary {
  totalAnomalies: number;
  errorCount: number;
  slowResponseCount: number;
  largeSizeCount: number;
  anomalies: Anomaly[];
  timestamp?: string;
  testFile?: string;
}

export interface HARAnalysisConfig {
  enabled: boolean;
  thresholds: {
    responseTime: number;      // milliseconds
    payloadSize: number;       // bytes
  };
  aiReport: {
    enabled: boolean;
    model: string;
    language: string;
  };
  outputDir: string;
  failOn?: {
    errorCount?: number;
    slowResponseCount?: number;
    criticalErrors?: boolean;  // 5xx errors
  };
}

export interface AIReportRequest {
  anomalies: AnalysisSummary;
  language: string;
  model: string;
}

export interface AIReportResponse {
  report: string;
  generatedAt: string;
  model: string;
}
