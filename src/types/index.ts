
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

// Sample data for testing
export const sampleThresholds: InterpretationThresholds = {
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

export const sampleStudents: Student[] = [
  { id: '001', name: 'Kofi Mensah', grade: 'CP1', age: 6, gender: 'M' },
  { id: '002', name: 'Ama Serwaa', grade: 'CP1', age: 7, gender: 'F' },
  { id: '003', name: 'Kwame Adu', grade: 'CP2', age: 7, gender: 'M' },
  { id: '004', name: 'Abena Poku', grade: 'CP2', age: 8, gender: 'F' },
];

export const sampleAssessments: AssessmentData[] = [
  {
    student: sampleStudents[0],
    date: '2023-10-15',
    egra: {
      letterIdentification: 35,
      phonemeAwareness: 65,
      readingFluency: 28,
      readingComprehension: 70,
    },
    egma: {
      numberIdentification: 30,
      quantityDiscrimination: 75,
      missingNumber: 60,
      addition: 80,
      subtraction: 65,
    },
  },
  {
    student: sampleStudents[1],
    date: '2023-10-15',
    egra: {
      letterIdentification: 25,
      phonemeAwareness: 55,
      readingFluency: 18,
      readingComprehension: 50,
    },
    egma: {
      numberIdentification: 25,
      quantityDiscrimination: 60,
      missingNumber: 50,
      addition: 65,
      subtraction: 45,
    },
  },
  {
    student: sampleStudents[2],
    date: '2023-10-16',
    egra: {
      letterIdentification: 55,
      phonemeAwareness: 85,
      readingFluency: 48,
      readingComprehension: 85,
    },
    egma: {
      numberIdentification: 45,
      quantityDiscrimination: 90,
      missingNumber: 85,
      addition: 95,
      subtraction: 85,
    },
  },
  {
    student: sampleStudents[3],
    date: '2023-10-16',
    egra: {
      letterIdentification: 40,
      phonemeAwareness: 75,
      readingFluency: 35,
      readingComprehension: 75,
    },
    egma: {
      numberIdentification: 35,
      quantityDiscrimination: 80,
      missingNumber: 70,
      addition: 85,
      subtraction: 70,
    },
  },
];
