
import { pipeline } from "@huggingface/transformers";

let model: any = null;
let isModelLoading = false;
let modelLoadError: Error | null = null;

export const supportedModels = [
  { id: "bigscience/bloom-560m", name: "BLOOM 560M", language: "multilingual", description: "Modèle léger multilingue" },
  { id: "asi/gpt-fr-cased-small", name: "GPT-FR Small", language: "french", description: "Petit modèle français" },
  { id: "Helsinki-NLP/opus-mt-en-fr", name: "OPUS MT En-Fr", language: "french", description: "Modèle de traduction anglais vers français" }
];

export const getModelStatus = () => {
  return {
    isLoaded: model !== null,
    isLoading: isModelLoading,
    error: modelLoadError
  };
};

export const loadModel = async (modelId: string = "bigscience/bloom-560m") => {
  if (model !== null) {
    console.log("Model already loaded");
    return model;
  }
  
  if (isModelLoading) {
    console.log("Model is already loading");
    return null;
  }
  
  try {
    isModelLoading = true;
    modelLoadError = null;
    
    console.log(`Loading model: ${modelId}`);
    
    // In a real implementation, this would load the model from Hugging Face
    // For example: model = await pipeline('text-generation', modelId, { device: 'cpu' });
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a mock model for now
    model = {
      modelId,
      generate: async (prompt: string) => {
        console.log("Generating text with prompt:", prompt);
        return Promise.resolve([{
          generated_text: `
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
`
        }]);
      }
    };
    
    console.log("Model loaded successfully");
    isModelLoading = false;
    return model;
  } catch (error) {
    console.error("Error loading model:", error);
    modelLoadError = error as Error;
    isModelLoading = false;
    return null;
  }
};

export const unloadModel = () => {
  model = null;
  console.log("Model unloaded");
};

export const generateText = async (prompt: string, modelId?: string) => {
  try {
    const currentModel = model || await loadModel(modelId);
    
    if (!currentModel) {
      throw new Error("Model not available");
    }
    
    const result = await currentModel.generate(prompt);
    return result[0].generated_text;
  } catch (error) {
    console.error("Error generating text:", error);
    throw error;
  }
};

export const isWebGPUAvailable = () => {
  return navigator.gpu !== undefined;
};
