
import { createContext, useContext, useState, ReactNode } from "react";
import { Language } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, Record<Language, string>>;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "dashboard": { fr: "Tableau de Bord", en: "Dashboard" },
  "students": { fr: "Élèves", en: "Students" },
  "assessment": { fr: "Évaluation", en: "Assessment" },
  "assessments": { fr: "Évaluations", en: "Assessments" },
  "reports": { fr: "Rapports", en: "Reports" },
  "dataUpload": { fr: "Importation de Données", en: "Data Upload" },
  
  // Common
  "noDataAvailable": { fr: "Aucune donnée disponible", en: "No data available" },
  "importData": { fr: "Importer des données", en: "Import data" },
  "class": { fr: "Classe", en: "Class" },
  "allClasses": { fr: "Toutes les classes", en: "All classes" },
  "exportData": { fr: "Exporter les données", en: "Export data" },
  "name": { fr: "Nom", en: "Name" },
  "grade": { fr: "Classe", en: "Grade" },
  "age": { fr: "Âge", en: "Age" },
  "gender": { fr: "Genre", en: "Gender" },
  "actions": { fr: "Actions", en: "Actions" },
  "boy": { fr: "Garçon", en: "Boy" },
  "girl": { fr: "Fille", en: "Girl" },
  "id": { fr: "ID", en: "ID" },
  "years": { fr: "ans", en: "years" },
  "search": { fr: "Rechercher", en: "Search" },
  "searchStudent": { fr: "Rechercher un élève...", en: "Search for a student..." },
  "addStudent": { fr: "Ajouter un élève", en: "Add student" },
  "showing": { fr: "Affichage de", en: "Showing" },
  "studentsOf": { fr: "élèves sur", en: "students of" },
  "previous": { fr: "Précédent", en: "Previous" },
  "next": { fr: "Suivant", en: "Next" },
  
  // Dashboard
  "performanceOverview": { fr: "Vue d'ensemble des performances EGRA/EGMA", en: "EGRA/EGMA Performance Overview" },
  "egraPerformance": { fr: "Performances EGRA", en: "EGRA Performance" },
  "egmaPerformance": { fr: "Performances EGMA", en: "EGMA Performance" },
  "globalAverage": { fr: "Moyenne globale", en: "Global average" },
  "students": { fr: "Élèves", en: "Students" },
  "totalStudents": { fr: "Nombre total d'élèves", en: "Total number of students" },
  "studentsIn": { fr: "Élèves en", en: "Students in" },
  "performanceByClass": { fr: "Performance par classe", en: "Performance by class" },
  "studentDistribution": { fr: "Distribution des élèves", en: "Student distribution" },
  "egraEgmaComparison": { fr: "Comparaison EGRA/EGMA par classe", en: "EGRA/EGMA Comparison by class" },
  "studentsPerClass": { fr: "Nombre d'élèves par classe", en: "Number of students per class" },
  "watchList": { fr: "À Surveiller", en: "Watch List" },
  "needsAttention": { fr: "Nécessite un suivi personnalisé", en: "Needs personalized follow-up" },
  "viewFullAssessment": { fr: "Voir l'évaluation complète", en: "View full assessment" },
  "noStudentsNeedingAttention": { fr: "Aucun élève nécessitant une attention particulière", en: "No students requiring special attention" },
  "recommendedActions": { fr: "Actions Recommandées", en: "Recommended Actions" },
  "readingWorkshop": { fr: "Atelier de Lecture", en: "Reading Workshop" },
  "readingWorkshopDesc": { fr: "Organisez un atelier concentré sur la fluidité de lecture pour les classes CP1 et CP2.", en: "Organize a workshop focused on reading fluency for CP1 and CP2 classes." },
  "plan": { fr: "Planifier", en: "Plan" },
  "mathResources": { fr: "Ressources Mathématiques", en: "Math Resources" },
  "mathResourcesDesc": { fr: "Procurez-vous du matériel manipulatif supplémentaire pour les exercices de calcul.", en: "Get additional manipulative materials for calculation exercises." },
  "explore": { fr: "Explorer", en: "Explore" },
  "teacherTraining": { fr: "Formation Enseignants", en: "Teacher Training" },
  "teacherTrainingDesc": { fr: "Formation sur l'interprétation des résultats EGRA/EGMA et les interventions ciblées.", en: "Training on interpreting EGRA/EGMA results and targeted interventions." },
  "learnMore": { fr: "En savoir plus", en: "Learn more" },
  
  // Assessment
  "selectAssessment": { fr: "Sélectionner une évaluation", en: "Select an assessment" },
  "chooseAssessment": { fr: "Choisir une évaluation", en: "Choose an assessment" },
  "noAssessmentAvailable": { fr: "Aucune évaluation disponible. Veuillez importer des données.", en: "No assessment available. Please import data." },
  
  // Reports
  "averagePerformanceByClass": { fr: "Performance moyenne par classe", en: "Average performance by class" },
  "summary": { fr: "Résumé", en: "Summary" },
  "totalStudentsCount": { fr: "Nombre total d'élèves", en: "Total number of students" },
  "totalAssessmentsCount": { fr: "Nombre total d'évaluations", en: "Total number of assessments" },
  "classCount": { fr: "Nombre de classes", en: "Number of classes" },
  
  // Data Upload
  "uploadExcelFile": { fr: "Télécharger un fichier Excel", en: "Upload Excel file" },
  "excelFile": { fr: "Fichier Excel", en: "Excel file" },
  "dataPreview": { fr: "Aperçu des données", en: "Data preview" },
  "columnMappings": { fr: "Mappages des colonnes", en: "Column mappings" },
  "studentName": { fr: "Nom de l'élève", en: "Student name" },
  "level": { fr: "Niveau", en: "Level" },
  "selectColumn": { fr: "Sélectionner une colonne", en: "Select a column" },
  "reading": { fr: "EGRA - Lecture", en: "EGRA - Reading" },
  "letterIdentification": { fr: "Identification des lettres", en: "Letter identification" },
  "phonemeAwareness": { fr: "Conscience phonémique", en: "Phoneme awareness" },
  "readingFluency": { fr: "Fluidité de lecture", en: "Reading fluency" },
  "readingComprehension": { fr: "Compréhension de lecture", en: "Reading comprehension" },
  "notMapped": { fr: "Non mappé", en: "Not mapped" },
  "mathematics": { fr: "EGMA - Mathématiques", en: "EGMA - Mathematics" },
  "numberIdentification": { fr: "Identification des nombres", en: "Number identification" },
  "quantityDiscrimination": { fr: "Discrimination quantitative", en: "Quantity discrimination" },
  "missingNumber": { fr: "Nombre manquant", en: "Missing number" },
  "addition": { fr: "Addition", en: "Addition" },
  "subtraction": { fr: "Soustraction", en: "Subtraction" },
  "processData": { fr: "Traiter les données", en: "Process data" },
  "reset": { fr: "Réinitialiser", en: "Reset" },
  "processSummary": { fr: "Résumé du traitement", en: "Processing summary" },
  "recordsGenerated": { fr: "enregistrements ont été générés et sont prêts à être utilisés.", en: "records have been generated and are ready to be used." },
  "saveToApp": { fr: "Enregistrer les données dans l'application", en: "Save data to application" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage,
      translations,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
