
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="mx-auto w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <FileQuestion className="h-10 w-10 text-edu-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          La page demandée n'a pas été trouvée
        </p>
        <Button asChild size="lg" className="w-full">
          <a href="/">Retourner à l'accueil</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
