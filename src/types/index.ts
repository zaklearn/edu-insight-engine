
export interface Student {
  id: string;
  name: string;
  grade: string;
  age: number;
  gender: 'M' | 'F';
}

export interface EGRAMetrics {
  letterIdentification: number; // clpm - correct letters per minute
  phonemeAwareness: number; // percent correct
  readingFluency: number; // cwpm - correct words per minute
  readingComprehension: number; // percent correct
}

export interface EGMAMetrics {
  numberIdentification: number; // correct numbers per minute
  quantityDiscrimination: number; // percent correct
  missingNumber: number; // percent correct
  addition: number; // percent correct
  subtraction: number; // percent correct
}

export interface AssessmentData {
  student: Student;
  date: string;
  egra: EGRAMetrics;
  egma: EGMAMetrics;
}

export interface ThresholdConfig {
  mastery: number;
  developing: number;
  emerging: number;
}

export interface InterpretationThresholds {
  letterIdentification: ThresholdConfig;
  phonemeAwareness: ThresholdConfig;
  readingFluency: ThresholdConfig;
  readingComprehension: ThresholdConfig;
  numberIdentification: ThresholdConfig;
  quantityDiscrimination: ThresholdConfig;
  missingNumber: ThresholdConfig;
  addition: ThresholdConfig;
  subtraction: ThresholdConfig;
}

export interface SkillLevel {
  level: 'mastery' | 'developing' | 'emerging';
  message: string;
}

export interface RuleBasedInterpretation {
  letterIdentification: SkillLevel;
  phonemeAwareness: SkillLevel;
  readingFluency: SkillLevel;
  readingComprehension: SkillLevel;
  numberIdentification: SkillLevel;
  quantityDiscrimination: SkillLevel;
  missingNumber: SkillLevel;
  addition: SkillLevel;
  subtraction: SkillLevel;
  summary: {
    reading: string;
    mathematics: string;
  };
}

export interface FullInterpretation {
  ruleBasedInterpretation: RuleBasedInterpretation;
  generatedInterpretation: string | null;
}

export const DEFAULT_THRESHOLDS: InterpretationThresholds = {
  letterIdentification: { mastery: 50, developing: 30, emerging: 0 },
  phonemeAwareness: { mastery: 80, developing: 60, emerging: 0 },
  readingFluency: { mastery: 45, developing: 25, emerging: 0 },
  readingComprehension: { mastery: 80, developing: 60, emerging: 0 },
  numberIdentification: { mastery: 40, developing: 20, emerging: 0 },
  quantityDiscrimination: { mastery: 80, developing: 60, emerging: 0 },
  missingNumber: { mastery: 80, developing: 60, emerging: 0 },
  addition: { mastery: 80, developing: 60, emerging: 0 },
  subtraction: { mastery: 80, developing: 60, emerging: 0 },
};

export type Language = 'fr' | 'en';
