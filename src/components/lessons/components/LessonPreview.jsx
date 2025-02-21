import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { toast, useToast } from "@/hooks/use-toast";
import { generatePDF } from "@/utils/pdfGenerator";


const LessonPreview = ({ lessonData, onEdit }) => {
  const toast = useToast();
  const [editedData, setEditedData] = useState({
    topic: lessonData?.topic || "",
    gradeLevel: lessonData?.gradeLevel || "",
    mainConcept: lessonData?.mainConcept || "",
    learningObjectives: Array.isArray(lessonData?.learningObjectives)
      ? lessonData.learningObjectives
      : [],
    materials: Array.isArray(lessonData?.materials) ? lessonData.materials : [],
  });

  const handleArrayChange = (section, index, value) => {
    setEditedData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSave = () => {
    onEdit(editedData);
    localStorage.setItem("lessons", JSON.stringify(editedData));
    toast({
      title: "Success",
      description: "Your changes have been saved.",
    });
  };

  const handleDownload = () => {
    generatePDF(editedData);
  };

  if (!lessonData) return <p>No lesson data available</p>;

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <CardHeader>
        <CardTitle>Lesson Plan Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible>
          <AccordionItem title="Learning Objectives">
            {editedData.learningObjectives?.map((obj, index) => (
              <Input
                key={index}
                value={obj}
                onChange={(e) =>
                  handleArrayChange("learningObjectives", index, e.target.value)
                }
              />
            ))}
          </AccordionItem>

          <AccordionItem title="Materials Needed">
            {editedData.materials?.map((mat, index) => (
              <Input
                key={index}
                value={mat}
                onChange={(e) =>
                  handleArrayChange("materials", index, e.target.value)
                }
              />
            ))}
          </AccordionItem>
        </Accordion>
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleSave}>
            Save
          </Button>
          <Button onClick={handleDownload}>Download PDF</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonPreview;
