// src/utils/pdfGenerator.js
import { jsPDF } from "jspdf";

export const generatePDF = (lessonData) => {
  const doc = new jsPDF();
  
  // Set default font size and styles
  const titleSize = 16;
  const headingSize = 12;
  const textSize = 10;
  const lineHeight = 7;
  
  // Page margins
  const margin = 20;
  let yPosition = margin;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Helper function for wrapping text
  const addWrappedText = (text, x, y, maxWidth, fontSize, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont(undefined, fontStyle);
    
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    
    return y + (lines.length * (fontSize * 0.5)); // Return the new Y position
  };
  
  // Helper to add a section title
  const addSectionTitle = (title) => {
    yPosition += 5;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(headingSize);
    doc.text(title, margin, yPosition);
    yPosition += lineHeight;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(textSize);
  };
  
  // Add page title
  doc.setFontSize(titleSize);
  doc.setFont(undefined, 'bold');
  doc.text(`Lesson Plan: ${lessonData.topic}`, margin, yPosition);
  yPosition += lineHeight * 1.5;
  
  // Add grade level
  doc.setFontSize(textSize);
  doc.setFont(undefined, 'italic');
  doc.text(`Grade Level: ${lessonData.gradeLevel}`, margin, yPosition);
  yPosition += lineHeight * 1.5;
  
  // Add main concept
  addSectionTitle("Main Concept & Subtopics");
  yPosition = addWrappedText(
    lessonData.mainConcept,
    margin,
    yPosition,
    pageWidth - (margin * 2),
    textSize
  ) + lineHeight;
  
  // Add learning objectives
  if (lessonData.learningObjectives && lessonData.learningObjectives.length > 0) {
    addSectionTitle("Learning Objectives");
    lessonData.learningObjectives.forEach((objective, index) => {
      const bulletText = `${index + 1}. ${objective}`;
      yPosition = addWrappedText(
        bulletText,
        margin,
        yPosition,
        pageWidth - (margin * 2) - 5,
        textSize
      ) + (lineHeight * 0.7);
      
      if (yPosition > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPosition = margin;
      }
    });
    yPosition += lineHeight * 0.5;
  }
  
  // Add footer with date
  const today = new Date();
  const dateString = today.toLocaleDateString();
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${dateString}`, margin, doc.internal.pageSize.getHeight() - 10);
  
  // Save PDF
  doc.save(`Lesson_Plan_${lessonData.topic.replace(/\s+/g, '_')}.pdf`);
};
