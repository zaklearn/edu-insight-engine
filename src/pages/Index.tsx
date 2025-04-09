
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentList from "@/components/StudentList";
import AssessmentDetail from "@/components/AssessmentDetail";
import { sampleAssessments } from "@/types";

const Index = () => {
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
          <AssessmentDetail assessment={sampleAssessments[0]} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
