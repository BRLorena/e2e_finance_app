/**
 * HAR Analysis Reporter for Playwright
 * Automatically analyzes HAR files after test execution and generates reports
 */

import 'dotenv/config';
import type { 
  Reporter, 
  FullConfig, 
  Suite, 
  TestCase, 
  TestResult, 
  FullResult 
} from '@playwright/test/reporter';
import * as path from 'path';
import * as fs from 'fs';
import { HARAnalyzer } from '../utils/har-analyzer';
import { AIReporter } from '../utils/ai-reporter';
import type { HARAnalysisConfig, AnalysisSummary } from '../types/anomaly.types';

/**
 * Custom Playwright reporter for HAR analysis
 */
export class HARAnalysisReporter implements Reporter {
  private config: HARAnalysisConfig;
  private analyzer: HARAnalyzer;
  private aiReporter: AIReporter | null = null;
  private summaries: AnalysisSummary[] = [];

  constructor(options: Partial<HARAnalysisConfig> = {}) {
    // Default configuration
    this.config = {
      enabled: options.enabled ?? true,
      thresholds: {
        responseTime: options.thresholds?.responseTime ?? 2000,
        payloadSize: options.thresholds?.payloadSize ?? 1_000_000,
      },
      aiReport: {
        enabled: options.aiReport?.enabled ?? true,
        model: options.aiReport?.model ?? 'google/gemma-3n-e2b-it:free',
        language: options.aiReport?.language ?? 'id',
      },
      outputDir: options.outputDir ?? './reports',
      failOn: options.failOn,
    };

    this.analyzer = new HARAnalyzer(this.config.thresholds);

    // Initialize AI reporter if enabled and API key is available
    if (this.config.aiReport.enabled) {
      this.aiReporter = AIReporter.fromEnv(
        this.config.aiReport.language,
        this.config.aiReport.model
      );

      if (!this.aiReporter) {
        console.log('⚠️  AI reporting is enabled but GROQ_API_KEY is not set');
      }
    }
  }

  onBegin(config: FullConfig, suite: Suite): void {
    if (!this.config.enabled) return;
    
    console.log('🔍 HAR Analysis Reporter initialized');
    console.log(`   Response time threshold: ${this.config.thresholds.responseTime}ms`);
    console.log(`   Payload size threshold: ${(this.config.thresholds.payloadSize / (1024 * 1024)).toFixed(2)}MB`);
    console.log(`   AI reporting: ${this.aiReporter ? '✓ enabled' : '✗ disabled'}`);
  }

  async onEnd(result: FullResult): Promise<void> {
    if (!this.config.enabled) return;

    console.log('\n📊 Analyzing HAR files...');

    // Find all HAR files in the output directory
    const harFiles = HARAnalyzer.findHARFiles(this.config.outputDir);

    if (harFiles.length === 0) {
      console.log('ℹ️  No HAR files found for analysis');
      return;
    }

    console.log(`   Found ${harFiles.length} HAR file(s)`);

    // Analyze each HAR file
    for (const harFile of harFiles) {
      try {
        const testFile = this.extractTestName(harFile);
        console.log(`   Analyzing: ${path.basename(harFile)}`);
        
        const summary = await this.analyzer.analyzeFile(harFile, testFile);
        this.summaries.push(summary);

        // Save individual analysis
        const analysisFile = harFile.replace('.har', '-analysis.json');
        await this.analyzer.saveResults(summary, analysisFile);

        this.logSummary(summary);
      } catch (error) {
        console.error(`   ✗ Error analyzing ${harFile}:`, error);
      }
    }

    // Generate aggregate summary
    if (this.summaries.length > 0) {
      const aggregateSummary = this.aggregateSummaries(this.summaries);
      const aggregateFile = path.join(this.config.outputDir, 'aggregate-analysis.json');
      await this.analyzer.saveResults(aggregateSummary, aggregateFile);

      console.log('\n📈 Aggregate Analysis:');
      this.logSummary(aggregateSummary);

      // Generate AI report if available
      if (this.aiReporter) {
        await this.generateAIReport(aggregateSummary);
      }

      // Check failure thresholds
      this.checkFailureThresholds(aggregateSummary);
    }
  }

  /**
   * Log summary statistics to console
   */
  private logSummary(summary: AnalysisSummary): void {
    const { totalAnomalies, errorCount, slowResponseCount, largeSizeCount } = summary;

    if (totalAnomalies === 0) {
      console.log('   ✓ No anomalies detected');
      return;
    }

    console.log(`   Total anomalies: ${totalAnomalies}`);
    if (errorCount > 0) console.log(`   └─ HTTP errors: ${errorCount}`);
    if (slowResponseCount > 0) console.log(`   └─ Slow responses: ${slowResponseCount}`);
    if (largeSizeCount > 0) console.log(`   └─ Large payloads: ${largeSizeCount}`);
  }

  /**
   * Generate AI-powered report
   */
  private async generateAIReport(summary: AnalysisSummary): Promise<void> {
    if (!this.aiReporter) return;

    try {
      console.log('\n🤖 Generating AI report...');
      const reportFile = path.join(this.config.outputDir, 'ai-report.txt');
      await this.aiReporter.generateAndSave(summary, reportFile);
      console.log(`   ✓ AI report saved to: ${reportFile}`);
    } catch (error) {
      console.error('   ✗ Failed to generate AI report:', error);
    }
  }

  /**
   * Aggregate multiple summaries into one
   */
  private aggregateSummaries(summaries: AnalysisSummary[]): AnalysisSummary {
    const aggregate: AnalysisSummary = {
      totalAnomalies: 0,
      errorCount: 0,
      slowResponseCount: 0,
      largeSizeCount: 0,
      anomalies: [],
      timestamp: new Date().toISOString(),
    };

    for (const summary of summaries) {
      aggregate.totalAnomalies += summary.totalAnomalies;
      aggregate.errorCount += summary.errorCount;
      aggregate.slowResponseCount += summary.slowResponseCount;
      aggregate.largeSizeCount += summary.largeSizeCount;
      aggregate.anomalies.push(...summary.anomalies);
    }

    return aggregate;
  }

  /**
   * Extract test name from HAR file path
   */
  private extractTestName(harFilePath: string): string {
    const basename = path.basename(harFilePath, '.har');
    return basename.replace(/-/g, ' ');
  }

  /**
   * Check if test should fail based on thresholds
   */
  private checkFailureThresholds(summary: AnalysisSummary): void {
    if (!this.config.failOn) return;

    const failures: string[] = [];

    if (this.config.failOn.errorCount !== undefined && summary.errorCount > this.config.failOn.errorCount) {
      failures.push(`Error count (${summary.errorCount}) exceeds threshold (${this.config.failOn.errorCount})`);
    }

    if (this.config.failOn.slowResponseCount !== undefined && summary.slowResponseCount > this.config.failOn.slowResponseCount) {
      failures.push(`Slow response count (${summary.slowResponseCount}) exceeds threshold (${this.config.failOn.slowResponseCount})`);
    }

    if (this.config.failOn.criticalErrors) {
      const criticalErrors = summary.anomalies.filter(a => a.status >= 500);
      if (criticalErrors.length > 0) {
        failures.push(`Critical errors detected (${criticalErrors.length} 5xx errors)`);
      }
    }

    if (failures.length > 0) {
      console.error('\n❌ HAR Analysis Failure Threshold Exceeded:');
      failures.forEach(f => console.error(`   - ${f}`));
      throw new Error('HAR analysis failed: ' + failures.join('; '));
    }
  }
}

export default HARAnalysisReporter;
