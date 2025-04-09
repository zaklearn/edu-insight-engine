
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentList from "@/components/StudentList";
import AssessmentDetail from "@/components/AssessmentDetail";
import { useData } from "@/contexts/DataContext";

const Index = () => {
  const { assessments } = useData();
  
  return (
    <Layout>
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
          <TabsTrigger value="students">Élèves</TabsTrigger>
          <TabsTrigger value="assessment">Évaluation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
        
        <TabsContent value="students">
          <StudentList />
        </TabsContent>
        
        <TabsContent value="assessment">
          {assessments.length > 0 ? (
            <AssessmentDetail assessment={assessments[0]} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Aucune évaluation disponible. Veuillez importer des données.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
