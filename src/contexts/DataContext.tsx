
import { createContext, useContext, useState, ReactNode } from "react";
import { AssessmentData, sampleAssessments, Student, sampleStudents } from "@/types";
import { toast } from "@/hooks/use-toast";

interface DataContextType {
  students: Student[];
  assessments: AssessmentData[];
  addStudents: (newStudents: Student[]) => void;
  addAssessments: (newAssessments: AssessmentData[]) => void;
  importData: (data: { students: Student[], assessments: AssessmentData[] }) => void;
  resetData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [assessments, setAssessments] = useState<AssessmentData[]>(sampleAssessments);

  const addStudents = (newStudents: Student[]) => {
    // Filter out duplicates by ID
    const uniqueNewStudents = newStudents.filter(
      newStudent => !students.some(existingStudent => existingStudent.id === newStudent.id)
    );
    
    if (uniqueNewStudents.length > 0) {
      setStudents(prev => [...prev, ...uniqueNewStudents]);
      toast({
        title: "Élèves ajoutés",
        description: `${uniqueNewStudents.length} nouveaux élèves ont été ajoutés.`
      });
    }
  };

  const addAssessments = (newAssessments: AssessmentData[]) => {
    // We can have multiple assessments per student, but we want to avoid exact duplicates
    const uniqueNewAssessments = newAssessments.filter(
      newAssessment => !assessments.some(
        existingAssessment => 
          existingAssessment.student.id === newAssessment.student.id && 
          existingAssessment.date === newAssessment.date
      )
    );
    
    if (uniqueNewAssessments.length > 0) {
      setAssessments(prev => [...prev, ...uniqueNewAssessments]);
      toast({
        title: "Évaluations ajoutées",
        description: `${uniqueNewAssessments.length} nouvelles évaluations ont été ajoutées.`
      });
    }
  };

  const importData = (data: { students: Student[], assessments: AssessmentData[] }) => {
    addStudents(data.students);
    addAssessments(data.assessments);
  };

  const resetData = () => {
    setStudents(sampleStudents);
    setAssessments(sampleAssessments);
    toast({
      title: "Données réinitialisées",
      description: "Toutes les données ont été réinitialisées."
    });
  };

  return (
    <DataContext.Provider value={{ 
      students, 
      assessments, 
      addStudents, 
      addAssessments, 
      importData,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
