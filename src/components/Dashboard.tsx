import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BookOpen, Calculator, AlertCircle, Info } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";

interface ChartData {
  name: string;
  EGRA: number;
  EGMA: number;
}

const calculateAveragesFromAssessments = (assessments: any[]) => {
  if (assessments.length === 0) return [];
  
  // Aggregate by grade
  const gradeMap = new Map<string, { count: number, egra: number, egma: number }>();
  
  assessments.forEach(assessment => {
    const grade = assessment.student.grade;
    const egra = (assessment.egra.letterIdentification + assessment.egra.phonemeAwareness + 
                 assessment.egra.readingFluency + assessment.egra.readingComprehension) / 4;
    const egma = (assessment.egma.numberIdentification + assessment.egma.quantityDiscrimination + 
                 assessment.egma.missingNumber + assessment.egma.addition + assessment.egma.subtraction) / 5;
    
    if (gradeMap.has(grade)) {
      const current = gradeMap.get(grade)!;
      gradeMap.set(grade, {
        count: current.count + 1,
        egra: current.egra + egra,
        egma: current.egma + egma
      });
    } else {
      gradeMap.set(grade, { count: 1, egra, egma });
    }
  });
  
  // Calculate averages
  const chartData: ChartData[] = [];
  gradeMap.forEach((value, grade) => {
    chartData.push({
      name: grade,
      EGRA: Math.round(value.egra / value.count),
      EGMA: Math.round(value.egma / value.count)
    });
  });
  
  return chartData;
};

const Dashboard = () => {
  const { students, assessments } = useData();
  const [selectedClass, setSelectedClass] = useState<string>("all");
  
  // If no data is uploaded, show upload prompt
  if (students.length === 0 || assessments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center space-y-6 p-6">
        <Info className="h-16 w-16 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-700">Aucune donnée disponible</h2>
        <p className="text-gray-500 max-w-md">
          Commencez par importer vos données d'évaluation pour visualiser le tableau de bord.
        </p>
        <Link to="/data-upload">
          <Button>Importer des données</Button>
        </Link>
      </div>
    );
  }

  // Get unique grades
  const grades = Array.from(new Set(students.map(s => s.grade)));
  
  const filteredAssessments = selectedClass === "all" 
    ? assessments 
    : assessments.filter(a => a.student.grade === selectedClass);
  
  // Calculate averages based on filtered assessments
  const averages = calculateAveragesFromAssessments(filteredAssessments);
  
  // Count students by grade
  const studentsByGrade = grades.map(grade => ({
    name: grade,
    Students: students.filter(s => s.grade === grade).length
  }));
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Tableau de Bord</h2>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble des performances EGRA/EGMA
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {grades.map(grade => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>Exporter les données</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-edu-primary" />
              Performances EGRA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-edu-primary">
              {averages.length > 0 
                ? Math.round(averages.reduce((sum, item) => sum + item.EGRA, 0) / averages.length) 
                : 0}%
            </div>
            <p className="text-sm text-gray-500 mt-1">Moyenne globale</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Calculator className="h-5 w-5 text-edu-accent" />
              Performances EGMA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-edu-accent">
              {averages.length > 0 
                ? Math.round(averages.reduce((sum, item) => sum + item.EGMA, 0) / averages.length) 
                : 0}%
            </div>
            <p className="text-sm text-gray-500 mt-1">Moyenne globale</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-500" />
              Élèves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">
              {selectedClass === "all" 
                ? students.length 
                : students.filter(s => s.grade === selectedClass).length}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {selectedClass === "all" ? "Nombre total d'élèves" : `Élèves en ${selectedClass}`}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="performance">
        <TabsList className="mb-6">
          <TabsTrigger value="performance">Performance par classe</TabsTrigger>
          <TabsTrigger value="students">Distribution des élèves</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison EGRA/EGMA par classe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={averages}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, ""]}
                      labelFormatter={(label) => `Classe: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="EGRA" fill="#1E88E5" name="EGRA" />
                    <Bar dataKey="EGMA" fill="#4CAF50" name="EGMA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Nombre d'élèves par classe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={studentsByGrade}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [value, "Élèves"]}
                      labelFormatter={(label) => `Classe: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Students" 
                      name="Élèves"
                      strokeWidth={2}
                      stroke="#0D47A1" 
                      fill="#1E88E5" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              À Surveiller
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleAssessments.slice(0, 2).map((assessment) => (
                <div key={assessment.student.id} className="p-4 border rounded-lg flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{assessment.student.name}</h4>
                    <span className="text-xs text-gray-500">Classe: {assessment.student.grade}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">EGRA: {Math.round((assessment.egra.letterIdentification + assessment.egra.phonemeAwareness + 
                      assessment.egra.readingFluency + assessment.egra.readingComprehension) / 4)}%</span>
                    <span className="text-gray-600">EGMA: {Math.round((assessment.egma.numberIdentification + assessment.egma.quantityDiscrimination + 
                      assessment.egma.missingNumber + assessment.egma.addition + assessment.egma.subtraction) / 5)}%</span>
                  </div>
                  <div className="text-sm text-amber-600">
                    Nécessite un suivi personnalisé en lecture fluide
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Voir l'évaluation complète
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Actions Recommandées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg flex flex-col gap-2 bg-blue-50 border-blue-200">
                <h4 className="font-medium text-blue-700">Atelier de Lecture</h4>
                <p className="text-sm text-blue-600">
                  Organisez un atelier concentré sur la fluidité de lecture pour les classes CP1 et CP2.
                </p>
                <Button variant="outline" size="sm" className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100">
                  Planifier
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg flex flex-col gap-2 bg-green-50 border-green-200">
                <h4 className="font-medium text-green-700">Ressources Mathématiques</h4>
                <p className="text-sm text-green-600">
                  Procurez-vous du matériel manipulatif supplémentaire pour les exercices de calcul.
                </p>
                <Button variant="outline" size="sm" className="mt-2 border-green-300 text-green-700 hover:bg-green-100">
                  Explorer
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg flex flex-col gap-2 bg-purple-50 border-purple-200">
                <h4 className="font-medium text-purple-700">Formation Enseignants</h4>
                <p className="text-sm text-purple-600">
                  Formation sur l'interprétation des résultats EGRA/EGMA et les interventions ciblées.
                </p>
                <Button variant="outline" size="sm" className="mt-2 border-purple-300 text-purple-700 hover:bg-purple-100">
                  En savoir plus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
