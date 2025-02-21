"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useGeminiAPI } from "@/hooks/useGeminiAPI";
import { useState } from "react";
import LessonPreview from "./LessonPreview";

const gradeOptions = [
  { value: "kindergarten", label: "Kindergarten" },
  { value: "grade1", label: "Grade 1" },
  { value: "grade2", label: "Grade 2" },
  { value: "grade3", label: "Grade 3" },
  { value: "grade4", label: "Grade 4" },
  { value: "grade5", label: "Grade 5" },
  { value: "grade6", label: "Grade 6" },
  { value: "grade7", label: "Grade 7" },
  { value: "grade8", label: "Grade 8" },
  { value: "grade9", label: "Grade 9" },
  { value: "grade10", label: "Grade 10" },
  { value: "grade11", label: "Grade 11" },
  { value: "grade12", label: "Grade 12" },
];

const LessonForm = () => {
  const [formData, setFormData] = useState({
    topic: "",
    gradeLevel: "",
    mainConcept: "",
    materials: [],
    learningObjectives: [],
  });

  const [activeTab, setActiveTab] = useState("form");
  const [lessonPreview, setLessonPreview] = useState(null);
  const { generateLessonPlan, loading, error } = useGeminiAPI();

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const generatedLesson = await generateLessonPlan(formData);
    if (generatedLesson) {
      setLessonPreview(generatedLesson);
      setActiveTab("preview");
    }
  };

  const handleEdit = (updatedData) => {
    setLessonPreview(updatedData);
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-col items-center justify-center flex-grow px-4 py-10">
        <Card className="w-full max-w-4xl shadow-md rounded-xl p-6">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">
              Create New Lesson Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="form"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex space-x-4 border-b pb-2">
                <TabsTrigger value="form">Form Input</TabsTrigger>
                <TabsTrigger value="preview" disabled={!lessonPreview}>
                  Preview & Edit
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Enter topic (e.g., Photosynthesis)"
                    value={formData.topic}
                    onChange={(e) => handleChange("topic", e.target.value)}
                    required
                  />
                  <Select
                    onValueChange={(value) => handleChange("gradeLevel", value)}
                    defaultValue={formData.gradeLevel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Describe main concept and subtopics"
                    value={formData.mainConcept}
                    onChange={(e) => handleChange("mainConcept", e.target.value)}
                    rows={4}
                    required
                  />
                  <Button type="submit" className="w-full">
                    {loading ? "Generating..." : "Generate Lesson Plan"}
                  </Button>
                </form>
                {error && (
                  <p className="text-red-500 text-sm mt-2">Error: {error}</p>
                )}
              </TabsContent>

              <TabsContent value="preview">
                <LessonPreview lessonData={lessonPreview} onEdit={handleEdit} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonForm;
