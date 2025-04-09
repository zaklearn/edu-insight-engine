
import { 
  AssessmentData, 
  InterpretationThresholds, 
  RuleBasedInterpretation, 
  sampleThresholds,
  SkillLevel
} from "@/types";

export function getSkillLevel(value: number, thresholds: { mastery: number; developing: number; emerging: number }): 'mastery' | 'developing' | 'emerging' {
  if (value >= thresholds.mastery) {
    return 'mastery';
  } else if (value >= thresholds.developing) {
    return 'developing';
  } else {
    return 'emerging';
  }
}

export function getSkillMessage(
  metric: string, 
  level: 'mastery' | 'developing' | 'emerging', 
  value: number
): string {
  const messages = {
    letterIdentification: {
      mastery: `Excellente identification des lettres (${value} lettres par minute). L'élève a une maîtrise solide de la reconnaissance alphabétique.`,
      developing: `Identification des lettres en développement (${value} lettres par minute). L'élève progresse mais nécessite plus de pratique.`,
      emerging: `Identification des lettres émergente (${value} lettres par minute). L'élève a besoin d'un soutien intensif en reconnaissance alphabétique.`
    },
    phonemeAwareness: {
      mastery: `Excellente conscience phonémique (${value}%). L'élève distingue bien les sons de la langue.`,
      developing: `Conscience phonémique en développement (${value}%). L'élève progresse mais nécessite plus d'exercices de discrimination auditive.`,
      emerging: `Conscience phonémique émergente (${value}%). L'élève a besoin d'activités ciblées sur la reconnaissance des sons.`
    },
    readingFluency: {
      mastery: `Excellente fluidité de lecture (${value} mots corrects par minute). L'élève lit avec aisance.`,
      developing: `Fluidité de lecture en développement (${value} mots corrects par minute). L'élève progresse mais a besoin de pratique additionnelle.`,
      emerging: `Fluidité de lecture émergente (${value} mots corrects par minute). L'élève nécessite un soutien intensif en lecture.`
    },
    readingComprehension: {
      mastery: `Excellente compréhension en lecture (${value}%). L'élève comprend bien ce qu'il lit.`,
      developing: `Compréhension en lecture en développement (${value}%). L'élève saisit certains éléments mais nécessite plus de pratique.`,
      emerging: `Compréhension en lecture émergente (${value}%). L'élève a besoin d'activités ciblées sur la compréhension de textes.`
    },
    numberIdentification: {
      mastery: `Excellente identification des nombres (${value} nombres par minute). L'élève reconnaît bien les nombres.`,
      developing: `Identification des nombres en développement (${value} nombres par minute). L'élève progresse mais a besoin de plus de pratique.`,
      emerging: `Identification des nombres émergente (${value} nombres par minute). L'élève nécessite un soutien particulier en reconnaissance numérique.`
    },
    quantityDiscrimination: {
      mastery: `Excellente discrimination des quantités (${value}%). L'élève compare bien les nombres.`,
      developing: `Discrimination des quantités en développement (${value}%). L'élève progresse mais a besoin de plus d'exercices de comparaison.`,
      emerging: `Discrimination des quantités émergente (${value}%). L'élève nécessite un soutien pour comprendre les relations entre les nombres.`
    },
    missingNumber: {
      mastery: `Excellente identification des nombres manquants (${value}%). L'élève comprend bien les séquences numériques.`,
      developing: `Identification des nombres manquants en développement (${value}%). L'élève progresse mais a besoin de plus d'exercices sur les suites.`,
      emerging: `Identification des nombres manquants émergente (${value}%). L'élève nécessite un soutien pour comprendre les patterns numériques.`
    },
    addition: {
      mastery: `Excellente maîtrise de l'addition (${value}%). L'élève calcule avec précision.`,
      developing: `Maîtrise de l'addition en développement (${value}%). L'élève progresse mais a besoin de plus d'exercices.`,
      emerging: `Maîtrise de l'addition émergente (${value}%). L'élève nécessite un soutien particulier en calcul additif.`
    },
    subtraction: {
      mastery: `Excellente maîtrise de la soustraction (${value}%). L'élève soustrait avec précision.`,
      developing: `Maîtrise de la soustraction en développement (${value}%). L'élève progresse mais a besoin de plus d'exercices.`,
      emerging: `Maîtrise de la soustraction émergente (${value}%). L'élève nécessite un soutien particulier en calcul soustractif.`
    }
  };

  return messages[metric as keyof typeof messages][level];
}

export function generateRuleBasedInterpretation(
  assessment: AssessmentData,
  thresholds: InterpretationThresholds = sampleThresholds
): RuleBasedInterpretation {
  const { egra, egma } = assessment;
  
  // Process each metric
  const letterIdentificationLevel = getSkillLevel(egra.letterIdentification, thresholds.letterIdentification);
  const phonemeAwarenessLevel = getSkillLevel(egra.phonemeAwareness, thresholds.phonemeAwareness);
  const readingFluencyLevel = getSkillLevel(egra.readingFluency, thresholds.readingFluency);
  const readingComprehensionLevel = getSkillLevel(egra.readingComprehension, thresholds.readingComprehension);
  
  const numberIdentificationLevel = getSkillLevel(egma.numberIdentification, thresholds.numberIdentification);
  const quantityDiscriminationLevel = getSkillLevel(egma.quantityDiscrimination, thresholds.quantityDiscrimination);
  const missingNumberLevel = getSkillLevel(egma.missingNumber, thresholds.missingNumber);
  const additionLevel = getSkillLevel(egma.addition, thresholds.addition);
  const subtractionLevel = getSkillLevel(egma.subtraction, thresholds.subtraction);
  
  // Create skill level objects with messages
  const letterIdentification: SkillLevel = {
    level: letterIdentificationLevel,
    message: getSkillMessage('letterIdentification', letterIdentificationLevel, egra.letterIdentification)
  };
  
  const phonemeAwareness: SkillLevel = {
    level: phonemeAwarenessLevel,
    message: getSkillMessage('phonemeAwareness', phonemeAwarenessLevel, egra.phonemeAwareness)
  };
  
  const readingFluency: SkillLevel = {
    level: readingFluencyLevel,
    message: getSkillMessage('readingFluency', readingFluencyLevel, egra.readingFluency)
  };
  
  const readingComprehension: SkillLevel = {
    level: readingComprehensionLevel,
    message: getSkillMessage('readingComprehension', readingComprehensionLevel, egra.readingComprehension)
  };
  
  const numberIdentification: SkillLevel = {
    level: numberIdentificationLevel,
    message: getSkillMessage('numberIdentification', numberIdentificationLevel, egma.numberIdentification)
  };
  
  const quantityDiscrimination: SkillLevel = {
    level: quantityDiscriminationLevel,
    message: getSkillMessage('quantityDiscrimination', quantityDiscriminationLevel, egma.quantityDiscrimination)
  };
  
  const missingNumber: SkillLevel = {
    level: missingNumberLevel,
    message: getSkillMessage('missingNumber', missingNumberLevel, egma.missingNumber)
  };
  
  const addition: SkillLevel = {
    level: additionLevel,
    message: getSkillMessage('addition', additionLevel, egma.addition)
  };
  
  const subtraction: SkillLevel = {
    level: subtractionLevel,
    message: getSkillMessage('subtraction', subtractionLevel, egma.subtraction)
  };
  
  // Generate summary messages
  const readingLevels = [letterIdentificationLevel, phonemeAwarenessLevel, readingFluencyLevel, readingComprehensionLevel];
  const mathLevels = [numberIdentificationLevel, quantityDiscriminationLevel, missingNumberLevel, additionLevel, subtractionLevel];
  
  const getOverallLevel = (levels: ('mastery' | 'developing' | 'emerging')[]) => {
    const counts = {
      mastery: levels.filter(l => l === 'mastery').length,
      developing: levels.filter(l => l === 'developing').length,
      emerging: levels.filter(l => l === 'emerging').length
    };
    
    if (counts.mastery >= levels.length / 2) return 'mastery';
    if (counts.emerging >= levels.length / 2) return 'emerging';
    return 'developing';
  };
  
  const readingOverall = getOverallLevel(readingLevels);
  const mathOverall = getOverallLevel(mathLevels);
  
  const readingSummary = {
    mastery: `L'élève démontre une excellente maîtrise des compétences en lecture. Il/Elle lit avec fluidité et comprend bien les textes. Continuez à encourager la lecture régulière et à introduire des textes plus complexes.`,
    developing: `L'élève est en bonne progression dans l'acquisition des compétences en lecture. Il/Elle a besoin de pratique additionnelle pour renforcer sa fluidité et sa compréhension. Recommandations: exercices quotidiens de lecture, jeux phonologiques.`,
    emerging: `L'élève est aux premiers stades du développement de la lecture. Un soutien intensif est nécessaire pour développer ses compétences fondamentales. Recommandations: activités structurées d'identification des lettres et des sons, lecture guidée quotidienne.`
  }[readingOverall];
  
  const mathSummary = {
    mastery: `L'élève démontre une excellente maîtrise des compétences mathématiques évaluées. Il/Elle a une bonne compréhension des nombres et des opérations. Continuez à introduire des concepts plus avancés et des problèmes variés.`,
    developing: `L'élève progresse dans l'acquisition des compétences mathématiques. Il/Elle a besoin de pratique additionnelle pour renforcer sa compréhension des nombres et opérations. Recommandations: jeux mathématiques, exercices quotidiens.`,
    emerging: `L'élève est aux premiers stades du développement des compétences mathématiques. Un soutien intensif est nécessaire. Recommandations: activités concrètes avec manipulations, jeux de nombres, pratique quotidienne des concepts de base.`
  }[mathOverall];
  
  return {
    letterIdentification,
    phonemeAwareness,
    readingFluency,
    readingComprehension,
    numberIdentification,
    quantityDiscrimination,
    missingNumber,
    addition,
    subtraction,
    summary: {
      reading: readingSummary,
      mathematics: mathSummary
    }
  };
}

export function createLLMPrompt(assessment: AssessmentData, ruleBasedInterpretation: RuleBasedInterpretation): string {
  const { student, egra, egma } = assessment;
  
  return `
Voici les résultats détaillés d'une évaluation EGRA/EGMA pour un élève:

Informations sur l'élève:
- Nom: ${student.name}
- Niveau: ${student.grade}
- Âge: ${student.age} ans

Résultats EGRA (Early Grade Reading Assessment):
- Lettres par minute (clpm): ${egra.letterIdentification}
- Conscience phonémique (%): ${egra.phonemeAwareness}
- Mots corrects par minute (cwpm): ${egra.readingFluency}
- Compréhension écrite (%): ${egra.readingComprehension}

Résultats EGMA (Early Grade Mathematics Assessment):
- Identification des nombres (par minute): ${egma.numberIdentification}
- Discrimination des quantités (%): ${egma.quantityDiscrimination}
- Nombres manquants (%): ${egma.missingNumber}
- Addition (%): ${egma.addition}
- Soustraction (%): ${egma.subtraction}

Messages du système à base de règles:

Lecture:
- ${ruleBasedInterpretation.letterIdentification.message}
- ${ruleBasedInterpretation.phonemeAwareness.message}
- ${ruleBasedInterpretation.readingFluency.message}
- ${ruleBasedInterpretation.readingComprehension.message}
- Synthèse lecture: ${ruleBasedInterpretation.summary.reading}

Mathématiques:
- ${ruleBasedInterpretation.numberIdentification.message}
- ${ruleBasedInterpretation.quantityDiscrimination.message}
- ${ruleBasedInterpretation.missingNumber.message}
- ${ruleBasedInterpretation.addition.message}
- ${ruleBasedInterpretation.subtraction.message}
- Synthèse mathématiques: ${ruleBasedInterpretation.summary.mathematics}

Fournis une interprétation globale détaillée en français, en expliquant l'importance de ces indicateurs et en proposant des recommandations précises et personnalisées pour améliorer les compétences en lecture et en mathématiques de cet élève. Adapte ton analyse au niveau scolaire et à l'âge de l'élève.
`;
}

// Placeholder for LLM integration
export async function generateLLMInterpretation(prompt: string): Promise<string> {
  // In a real implementation, this would call the local LLM
  console.log("Generating interpretation with prompt:", prompt);
  
  // Since we don't have a real LLM integration yet, return a placeholder response
  return `
## Interprétation détaillée des résultats EGRA/EGMA

### Analyse globale
L'évaluation révèle un profil d'apprentissage mixte avec des forces en compréhension écrite et en opérations mathématiques, mais des défis en fluidité de lecture et en identification des nombres. Ces résultats suggèrent un élève qui a développé de bonnes stratégies de compréhension mais qui pourrait bénéficier d'un renforcement des compétences techniques fondamentales.

### Lecture (EGRA)
Les résultats en lecture montrent un développement progressif mais inégal. La conscience phonémique est en bonne voie, ce qui est crucial pour la décodification des mots. Cependant, la vitesse d'identification des lettres et la fluidité de lecture nécessitent une attention particulière, car elles forment la base d'une lecture autonome efficace.

#### Recommandations spécifiques pour la lecture:
- Pratiquer la reconnaissance rapide des lettres avec des jeux de cartes-éclair (5 minutes quotidiennes)
- Mettre en place des séances courtes de lecture chronométrée de textes simples et répétitifs
- Utiliser la méthode de lecture en tandem (l'adulte et l'enfant lisent ensemble) pour modéliser le rythme et l'intonation
- Encourager la lecture à haute voix régulière avec suivi du doigt pour renforcer le lien entre l'écrit et l'oral

### Mathématiques (EGMA)
En mathématiques, l'élève montre une bonne compréhension conceptuelle avec d'excellents résultats en discrimination des quantités et en addition. La reconnaissance des nombres et la soustraction présentent des opportunités d'amélioration.

#### Recommandations spécifiques pour les mathématiques:
- Créer une routine quotidienne d'activités ludiques de comptage et de reconnaissance des nombres
- Utiliser des objets manipulables pour concrétiser les opérations de soustraction
- Intégrer des jeux de société impliquant des suites numériques (comme le jeu de l'oie)
- Pratiquer les faits numériques de base à travers des chansons et des rythmes

### Plan d'action proposé
1. **Court terme (2 semaines)**: 
   - Établir une routine de 15 minutes quotidiennes alternant entre activités de lecture et de mathématiques
   - Commencer un journal de progrès simple avec l'élève

2. **Moyen terme (1-2 mois)**:
   - Réévaluer la fluidité de lecture après 4 semaines de pratique intensive
   - Introduire des problèmes mathématiques contextualisés une fois les bases renforcées

3. **Long terme**:
   - Développer l'autonomie en lecture par l'exposition à des textes variés
   - Renforcer les liens entre lecture et mathématiques à travers des problèmes écrits

En conclusion, cet élève montre un potentiel certain mais nécessite un soutien ciblé dans des domaines spécifiques. Un suivi régulier et des activités adaptées permettront de consolider les acquis et de développer les compétences émergentes.
`;
}

export async function getFullInterpretation(assessment: AssessmentData) {
  const ruleBasedInterpretation = generateRuleBasedInterpretation(assessment);
  const prompt = createLLMPrompt(assessment, ruleBasedInterpretation);
  
  try {
    const generatedInterpretation = await generateLLMInterpretation(prompt);
    return {
      ruleBasedInterpretation,
      generatedInterpretation
    };
  } catch (error) {
    console.error("Error generating LLM interpretation:", error);
    return {
      ruleBasedInterpretation,
      generatedInterpretation: null
    };
  }
}
