
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Rapports</h1>
        <Card>
          <CardHeader>
            <CardTitle>Rapport d'analyse</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Cette page affichera les rapports d'analyse EGRA/EGMA pour les élèves et les classes.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
