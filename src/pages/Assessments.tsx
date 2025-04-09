
import Layout from "@/components/Layout";
import AssessmentDetail from "@/components/AssessmentDetail";
import { sampleAssessments } from "@/types";

const Assessments = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Évaluations</h1>
        <AssessmentDetail assessment={sampleAssessments[0]} />
      </div>
    </Layout>
  );
};

export default Assessments;
