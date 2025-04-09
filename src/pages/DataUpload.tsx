
import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { read, utils } from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/contexts/DataContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Student, AssessmentData } from "@/types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ColumnMapping {
  name: string;
  grade: string;
  age: string;
  gender: string;
  letterIdentification: string;
  phonemeAwareness: string;
  readingFluency: string;
  readingComprehension: string;
  numberIdentification: string;
  quantityDiscrimination: string;
  missingNumber: string;
  addition: string;
  subtraction: string;
}

const DataUpload = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    name: "",
    grade: "",
    age: "",
    gender: "",
    letterIdentification: "not_mapped",
    phonemeAwareness: "not_mapped",
    readingFluency: "not_mapped",
    readingComprehension: "not_mapped",
    numberIdentification: "not_mapped",
    quantityDiscrimination: "not_mapped",
    missingNumber: "not_mapped",
    addition: "not_mapped",
    subtraction: "not_mapped",
  });
  const [processedData, setProcessedData] = useState<AssessmentData[]>([]);
  const [processedStudents, setProcessedStudents] = useState<Student[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { importData, replaceData, students } = useData();
  const { t } = useLanguage();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet, { header: 1 });
        
        if (json.length > 0) {
          // First row contains headers
          const headers = json[0] as string[];
          setColumns(headers);
          
          // Rest of the rows contain data
          const dataRows = json.slice(1);
          setExcelData(dataRows);
          
          // Show first 5 rows as preview
          setPreviewData(dataRows.slice(0, 5).map((row: any[]) => {
            const rowData: Record<string, any> = {};
            headers.forEach((header, index) => {
              rowData[header] = row[index];
            });
            return rowData;
          }));
          
          toast({
            title: t("success"),
            description: `${dataRows.length} lignes de données trouvées`,
          });
        } else {
          toast({
            title: t("errorTitle"),
            description: "Le fichier ne contient pas de données valides",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: t("errorTitle"),
          description: "Veuillez vérifier que le fichier est un fichier Excel valide",
          variant: "destructive",
        });
        console.error("Error reading Excel file:", error);
      }
    };
    
    reader.readAsBinaryString(file);
  };

  const handleMappingChange = (field: keyof ColumnMapping, value: string) => {
    setMapping((prev) => ({ ...prev, [field]: value }));
  };

  const processData = () => {
    try {
      // Check if all required fields are mapped
      const requiredFields: (keyof ColumnMapping)[] = ["name", "grade", "age", "gender"];
      const missingFields = requiredFields.filter(field => !mapping[field]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Mappages incomplets",
          description: `Veuillez assigner des colonnes pour: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      // Process data according to mapping
      const students: Student[] = [];
      const assessments: AssessmentData[] = [];
      
      excelData.forEach((row: any[]) => {
        const studentId = Math.random().toString(36).substring(2, 11); // Generate random ID
        
        const student: Student = {
          id: studentId,
          name: row[columns.indexOf(mapping.name)],
          grade: row[columns.indexOf(mapping.grade)],
          age: Number(row[columns.indexOf(mapping.age)]),
          gender: row[columns.indexOf(mapping.gender)] === 'M' ? 'M' : 'F',
        };

        const date = new Date().toISOString().split('T')[0];

        const egra = {
          letterIdentification: mapping.letterIdentification && mapping.letterIdentification !== "not_mapped" 
            ? Number(row[columns.indexOf(mapping.letterIdentification)]) : 0,
          phonemeAwareness: mapping.phonemeAwareness && mapping.phonemeAwareness !== "not_mapped"
            ? Number(row[columns.indexOf(mapping.phonemeAwareness)]) : 0,
          readingFluency: mapping.readingFluency && mapping.readingFluency !== "not_mapped"
            ? Number(row[columns.indexOf(mapping.readingFluency)]) : 0,
          readingComprehension: mapping.readingComprehension && mapping.readingComprehension !== "not_mapped"
            ? Number(row[columns.indexOf(mapping.readingComprehension)]) : 0,
        };

        const egma = {
          numberIdentification: mapping.numberIdentification && mapping.numberIdentification !== "not_mapped"
            ? Number(row[columns.indexOf(mapping.numberIdentification)]) : 0,
          quantityDiscrimination: mapping.quantityDiscrimination && mapping.quantityDiscrimination !== "not_mapped"
            ? Number(row[columns.indexOf(mapping.quantityDiscrimination)]) : 0,
          missingNumber: mapping.missingNumber && mapping.missingNumber !== "not_mapped"
            ? Number(row[columns.indexOf(mapping.missingNumber)]) : 0,
          addition: mapping.addition && mapping.addition !== "not_mapped"
            ? Number(row[columns.indexOf(mapping.addition)]) : 0,
          subtraction: mapping.subtraction && mapping.subtraction !== "not_mapped"
            ? Number(row[columns.indexOf(mapping.subtraction)]) : 0,
        };

        students.push(student);
        assessments.push({
          student,
          date,
          egra,
          egma
        });
      });

      setProcessedStudents(students);
      setProcessedData(assessments);
      
      toast({
        title: t("success"),
        description: `${assessments.length} enregistrements générés`,
      });
      
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description: "Une erreur s'est produite lors du traitement des données",
        variant: "destructive",
      });
      console.error("Error processing data:", error);
    }
  };

  const saveData = (replace: boolean) => {
    if (processedData.length === 0) {
      toast({
        title: t("errorTitle"),
        description: "Veuillez d'abord traiter les données.",
        variant: "destructive",
      });
      return;
    }

    try {
      const data = {
        students: processedStudents,
        assessments: processedData
      };
      
      if (replace) {
        replaceData(data);
      } else {
        importData(data);
      }
      
      // Reset the form after successful import
      resetForm();
      setShowImportDialog(false);
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description: "Une erreur s'est produite lors de l'enregistrement des données",
        variant: "destructive",
      });
      console.error("Error saving data:", error);
    }
  };

  const handleSaveClick = () => {
    if (students.length > 0) {
      setShowImportDialog(true);
    } else {
      // If no existing data, just save without asking
      saveData(false); 
    }
  };

  const resetForm = () => {
    setExcelData([]);
    setColumns([]);
    setMapping({
      name: "",
      grade: "",
      age: "",
      gender: "",
      letterIdentification: "not_mapped",
      phonemeAwareness: "not_mapped",
      readingFluency: "not_mapped",
      readingComprehension: "not_mapped",
      numberIdentification: "not_mapped",
      quantityDiscrimination: "not_mapped",
      missingNumber: "not_mapped",
      addition: "not_mapped",
      subtraction: "not_mapped",
    });
    setProcessedData([]);
    setProcessedStudents([]);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{t("dataUpload")}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Télécharger un fichier Excel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="excel-file">Fichier Excel</Label>
              <Input 
                id="excel-file" 
                type="file" 
                ref={fileInputRef}
                accept=".xlsx,.xls" 
                onChange={handleFileUpload} 
              />
            </div>
            
            {columns.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Aperçu des données</h3>
                <div className="border rounded overflow-auto max-h-60">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((col, index) => (
                          <TableHead key={index}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {columns.map((col, colIndex) => (
                            <TableCell key={colIndex}>{row[col]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {columns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Mappages des colonnes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="map-name">Nom de l'élève</Label>
                  <Select 
                    value={mapping.name} 
                    onValueChange={(value) => handleMappingChange("name", value)}
                  >
                    <SelectTrigger id="map-name">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-grade">Niveau</Label>
                  <Select 
                    value={mapping.grade} 
                    onValueChange={(value) => handleMappingChange("grade", value)}
                  >
                    <SelectTrigger id="map-grade">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-age">Âge</Label>
                  <Select 
                    value={mapping.age} 
                    onValueChange={(value) => handleMappingChange("age", value)}
                  >
                    <SelectTrigger id="map-age">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-gender">Genre (M/F)</Label>
                  <Select 
                    value={mapping.gender} 
                    onValueChange={(value) => handleMappingChange("gender", value)}
                  >
                    <SelectTrigger id="map-gender">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-full">
                  <h3 className="text-lg font-semibold mt-4 mb-2">EGRA - Lecture</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-letter">Identification des lettres</Label>
                  <Select 
                    value={mapping.letterIdentification} 
                    onValueChange={(value) => handleMappingChange("letterIdentification", value)}
                  >
                    <SelectTrigger id="map-letter">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Non mappé</SelectItem>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-phoneme">Conscience phonémique</Label>
                  <Select 
                    value={mapping.phonemeAwareness} 
                    onValueChange={(value) => handleMappingChange("phonemeAwareness", value)}
                  >
                    <SelectTrigger id="map-phoneme">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Non mappé</SelectItem>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-fluency">Fluidité de lecture</Label>
                  <Select 
                    value={mapping.readingFluency} 
                    onValueChange={(value) => handleMappingChange("readingFluency", value)}
                  >
                    <SelectTrigger id="map-fluency">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Non mappé</SelectItem>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-comprehension">Compréhension de lecture</Label>
                  <Select 
                    value={mapping.readingComprehension} 
                    onValueChange={(value) => handleMappingChange("readingComprehension", value)}
                  >
                    <SelectTrigger id="map-comprehension">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Non mappé</SelectItem>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-full">
                  <h3 className="text-lg font-semibold mt-4 mb-2">EGMA - Mathématiques</h3>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-number">Identification des nombres</Label>
                  <Select 
                    value={mapping.numberIdentification} 
                    onValueChange={(value) => handleMappingChange("numberIdentification", value)}
                  >
                    <SelectTrigger id="map-number">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Non mappé</SelectItem>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-quantity">Discrimination quantitative</Label>
                  <Select 
                    value={mapping.quantityDiscrimination} 
                    onValueChange={(value) => handleMappingChange("quantityDiscrimination", value)}
                  >
                    <SelectTrigger id="map-quantity">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Non mappé</SelectItem>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-missing">Nombre manquant</Label>
                  <Select 
                    value={mapping.missingNumber} 
                    onValueChange={(value) => handleMappingChange("missingNumber", value)}
                  >
                    <SelectTrigger id="map-missing">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Non mappé</SelectItem>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-addition">Addition</Label>
                  <Select 
                    value={mapping.addition} 
                    onValueChange={(value) => handleMappingChange("addition", value)}
                  >
                    <SelectTrigger id="map-addition">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Non mappé</SelectItem>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="map-subtraction">Soustraction</Label>
                  <Select 
                    value={mapping.subtraction} 
                    onValueChange={(value) => handleMappingChange("subtraction", value)}
                  >
                    <SelectTrigger id="map-subtraction">
                      <SelectValue placeholder="Sélectionner une colonne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_mapped">Non mappé</SelectItem>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button onClick={processData}>Traiter les données</Button>
                <Button variant="outline" onClick={resetForm}>Réinitialiser</Button>
              </div>
              
              {processedData.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Résumé du traitement</h3>
                  <p>{processedData.length} enregistrements ont été générés et sont prêts à être utilisés.</p>
                  <Button onClick={handleSaveClick} className="mt-4">
                    Enregistrer les données dans l'application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("importData")}</AlertDialogTitle>
            <AlertDialogDescription>
              Des données existent déjà. Voulez-vous remplacer toutes les données existantes ou ajouter ces nouvelles données aux données existantes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => saveData(false)}>
              {t("keepData")}
            </AlertDialogAction>
            <AlertDialogAction onClick={() => saveData(true)} className="bg-destructive text-destructive-foreground">
              {t("replaceData")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default DataUpload;
