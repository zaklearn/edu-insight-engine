import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useData } from "@/contexts/DataContext";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const Reports = () => {
  const { assessments, students } = useData();
  
  // If no data is uploaded, show upload prompt
  if (assessments.length === 0 || students.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-6 p-6">
          <Info className="h-16 w-16 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-700">Aucun rapport disponible</h1>
          <p className="text-gray-500 max-w-md">
            Importez vos données d'évaluation pour générer des rapports détaillés.
          </p>
          <Link to="/data-upload">
            <Button>Importer des données</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  // Calculate average scores by grade
  const calculateGradeAverages = () => {
    const gradeMap = new Map();
    
    assessments.forEach(assessment => {
      const grade = assessment.student.grade;
      const egra = (assessment.egra.letterIdentification + assessment.egra.phonemeAwareness + 
                  assessment.egra.readingFluency + assessment.egra.readingComprehension) / 4;
      const egma = (assessment.egma.numberIdentification + assessment.egma.quantityDiscrimination + 
                  assessment.egma.missingNumber + assessment.egma.addition + assessment.egma.subtraction) / 5;
      
      if (gradeMap.has(grade)) {
        const current = gradeMap.get(grade);
        gradeMap.set(grade, {
          count: current.count + 1,
          egra: current.egra + egra,
          egma: current.egma + egma
        });
      } else {
        gradeMap.set(grade, { count: 1, egra, egma });
      }
    });
    
    return Array.from(gradeMap.entries()).map(([grade, data]) => ({
      grade,
      egra: Math.round(data.egra / data.count),
      egma: Math.round(data.egma / data.count)
    }));
  };
  
  const gradeAverages = calculateGradeAverages();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Rapports</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance moyenne par classe</CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gradeAverages}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="grade" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, ""]}
                      labelFormatter={(label) => `Classe: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="egra" name="EGRA" fill="#1E88E5" />
                    <Bar dataKey="egma" name="EGMA" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center py-10 text-gray-500">
                Aucune donnée disponible pour générer des rapports.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Nombre total d'élèves: {students.length}</p>
              <p>Nombre total d'évaluations: {assessments.length}</p>
              <p>Nombre de classes: {new Set(students.map(s => s.grade)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
