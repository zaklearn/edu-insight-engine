
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, SortAsc, SortDesc, ChevronRight, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const StudentList = () => {
  const { students } = useData();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  // If no students data is available, show upload prompt
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 p-6">
        <Info className="h-16 w-16 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-700">{t("noDataAvailable")}</h2>
        <p className="text-gray-500 max-w-md">
          {t("importData")}
        </p>
        <Link to="/data-upload">
          <Button>{t("importData")}</Button>
        </Link>
      </div>
    );
  }

  // Get unique grades
  const grades = Array.from(new Set(students.map(s => s.grade)));

  // Filter and sort students
  const filteredStudents = students
    .filter(student => 
      (selectedGrade === "all" || student.grade === selectedGrade) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       student.id.includes(searchTerm))
    )
    .sort((a, b) => {
      let compareA, compareB;

      switch(sortField) {
        case "id":
          compareA = a.id;
          compareB = b.id;
          break;
        case "grade":
          compareA = a.grade;
          compareB = b.grade;
          break;
        case "age":
          compareA = a.age;
          compareB = b.age;
          break;
        case "gender":
          compareA = a.gender;
          compareB = b.gender;
          break;
        case "name":
        default:
          compareA = a.name;
          compareB = b.name;
      }

      if (sortDirection === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{t("students")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder={t("searchStudent")}
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder={t("class")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allClasses")}</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>{t("addStudent")}</span>
          </Button>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSort("id")}
                >
                  <div className="flex items-center gap-2">
                    {t("id")} <SortIcon field="id" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    {t("name")} <SortIcon field="name" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSort("grade")}
                >
                  <div className="flex items-center gap-2">
                    {t("class")} <SortIcon field="grade" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSort("age")}
                >
                  <div className="flex items-center gap-2">
                    {t("age")} <SortIcon field="age" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleSort("gender")}
                >
                  <div className="flex items-center gap-2">
                    {t("gender")} <SortIcon field="gender" />
                  </div>
                </TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {t("noDataAvailable")}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.age} {t("years")}</TableCell>
                    <TableCell>{student.gender === 'M' ? t("boy") : t("girl")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-sm text-gray-500 flex justify-between items-center">
          <span>{t("showing")} {filteredStudents.length} {t("studentsOf")} {students.length}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>{t("previous")}</Button>
            <Button variant="outline" size="sm" disabled>{t("next")}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentList;
