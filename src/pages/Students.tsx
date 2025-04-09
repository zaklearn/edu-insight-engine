
import Layout from "@/components/Layout";
import StudentList from "@/components/StudentList";
import { useLanguage } from "@/contexts/LanguageContext";

const Students = () => {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("students")}</h1>
        <StudentList />
      </div>
    </Layout>
  );
};

export default Students;
