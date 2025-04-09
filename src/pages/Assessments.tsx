
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import AssessmentDetail from "@/components/AssessmentDetail";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const Assessments = () => {
  const { assessments, students } = useData();
  const [selectedAssessmentIndex, setSelectedAssessmentIndex] = useState(0);
  
  // If no data is uploaded, show upload prompt
  if (assessments.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-6 p-6">
          <BookOpen className="h-16 w-16 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-700">Aucune évaluation disponible</h1>
          <p className="text-gray-500 max-w-md">
            Importez vos données d'évaluation pour commencer à visualiser les résultats des étudiants.
          </p>
          <Link to="/data-upload">
            <Button>Importer des données</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Évaluations</h1>
        
        {assessments.length > 0 ? (
          <>
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="select-assessment">Sélectionner une évaluation</Label>
                    <Select 
                      value={selectedAssessmentIndex.toString()}
                      onValueChange={(value) => setSelectedAssessmentIndex(parseInt(value))}
                    >
                      <SelectTrigger id="select-assessment">
                        <SelectValue placeholder="Choisir une évaluation" />
                      </SelectTrigger>
                      <SelectContent>
                        {assessments.map((assessment, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {assessment.student.name} - {assessment.date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <AssessmentDetail assessment={assessments[selectedAssessmentIndex]} />
          </>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-500">
                Aucune évaluation disponible. Veuillez importer des données ou ajouter des évaluations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Assessments;
