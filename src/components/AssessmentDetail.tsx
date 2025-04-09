
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, BookOpen, Calculator, Lightbulb, Download, Share2 } from "lucide-react";
import { AssessmentData, FullInterpretation } from "@/types";
import { getFullInterpretation } from "@/lib/assessment-utils";
import { loadModel, getModelStatus } from "@/lib/llm-integration";

interface AssessmentDetailProps {
  assessment: AssessmentData;
}

const AssessmentDetail = ({ assessment }: AssessmentDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [interpretation, setInterpretation] = useState<FullInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const generateInterpretation = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const result = await getFullInterpretation(assessment);
      setInterpretation(result);
    } catch (error) {
      console.error("Error generating interpretation:", error);
      setErrorMessage("Erreur lors de la génération de l'interprétation. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const { student, egra, egma } = assessment;
  
  const egraChartData = [
    { name: "Lettres (clpm)", value: egra.letterIdentification, fill: "#1976D2" },
    { name: "Phonèmes (%)", value: egra.phonemeAwareness, fill: "#2196F3" },
    { name: "Mots (cwpm)", value: egra.readingFluency, fill: "#64B5F6" },
    { name: "Compréhension (%)", value: egra.readingComprehension, fill: "#90CAF9" },
  ];
  
  const egmaChartData = [
    { name: "Nombres (/min)", value: egma.numberIdentification, fill: "#388E3C" },
    { name: "Quantités (%)", value: egma.quantityDiscrimination, fill: "#4CAF50" },
    { name: "Nb. manquants (%)", value: egma.missingNumber, fill: "#81C784" },
    { name: "Addition (%)", value: egma.addition, fill: "#A5D6A7" },
    { name: "Soustraction (%)", value: egma.subtraction, fill: "#C8E6C9" },
  ];
  
  const LevelBadge = ({ level }: { level: 'mastery' | 'developing' | 'emerging' }) => {
    const colors = {
      mastery: "bg-green-100 text-green-800 border-green-200",
      developing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      emerging: "bg-red-100 text-red-800 border-red-200"
    };
    
    const labels = {
      mastery: "Maîtrisé",
      developing: "En développement",
      emerging: "Émergent"
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${colors[level]}`}>
        {labels[level]}
      </span>
    );
  };
  
  const modelStatus = getModelStatus();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <CardDescription>
                ID: {student.id} | Classe: {student.grade} | Âge: {student.age} ans | 
                Genre: {student.gender === 'M' ? 'Garçon' : 'Fille'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Exporter</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-[500px]">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="details">Résultats détaillés</TabsTrigger>
          <TabsTrigger value="interpretation">Interprétation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-edu-primary" />
                  Aperçu EGRA (Lecture)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={egraChartData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-edu-accent" />
                  Aperçu EGMA (Mathématiques)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={egmaChartData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Points notables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-edu-primary p-1.5 rounded-full text-white">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Force en compréhension</h4>
                    <p className="text-gray-600 text-sm">
                      L'élève démontre une bonne compréhension en lecture ({egra.readingComprehension}%), ce qui est une base solide pour développer des compétences de lecture plus avancées.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-amber-500 p-1.5 rounded-full text-white">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Soutien en fluidité de lecture</h4>
                    <p className="text-gray-600 text-sm">
                      Avec {egra.readingFluency} mots corrects par minute, l'élève bénéficierait d'un soutien pour améliorer sa vitesse de lecture tout en maintenant la précision.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-edu-accent p-1.5 rounded-full text-white">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Compétence en addition</h4>
                    <p className="text-gray-600 text-sm">
                      L'élève montre une bonne maîtrise de l'addition ({egma.addition}%), ce qui constitue une base solide pour des concepts mathématiques plus avancés.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button onClick={() => setActiveTab("interpretation")} className="w-full">
                  Générer une interprétation complète
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-edu-primary" />
                Résultats détaillés EGRA (Lecture)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Identification des lettres</span>
                        <span className="text-sm text-gray-600">{egra.letterIdentification} lettres/minute</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-edu-primary" 
                          style={{ width: `${Math.min(egra.letterIdentification / 60 * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Conscience phonémique</span>
                        <span className="text-sm text-gray-600">{egra.phonemeAwareness}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-edu-primary" 
                          style={{ width: `${egra.phonemeAwareness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Fluidité de lecture</span>
                        <span className="text-sm text-gray-600">{egra.readingFluency} mots/minute</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-edu-primary" 
                          style={{ width: `${Math.min(egra.readingFluency / 50 * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Compréhension écrite</span>
                        <span className="text-sm text-gray-600">{egra.readingComprehension}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-edu-primary" 
                          style={{ width: `${egra.readingComprehension}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-edu-accent" />
                Résultats détaillés EGMA (Mathématiques)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Identification des nombres</span>
                        <span className="text-sm text-gray-600">{egma.numberIdentification} nombres/minute</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-edu-accent" 
                          style={{ width: `${Math.min(egma.numberIdentification / 50 * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Discrimination des quantités</span>
                        <span className="text-sm text-gray-600">{egma.quantityDiscrimination}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-edu-accent" 
                          style={{ width: `${egma.quantityDiscrimination}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Nombres manquants</span>
                        <span className="text-sm text-gray-600">{egma.missingNumber}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-edu-accent" 
                          style={{ width: `${egma.missingNumber}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Addition</span>
                        <span className="text-sm text-gray-600">{egma.addition}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-edu-accent" 
                          style={{ width: `${egma.addition}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Soustraction</span>
                        <span className="text-sm text-gray-600">{egma.subtraction}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-edu-accent" 
                          style={{ width: `${egma.subtraction}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interpretation" className="mt-6 space-y-6">
          {!interpretation && !isLoading && (
            <Card>
              <CardHeader>
                <CardTitle>Interprétation et Recommandations</CardTitle>
                <CardDescription>
                  Générez une analyse détaillée des résultats EGRA/EGMA avec des recommandations personnalisées.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-2">Aucune interprétation disponible</h3>
                    <p className="text-gray-500 mb-6">
                      Obtenez une analyse détaillée et des recommandations basées sur les résultats d'évaluation de cet élève.
                    </p>
                    
                    {errorMessage && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Erreur</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    {!modelStatus.isLoaded && !modelStatus.isLoading && (
                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Modèle d'IA non chargé</AlertTitle>
                        <AlertDescription>
                          Un modèle de langage local doit être chargé pour générer l'interprétation.
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex gap-4 justify-center">
                      {!modelStatus.isLoaded && !modelStatus.isLoading ? (
                        <Button
                          onClick={() => loadModel()}
                          disabled={modelStatus.isLoading}
                        >
                          {modelStatus.isLoading ? "Chargement..." : "Charger le modèle d'IA"}
                        </Button>
                      ) : (
                        <Button 
                          onClick={generateInterpretation} 
                          disabled={isLoading || modelStatus.isLoading}
                        >
                          {isLoading ? "Génération en cours..." : "Générer l'interprétation"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {isLoading && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-primary/20 border-r-primary align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-gray-600">Génération de l'interprétation en cours...</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {interpretation && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Interprétation à base de règles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Lecture (EGRA)</h3>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Identification des lettres</span>
                            <LevelBadge level={interpretation.ruleBasedInterpretation.letterIdentification.level} />
                          </div>
                          <p className="text-gray-600 text-sm">
                            {interpretation.ruleBasedInterpretation.letterIdentification.message}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Conscience phonémique</span>
                            <LevelBadge level={interpretation.ruleBasedInterpretation.phonemeAwareness.level} />
                          </div>
                          <p className="text-gray-600 text-sm">
                            {interpretation.ruleBasedInterpretation.phonemeAwareness.message}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Fluidité de lecture</span>
                            <LevelBadge level={interpretation.ruleBasedInterpretation.readingFluency.level} />
                          </div>
                          <p className="text-gray-600 text-sm">
                            {interpretation.ruleBasedInterpretation.readingFluency.message}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Compréhension écrite</span>
                            <LevelBadge level={interpretation.ruleBasedInterpretation.readingComprehension.level} />
                          </div>
                          <p className="text-gray-600 text-sm">
                            {interpretation.ruleBasedInterpretation.readingComprehension.message}
                          </p>
                        </div>
                      </div>
                      
                      <Alert className="mt-4 bg-blue-50 border border-blue-100">
                        <AlertTitle className="text-blue-800">Synthèse Lecture</AlertTitle>
                        <AlertDescription className="text-blue-700">
                          {interpretation.ruleBasedInterpretation.summary.reading}
                        </AlertDescription>
                      </Alert>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Mathématiques (EGMA)</h3>
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Identification des nombres</span>
                            <LevelBadge level={interpretation.ruleBasedInterpretation.numberIdentification.level} />
                          </div>
                          <p className="text-gray-600 text-sm">
                            {interpretation.ruleBasedInterpretation.numberIdentification.message}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Discrimination des quantités</span>
                            <LevelBadge level={interpretation.ruleBasedInterpretation.quantityDiscrimination.level} />
                          </div>
                          <p className="text-gray-600 text-sm">
                            {interpretation.ruleBasedInterpretation.quantityDiscrimination.message}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Nombres manquants</span>
                            <LevelBadge level={interpretation.ruleBasedInterpretation.missingNumber.level} />
                          </div>
                          <p className="text-gray-600 text-sm">
                            {interpretation.ruleBasedInterpretation.missingNumber.message}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Addition</span>
                            <LevelBadge level={interpretation.ruleBasedInterpretation.addition.level} />
                          </div>
                          <p className="text-gray-600 text-sm">
                            {interpretation.ruleBasedInterpretation.addition.message}
                          </p>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Soustraction</span>
                            <LevelBadge level={interpretation.ruleBasedInterpretation.subtraction.level} />
                          </div>
                          <p className="text-gray-600 text-sm">
                            {interpretation.ruleBasedInterpretation.subtraction.message}
                          </p>
                        </div>
                      </div>
                      
                      <Alert className="mt-4 bg-green-50 border border-green-100">
                        <AlertTitle className="text-green-800">Synthèse Mathématiques</AlertTitle>
                        <AlertDescription className="text-green-700">
                          {interpretation.ruleBasedInterpretation.summary.mathematics}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {interpretation.generatedInterpretation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-purple-500" />
                      Interprétation enrichie (IA)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-blue max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: interpretation.generatedInterpretation
                          .replace(/^##\s(.*)/gm, '<h2>$1</h2>')
                          .replace(/^###\s(.*)/gm, '<h3>$1</h3>')
                          .replace(/^####\s(.*)/gm, '<h4>$1</h4>')
                          .replace(/^\*\*(.*)\*\*/gm, '<strong>$1</strong>')
                          .replace(/^\*(.*)\*/gm, '<em>$1</em>')
                          .replace(/^-\s(.*)/gm, '<li>$1</li>')
                          .replace(/<li>(.*)<\/li>/g, function(match) {
                            return match.replace(/\n/g, '');
                          })
                          .replace(/(?:\n\n|^)(?:<li>.*?<\/li>\n?)+/gm, function(match) {
                            return '<ul>' + match.trim() + '</ul>';
                          })
                          .replace(/\n\n/g, '<br><br>')
                      }} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssessmentDetail;
