
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm"
        className={language === "fr" ? "bg-primary/10" : ""}
        onClick={() => setLanguage("fr")}
      >
        FR
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        className={language === "en" ? "bg-primary/10" : ""}
        onClick={() => setLanguage("en")}
      >
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
