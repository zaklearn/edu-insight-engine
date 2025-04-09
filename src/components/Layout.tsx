
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Helper function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-edu-primary text-white flex items-center justify-center font-bold">
              EI
            </div>
            <h1 className="text-xl font-bold">EduInsight</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={isActive("/") ? "text-edu-primary font-medium" : "text-gray-600 hover:text-edu-primary font-medium transition-colors"}
            >
              Tableau de bord
            </Link>
            <Link 
              to="/students" 
              className={isActive("/students") ? "text-edu-primary font-medium" : "text-gray-600 hover:text-edu-primary font-medium transition-colors"}
            >
              Élèves
            </Link>
            <Link 
              to="/assessments" 
              className={isActive("/assessments") ? "text-edu-primary font-medium" : "text-gray-600 hover:text-edu-primary font-medium transition-colors"}
            >
              Évaluations
            </Link>
            <Link 
              to="/reports" 
              className={isActive("/reports") ? "text-edu-primary font-medium" : "text-gray-600 hover:text-edu-primary font-medium transition-colors"}
            >
              Rapports
            </Link>
          </nav>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-600 font-medium">A</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; 2025 EduInsight Engine | Système d'Analyse EGRA/EGMA avec Interprétation Hybride
        </div>
      </footer>
    </div>
  );
};

export default Layout;
