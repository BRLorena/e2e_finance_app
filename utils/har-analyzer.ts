/**
 * HAR Analyzer Utility
 * Analyzes HAR files for anomalies including HTTP errors, slow responses, and large payloads
 */

import * as fs from 'fs';
import * as path from 'path';
import type { HARFile, HAREntry } from '../types/har.types';
import type { Anomaly, AnalysisSummary, Issue, IssueType, IssueSeverity } from '../types/anomaly.types';

export interface AnalyzerThresholds {
  responseTime: number;  // milliseconds
  payloadSize: number;   // bytes
}

export class HARAnalyzer {
  private thresholds: AnalyzerThresholds;

  constructor(thresholds: AnalyzerThresholds = { responseTime: 2000, payloadSize: 1_000_000 }) {
    this.thresholds = thresholds;
  }

  /**
   * Analyze a HAR file for anomalies
   */
  async analyzeFile(harFilePath: string, testFile?: string): Promise<AnalysisSummary> {
    if (!fs.existsSync(harFilePath)) {
      throw new Error(`HAR file not found: ${harFilePath}`);
    }

    const harContent = fs.readFileSync(harFilePath, 'utf-8');
    const har: HARFile = JSON.parse(harContent);

    return this.analyze(har, testFile);
  }

  /**
   * Analyze HAR data for anomalies
   */
  analyze(har: HARFile, testFile?: string): AnalysisSummary {
    const anomalies: Anomaly[] = [];
    let errorCount = 0;
    let slowResponseCount = 0;
    let largeSizeCount = 0;

    for (const entry of har.log.entries) {
      const issues = this.analyzeEntry(entry);
      
      if (issues.length > 0) {
        const { status } = entry.response;
        const time = entry.time;
        const size = entry.response.content.size || 0;
        const sizeInMB = size / (1024 * 1024);

        // Count each type of issue
        issues.forEach((issue) => {
          if (issue.type === 'error') errorCount++;
          if (issue.type === 'performance') slowResponseCount++;
          if (issue.type === 'size') largeSizeCount++;
        });

        anomalies.push({
          url: entry.request.url,
          status,
          time,
          size: sizeInMB.toFixed(2) + ' MB',
          issues,
        });
      }
    }

    return {
      totalAnomalies: anomalies.length,
      errorCount,
      slowResponseCount,
      largeSizeCount,
      anomalies,
      timestamp: new Date().toISOString(),
      testFile,
    };
  }

  /**
   * Analyze a single HAR entry for issues
   */
  private analyzeEntry(entry: HAREntry): Issue[] {
    const issues: Issue[] = [];
    const { status } = entry.response;
    const time = entry.time;
    const size = entry.response.content.size || 0;
    const sizeInMB = size / (1024 * 1024);

    // Check for HTTP errors (4xx, 5xx)
    if (status >= 400) {
      issues.push({
        type: 'error',
        description: `Status ${status} (${this.getStatusText(status)})`,
        impact: this.getErrorImpact(status),
        recommendation: this.getErrorRecommendation(status),
        severity: this.getErrorSeverity(status),
      });
    }

    // Check for slow responses
    if (time > this.thresholds.responseTime) {
      issues.push({
        type: 'performance',
        description: `Response time: ${time.toFixed(0)} ms (exceeds ${this.thresholds.responseTime} ms threshold)`,
        impact: 'Slow page load times affecting user experience',
        recommendation: 'Investigate backend performance, consider caching or optimization',
        severity: this.getPerformanceSeverity(time),
      });
    }

    // Check for large payloads
    if (size > this.thresholds.payloadSize) {
      issues.push({
        type: 'size',
        description: `Payload size: ${sizeInMB.toFixed(2)} MB (exceeds ${(this.thresholds.payloadSize / (1024 * 1024)).toFixed(2)} MB threshold)`,
        impact: 'Large payload may cause slow loading on mobile networks',
        recommendation: 'Consider implementing pagination, compression, or lazy loading',
        severity: this.getSizeSeverity(size),
      });
    }

    return issues;
  }

  /**
   * Get human-readable status text
   */
  private getStatusText(status: number): string {
    const statusTexts: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      408: 'Request Timeout',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
    };
    return statusTexts[status] || 'Unknown Error';
  }

  /**
   * Get error impact description
   */
  private getErrorImpact(status: number): string {
    if (status === 404) return 'Missing resource affecting functionality';
    if (status === 401 || status === 403) return 'Authentication/Authorization issues';
    if (status >= 500) return 'Server-side issues affecting service availability';
    if (status === 429) return 'Rate limiting affecting service availability';
    return 'Request failed, potentially affecting user experience';
  }

  /**
   * Get error recommendation
   */
  private getErrorRecommendation(status: number): string {
    if (status === 404) return 'Ensure resource exists or update/remove references';
    if (status === 401 || status === 403) return 'Verify authentication credentials and permissions';
    if (status >= 500) return 'Investigate server logs and backend services';
    if (status === 429) return 'Implement request throttling or increase rate limits';
    return 'Review request parameters and server configuration';
  }

  /**
   * Get error severity
   */
  private getErrorSeverity(status: number): IssueSeverity {
    if (status >= 500) return 'critical';
    if (status === 401 || status === 403) return 'high';
    if (status === 404) return 'medium';
    return 'low';
  }

  /**
   * Get performance severity based on response time
   */
  private getPerformanceSeverity(time: number): IssueSeverity {
    if (time > 10000) return 'critical';  // >10s
    if (time > 5000) return 'high';       // >5s
    if (time > 3000) return 'medium';     // >3s
    return 'low';
  }

  /**
   * Get size severity based on payload size
   */
  private getSizeSeverity(size: number): IssueSeverity {
    const mb = size / (1024 * 1024);
    if (mb > 10) return 'critical';  // >10MB
    if (mb > 5) return 'high';       // >5MB
    if (mb > 2) return 'medium';     // >2MB
    return 'low';
  }

  /**
   * Save analysis results to file
   */
  async saveResults(summary: AnalysisSummary, outputPath: string): Promise<void> {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2), 'utf-8');
  }

  /**
   * Find all HAR files in a directory
   */
  static findHARFiles(directory: string): string[] {
    if (!fs.existsSync(directory)) {
      return [];
    }

    const files: string[] = [];
    const entries = fs.readdirSync(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...this.findHARFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.har')) {
        files.push(fullPath);
      }
    }

    return files;
  }
}
