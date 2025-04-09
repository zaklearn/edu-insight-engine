
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentList from "@/components/StudentList";
import AssessmentDetail from "@/components/AssessmentDetail";
import { useData } from "@/contexts/DataContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

const Index = () => {
  const { assessments } = useData();
  const { t } = useLanguage();
  
  return (
    <Layout>
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">{t("dashboard")}</TabsTrigger>
          <TabsTrigger value="students">{t("students")}</TabsTrigger>
          <TabsTrigger value="assessment">{t("assessment")}</TabsTrigger>
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
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 p-6">
              <Info className="h-16 w-16 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-700">{t("noAssessmentAvailable")}</h2>
              <Link to="/data-upload">
                <Button>{t("importData")}</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
