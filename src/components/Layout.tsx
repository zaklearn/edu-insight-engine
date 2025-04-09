
import { Link } from "react-router-dom";
import { FileSpreadsheet, Users, FileText, BarChart4 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EGRA / EGMA Analytics</h1>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-100 p-4 hidden md:block">
          <nav className="space-y-2">
            <Link
              to="/"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
            >
              <BarChart4 size={20} />
              <span>Tableau de Bord</span>
            </Link>
            <Link
              to="/students"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
            >
              <Users size={20} />
              <span>Étudiants</span>
            </Link>
            <Link
              to="/assessments"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
            >
              <FileText size={20} />
              <span>Évaluations</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
            >
              <BarChart4 size={20} />
              <span>Rapports</span>
            </Link>
            <Link
              to="/data-upload"
              className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
            >
              <FileSpreadsheet size={20} />
              <span>Importation de Données</span>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        EGRA/EGMA Analytics System © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Layout;
