
import { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, BarChart3, Users, FileText, Upload, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavItemProps {
  href: string;
  icon: JSX.Element;
  text: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, text, isActive }: NavItemProps) => (
  <Link to={href}>
    <Button 
      variant={isActive ? "default" : "ghost"} 
      className="w-full justify-start mb-1"
    >
      {icon}
      <span className="ml-2">{text}</span>
    </Button>
  </Link>
);

const Layout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useLanguage();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { href: "/", icon: <BarChart3 className="h-5 w-5" />, text: t("dashboard") },
    { href: "/students", icon: <Users className="h-5 w-5" />, text: t("students") },
    { href: "/assessments", icon: <BookOpen className="h-5 w-5" />, text: t("assessments") },
    { href: "/reports", icon: <FileText className="h-5 w-5" />, text: t("reports") },
    { href: "/data-upload", icon: <Upload className="h-5 w-5" />, text: t("dataUpload") },
  ];

  const showSidebar = !isMobile || mobileMenuOpen;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <button 
          onClick={toggleMobileMenu}
          className="fixed z-50 top-4 left-4 p-2 bg-white rounded-md shadow-md"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      )}
      
      {/* Sidebar */}
      {showSidebar && (
        <div 
          className={`
            ${isMobile ? 'fixed inset-0 z-40 bg-white/95' : 'w-64'} 
            p-4 flex flex-col
          `}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-gray-800">EGRA/EGMA</h1>
            <LanguageSwitcher />
          </div>
          
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                text={item.text}
                isActive={location.pathname === item.href}
              />
            ))}
          </nav>
          
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              v1.0.0 © 2025 EGRA/EGMA
            </p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className={`flex-1 p-6 ${isMobile ? '' : 'ml-64'}`}>
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
