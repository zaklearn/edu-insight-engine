
import Layout from "@/components/Layout";
import StudentList from "@/components/StudentList";

const Students = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Élèves</h1>
        <StudentList />
      </div>
    </Layout>
  );
};

export default Students;
