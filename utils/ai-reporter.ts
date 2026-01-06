/**
 * AI Reporter Utility
 * Generates AI-powered analysis reports using OpenRouter API
 */

import * as fs from 'fs';
import * as path from 'path';
import type { AnalysisSummary } from '../types/anomaly.types';

export interface AIReporterConfig {
  apiKey: string;
  model: string;
  language: string;
  baseURL?: string;
}

export class AIReporter {
  private config: AIReporterConfig;

  constructor(config: AIReporterConfig) {
    if (!config.apiKey) {
      throw new Error('Groq API key is required');
    }
    
    this.config = {
      ...config,
      baseURL: config.baseURL || 'https://api.groq.com/openai/v1/chat/completions',
    };
  }

  /**
   * Generate AI report from analysis summary
   */
  async generateReport(summary: AnalysisSummary): Promise<string> {
    const prompt = this.buildPrompt(summary);

    try {
      const response = await fetch(this.config.baseURL!, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response from OpenRouter API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to generate AI report: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Build the prompt for AI analysis
   */
  private buildPrompt(summary: AnalysisSummary): string {
    const languageInstructions = this.getLanguageInstructions();

    return `
Generate a detailed HAR analysis report in the following format:

📊 ${languageInstructions.title}

${languageInstructions.totalRequests}: ${summary.totalAnomalies} ${languageInstructions.anomaliesFound}.

${summary.anomalies.length > 0 ? `
[For each anomaly, format like this:]
[Number]. URL: [URL]
   - Status: [Status Code if error]
   - [Any performance issues with times]
   - [Any size issues with sizes]
   - ${languageInstructions.impact}: [Impact description]
   - ${languageInstructions.recommendation}: [Specific recommendation]
` : ''}

✅ ${languageInstructions.summary}
[Summary of issues found by category]

💡 ${languageInstructions.generalSuggestions}:
[3-4 key recommendations]

Here are the anomalies to analyze:
${JSON.stringify(summary, null, 2)}

Please generate a report in ${this.config.language} following this format exactly.
`;
  }

  /**
   * Get language-specific instructions
   */
  private getLanguageInstructions(): Record<string, string> {
    const templates: Record<string, Record<string, string>> = {
      id: {
        title: 'Laporan Hasil Analisis HAR',
        totalRequests: 'Total permintaan yang dianalisis',
        anomaliesFound: 'anomali ditemukan',
        impact: 'Dampak',
        recommendation: 'Rekomendasi',
        summary: 'Ringkasan',
        generalSuggestions: 'Saran umum',
      },
      en: {
        title: 'HAR Analysis Report',
        totalRequests: 'Total requests analyzed',
        anomaliesFound: 'anomalies found',
        impact: 'Impact',
        recommendation: 'Recommendation',
        summary: 'Summary',
        generalSuggestions: 'General suggestions',
      },
    };

    return templates[this.config.language] || templates['en'];
  }

  /**
   * Save AI report to file
   */
  async saveReport(report: string, outputPath: string): Promise<void> {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, report, 'utf-8');
  }

  /**
   * Generate and save report in one step
   */
  async generateAndSave(summary: AnalysisSummary, outputPath: string): Promise<string> {
    const report = await this.generateReport(summary);
    await this.saveReport(report, outputPath);
    return report;
  }

  /**
   * Check if AI reporting is available (API key configured)
   */
  static isAvailable(): boolean {
    return !!process.env.GROQ_API_KEY;
  }

  /**
   * Create an AI reporter instance from environment
   */
  static fromEnv(language: string = 'id', model: string = 'llama-3.3-70b-versatile'): AIReporter | null {
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return null;
    }

    return new AIReporter({
      apiKey,
      model,
      language,
    });
  }
}
