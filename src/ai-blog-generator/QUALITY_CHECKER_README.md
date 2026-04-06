# Quality Checker - Documentation

## Overview

The Quality Checker is a comprehensive validation system for AI-generated blog articles. It ensures that all generated content meets quality standards before publication.

## Features

### 1. Content Validation (Requirements 4.1, 4.2)

- **Word Count Validation**: Ensures articles are between 800-2000 words
- **Structure Validation**: Checks for proper headings, introduction, and sections
- **Call to Action**: Validates presence of CTA when required
- **Internal Links**: Ensures articles include internal links when required

### 2. SEO Validation (Requirements 5.1, 5.2)

- **Meta Title**: Validates length (≤60 characters, ≥30 recommended)
- **Meta Description**: Validates length (150-160 characters)
- **Keywords**: Ensures presence of at least 3 keywords

### 3. Markdown Format Validation (Requirements 4.2)

- **Link Format**: Detects malformed Markdown links
- **Heading Format**: Validates proper heading syntax
- **Dangerous HTML**: Prevents injection of potentially harmful HTML

### 4. Quality Scoring System (Requirements 4.2, 4.4)

- **Base Score**: Starts at 100 points
- **Deductions**: Based on issue severity (high: -15, medium: -8, low: -3)
- **Bonuses**: For good practices (optimal word count, multiple links, etc.)
- **Range**: Final score is clamped between 0-100

## Usage

### Basic Usage

```typescript
import { QualityChecker, createDefaultQualityConfig } from './quality-checker';
import { GeneratedArticle } from './types';

// Create checker with default config
const config = createDefaultQualityConfig();
const checker = new QualityChecker(config);

// Check an article
const article: GeneratedArticle = {
  // ... article data
};

const result = await checker.checkArticle(article);

console.log('Passed:', result.passed);
console.log('Score:', result.score);
console.log('Issues:', result.issues);
console.log('Warnings:', result.warnings);
console.log('Suggestions:', result.suggestions);
```

### Custom Configuration

```typescript
import { QualityChecker } from './quality-checker';
import { QualityCheckConfig } from './types';

const customConfig: QualityCheckConfig = {
  minWordCount: 1000,
  maxWordCount: 2500,
  requireCallToAction: true,
  requireInternalLinks: true,
  minReadabilityScore: 75,
  checkPlagiarism: false,
  checkFactualAccuracy: false,
};

const checker = new QualityChecker(customConfig);
```

## Quality Check Result

The `checkArticle` method returns a `QualityCheckResult` object:

```typescript
interface QualityCheckResult {
  passed: boolean;        // Overall pass/fail status
  score: number;          // Quality score (0-100)
  issues: QualityIssue[]; // List of quality issues found
  warnings: string[];     // Non-critical warnings
  suggestions: string[];  // Improvement suggestions
}
```

## Quality Issues

Issues are categorized by type and severity:

### Issue Types
- `plagiarism`: Detected plagiarized content
- `factual_error`: Factual inaccuracies
- `poor_structure`: Structural problems
- `seo_issue`: SEO metadata problems
- `tone_mismatch`: Tone inconsistencies

### Severity Levels
- `high`: Critical issues that should prevent publication (-15 points)
- `medium`: Important issues that need attention (-8 points)
- `low`: Minor issues that can be improved (-3 points)

## Scoring System

### Deductions

| Severity | Points Deducted |
|----------|----------------|
| High     | -15            |
| Medium   | -8             |
| Low      | -3             |

### Bonuses

| Good Practice | Points Added |
|--------------|-------------|
| Optimal word count (1200-1800) | +5 |
| 3+ internal links | +5 |
| 3-7 tags | +3 |
| Good call to action (>20 chars) | +2 |

## Validation Rules

### Content Length
- **Minimum**: 800 words (high severity if below)
- **Maximum**: 2000 words (medium severity if above)
- **Optimal**: 1200-1800 words (bonus points)

### Structure
- Must have headings (H1-H3)
- Introduction should be ≥100 characters
- Call to action required (if configured)
- Internal links required (if configured)

### SEO Metadata
- **Meta Title**: 30-60 characters
- **Meta Description**: 150-160 characters
- **Keywords**: At least 3 recommended

### Markdown Format
- Links must be properly formatted: `[text](url)`
- Headings must have space after `#`: `# Heading`
- No dangerous HTML tags (`<script>`, `<iframe>`, etc.)

## Testing

Run the test script to see the Quality Checker in action:

```bash
npx tsx src/ai-blog-generator/scripts/test-quality-checker.ts
```

This will run three test cases:
1. High quality article
2. Low quality article with multiple issues
3. Article with SEO issues

## Integration with Publishing Pipeline

The Quality Checker is designed to be used in the publishing pipeline:

```typescript
// In the publishing workflow
const qualityResult = await checker.checkArticle(generatedArticle);

if (!qualityResult.passed) {
  // Save as draft for manual review
  await publisher.saveDraft(generatedArticle, topic);
  
  // Notify admin about issues
  console.log('Quality check failed:', qualityResult.issues);
} else {
  // Proceed with publication
  await publisher.publishArticle(generatedArticle, topic, config);
}
```

## Future Enhancements

The following features are planned for future implementation:

1. **Plagiarism Detection**: Integration with external plagiarism detection APIs
2. **Readability Scoring**: Implementation of Flesch-Kincaid or similar readability metrics
3. **Factual Accuracy**: AI-powered fact checking
4. **Tone Analysis**: Ensure consistent brand voice
5. **Image Validation**: Check for proper image alt text and optimization

## Requirements Validation

This implementation validates the following requirements:

- ✅ **Requirement 4.1**: Content length validation (800+ words)
- ✅ **Requirement 4.2**: Structure and format validation
- ✅ **Requirement 4.4**: Quality scoring system
- ✅ **Requirement 5.1**: SEO meta title validation
- ✅ **Requirement 5.2**: SEO meta description validation

## API Reference

### QualityChecker Class

#### Constructor
```typescript
constructor(config: QualityCheckConfig)
```

#### Methods

##### checkArticle
```typescript
async checkArticle(article: GeneratedArticle): Promise<QualityCheckResult>
```
Main method to perform comprehensive quality check on an article.

##### checkPlagiarism
```typescript
async checkPlagiarism(content: string): Promise<boolean>
```
Check for plagiarism (placeholder for future implementation).

##### checkReadability
```typescript
async checkReadability(content: string): Promise<number>
```
Calculate readability score (placeholder for future implementation).

##### checkStructure
```typescript
async checkStructure(content: string): Promise<QualityIssue[]>
```
Check article structure and return issues found.

### Helper Functions

#### createDefaultQualityConfig
```typescript
function createDefaultQualityConfig(): QualityCheckConfig
```
Creates a default quality checker configuration with recommended settings.

## Examples

### Example 1: Basic Quality Check

```typescript
const checker = new QualityChecker(createDefaultQualityConfig());
const result = await checker.checkArticle(article);

if (result.passed) {
  console.log('✅ Article passed quality check!');
} else {
  console.log('❌ Quality check failed');
  result.issues.forEach(issue => {
    console.log(`[${issue.severity}] ${issue.description}`);
  });
}
```

### Example 2: Custom Thresholds

```typescript
const strictConfig: QualityCheckConfig = {
  minWordCount: 1200,
  maxWordCount: 1800,
  requireCallToAction: true,
  requireInternalLinks: true,
  minReadabilityScore: 80,
  checkPlagiarism: true,
  checkFactualAccuracy: true,
};

const checker = new QualityChecker(strictConfig);
```

### Example 3: Handling Results

```typescript
const result = await checker.checkArticle(article);

// Log all issues by severity
const highSeverity = result.issues.filter(i => i.severity === 'high');
const mediumSeverity = result.issues.filter(i => i.severity === 'medium');
const lowSeverity = result.issues.filter(i => i.severity === 'low');

console.log(`High severity issues: ${highSeverity.length}`);
console.log(`Medium severity issues: ${mediumSeverity.length}`);
console.log(`Low severity issues: ${lowSeverity.length}`);

// Show suggestions for improvement
if (result.suggestions.length > 0) {
  console.log('\nSuggestions:');
  result.suggestions.forEach(s => console.log(`💡 ${s}`));
}
```
