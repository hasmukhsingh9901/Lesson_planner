import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

export const useGeminiAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateLessonPlan = async (lessonData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Access the model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      // Create the prompt
      const prompt = `
        Create a structured lesson plan with the following information:
        Topic: ${lessonData.topic}
        Grade Level: ${lessonData.gradeLevel}
        Main Concept: ${lessonData.mainConcept}
        
        Please structure the response in the following format:
        
        ## Learning Objectives
        - Objective 1
        - Objective 2
        - Objective 3
        
        ## Materials Needed
        - Material 1
        - Material 2
        - Material 3
        
        ## Lesson Outline
        
        ### Introduction (5-7 minutes)
        [Detailed introduction content]
        
        ### Main Activities (20-30 minutes)
        [Detailed main activities content]
        
        ### Conclusion (5-10 minutes)
        [Detailed conclusion content]
        
        ## Assessment Methods
        - Assessment 1
        - Assessment 2
        
        ## Extensions/Homework
        - Extension 1
        - Extension 2
        
        Make the lesson plan appropriate for the given grade level and engaging for students.
      `;

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response
      return parseGeminiResponse(text);
    } catch (err) {
      console.error("Error generating lesson plan:", err);
      setError(err.message || "Failed to generate lesson plan");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const parseGeminiResponse = (text) => {
    const sections = {
      learningObjectives: [],
      materials: [],
      lessonOutline: {
        introduction: [],
        mainActivities: [],
        conclusion: []
      },
      assessment: [],
      extensions: []
    };
    
    // Split by sections
    const lines = text.split('\n');
    let currentMainSection = null;
    let currentSubSection = null;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return;
      
      // Identify main sections
      if (trimmedLine.startsWith('## Learning Objectives')) {
        currentMainSection = 'learningObjectives';
        currentSubSection = null;
      } else if (trimmedLine.startsWith('## Materials Needed')) {
        currentMainSection = 'materials';
        currentSubSection = null;
      } else if (trimmedLine.startsWith('## Lesson Outline')) {
        currentMainSection = 'lessonOutline';
        currentSubSection = null;
      } else if (trimmedLine.startsWith('### Introduction')) {
        currentMainSection = 'lessonOutline';
        currentSubSection = 'introduction';
      } else if (trimmedLine.startsWith('### Main Activities')) {
        currentMainSection = 'lessonOutline';
        currentSubSection = 'mainActivities';
      } else if (trimmedLine.startsWith('### Conclusion')) {
        currentMainSection = 'lessonOutline';
        currentSubSection = 'conclusion';
      } else if (trimmedLine.startsWith('## Assessment Methods')) {
        currentMainSection = 'assessment';
        currentSubSection = null;
      } else if (trimmedLine.startsWith('## Extensions/Homework')) {
        currentMainSection = 'extensions';
        currentSubSection = null;
      } 
      
      else if (trimmedLine.startsWith('- ') && currentMainSection) {
        const content = trimmedLine.substring(2);
        if (currentMainSection === 'lessonOutline' && currentSubSection) {
          sections[currentMainSection][currentSubSection].push(content);
        } else if (currentMainSection !== 'lessonOutline') {
          sections[currentMainSection].push(content);
        }
      }
      
      else if (currentMainSection === 'lessonOutline' && currentSubSection && 
               !trimmedLine.startsWith('#') && !trimmedLine.startsWith('- ')) {
        sections[currentMainSection][currentSubSection].push(trimmedLine);
      }
    });
    
    return sections;
  };

  return { generateLessonPlan, loading, error };
};