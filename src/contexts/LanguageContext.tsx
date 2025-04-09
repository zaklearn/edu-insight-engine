
import React, { createContext, useContext, useState, ReactNode } from 'react';

type LanguageContextType = {
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    dashboard: 'Dashboard',
    students: 'Students',
    assessments: 'Assessments',
    reports: 'Reports',
    dataUpload: 'Data Upload',
    welcome: 'Welcome to EGRA/EGMA Dashboard',
    recentAssessments: 'Recent Assessments',
    viewAll: 'View All',
    studentPerformance: 'Student Performance',
    readingMetrics: 'Reading Metrics',
    mathMetrics: 'Math Metrics',
    letterIdentification: 'Letter Identification',
    phonemeAwareness: 'Phoneme Awareness',
    readingFluency: 'Reading Fluency',
    readingComprehension: 'Reading Comprehension',
    numberIdentification: 'Number Identification',
    quantityDiscrimination: 'Quantity Discrimination',
    missingNumber: 'Missing Number',
    addition: 'Addition',
    subtraction: 'Subtraction',
    mastery: 'Mastery',
    developing: 'Developing',
    emerging: 'Emerging',
    student: 'Student',
    grade: 'Grade',
    date: 'Date',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    noData: 'No data available',
    loading: 'Loading...',
    errorLoading: 'Error loading data',
    search: 'Search',
    filter: 'Filter',
    addStudent: 'Add Student',
    addAssessment: 'Add Assessment',
    generateReport: 'Generate Report',
    uploadData: 'Upload Data',
    name: 'Name',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    save: 'Save',
    cancel: 'Cancel',
    confirmDelete: 'Are you sure you want to delete this item?',
    yes: 'Yes',
    no: 'No',
    success: 'Success',
    successMessage: 'Operation completed successfully',
    errorTitle: 'Error',
    errorMessage: 'An error occurred',
    requiredField: 'This field is required',
    invalidFormat: 'Invalid format',
    logout: 'Logout',
    settings: 'Settings',
    profile: 'Profile',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    help: 'Help',
    about: 'About',
    version: 'Version',
    copyright: 'Copyright',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    contactUs: 'Contact Us',
    feedback: 'Feedback',
    reportIssue: 'Report Issue',
    documentation: 'Documentation',
    tutorial: 'Tutorial',
    faq: 'FAQ',
    noAssessmentAvailable: 'No assessment available',
    importData: 'Import Data',
    replaceData: 'Replace Data',
    keepData: 'Keep Existing Data'
  },
  fr: {
    dashboard: 'Tableau de bord',
    students: 'Élèves',
    assessments: 'Évaluations',
    reports: 'Rapports',
    dataUpload: 'Importation de données',
    welcome: 'Bienvenue sur le tableau de bord EGRA/EGMA',
    recentAssessments: 'Évaluations récentes',
    viewAll: 'Voir tout',
    studentPerformance: 'Performance des élèves',
    readingMetrics: 'Métriques de lecture',
    mathMetrics: 'Métriques de mathématiques',
    letterIdentification: 'Identification des lettres',
    phonemeAwareness: 'Conscience phonémique',
    readingFluency: 'Fluidité de lecture',
    readingComprehension: 'Compréhension de lecture',
    numberIdentification: 'Identification des nombres',
    quantityDiscrimination: 'Discrimination des quantités',
    missingNumber: 'Nombre manquant',
    addition: 'Addition',
    subtraction: 'Soustraction',
    mastery: 'Maîtrise',
    developing: 'En développement',
    emerging: 'Émergent',
    student: 'Élève',
    grade: 'Niveau',
    date: 'Date',
    actions: 'Actions',
    view: 'Voir',
    edit: 'Modifier',
    delete: 'Supprimer',
    noData: 'Aucune donnée disponible',
    loading: 'Chargement...',
    errorLoading: 'Erreur de chargement des données',
    search: 'Rechercher',
    filter: 'Filtrer',
    addStudent: 'Ajouter un élève',
    addAssessment: 'Ajouter une évaluation',
    generateReport: 'Générer un rapport',
    uploadData: 'Importer des données',
    name: 'Nom',
    age: 'Âge',
    gender: 'Genre',
    male: 'Masculin',
    female: 'Féminin',
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    yes: 'Oui',
    no: 'Non',
    success: 'Succès',
    successMessage: 'Opération terminée avec succès',
    errorTitle: 'Erreur',
    errorMessage: 'Une erreur est survenue',
    requiredField: 'Ce champ est obligatoire',
    invalidFormat: 'Format invalide',
    logout: 'Déconnexion',
    settings: 'Paramètres',
    profile: 'Profil',
    language: 'Langue',
    theme: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    help: 'Aide',
    about: 'À propos',
    version: 'Version',
    copyright: 'Droits d\'auteur',
    termsOfService: 'Conditions d\'utilisation',
    privacyPolicy: 'Politique de confidentialité',
    contactUs: 'Contactez-nous',
    feedback: 'Commentaires',
    reportIssue: 'Signaler un problème',
    documentation: 'Documentation',
    tutorial: 'Tutoriel',
    faq: 'FAQ',
    noAssessmentAvailable: 'Aucune évaluation disponible',
    importData: 'Importer des données',
    replaceData: 'Remplacer les données',
    keepData: 'Conserver les données existantes'
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'fr'>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
