
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CVData, CoverLetter } from "../types";

export const tailorCV = async (originalCV: string, jobDescription: string): Promise<CVData> => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          linkedin: { type: "string" },
          summary: { 
            type: "string", 
            description: "A tailored professional summary targeting the specific role." 
          },
          experience: {
            type: "array",
            items: {
              type: "object",
              properties: {
                company: { type: "string" },
                role: { type: "string" },
                duration: { type: "string" },
                description: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "Tailored bullet points emphasizing relevant achievements."
                }
              },
              required: ["company", "role", "duration", "description"]
            }
          },
          education: {
            type: "array",
            items: {
              type: "object",
              properties: {
                institution: { type: "string" },
                degree: { type: "string" },
                graduationYear: { type: "string" }
              },
              required: ["institution", "degree", "graduationYear"]
            }
          },
          skills: {
            type: "array",
            items: { type: "string" },
            description: "A list of relevant skills found in the job description."
          }
        },
        required: ["fullName", "email", "phone", "summary", "experience", "education", "skills"]
      }
    }
  });

  const prompt = `
You are a world-class professional CV writer and career coach. 
Below is an original CV and a Job Description. 
Your task is to rewrite and tailor the CV to perfectly match the job requirements.

CRITICAL REQUIREMENTS:
1. **JOB TITLES (role field)**: MUST adapt job titles to align with the target role. If the job seeks "Full Stack Developer", transform previous titles like "Software Engineer" or "Developer" to "Full Stack Developer" or similar matching titles. Find a middle ground between the candidate's actual role and the desired position - be creative but truthful.

2. **JOB DESCRIPTIONS**: Completely rewrite the bullet points for each position to emphasize experiences and achievements that are DIRECTLY relevant to the job description. Add keywords from the job posting. Remove or minimize irrelevant details. Make it seem like the candidate's past work was perfectly aligned with this new role.

3. **SKILLS SECTION**: Extract ALL technical skills, tools, technologies, and methodologies mentioned in the job description and add them to the skills list. If the job requires Python, Docker, Agile, etc. - these MUST appear in the skills section. Combine them with the candidate's existing skills.

4. **DURATION & DATES**: If the original CV has incomplete date information (e.g., only start year without end year, or missing months), use ONLY the available information. Write "2021" instead of "2021 - Present" or "2021 - NA". 
   - For education graduationYear: If unknown or missing, write an empty string "" - NEVER write "NA", "Unknown", or similar.
   - For experience duration: Use only available information (e.g., "2021", "2020-2022").
   - NEVER use "NA" anywhere in the CV.

5. **PROFESSIONAL SUMMARY**: Rewrite to directly address the job requirements and highlight matching qualifications.

6. **LANGUAGE**: The output MUST be in the same language as the input CV (Hebrew or English).

Original CV:
${originalCV}

Job Description:
${jobDescription}

Please provide the fully tailored CV in the required JSON structure.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  if (!text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(text.trim()) as CVData;
};

export const refineTailoredCV = async (currentCV: CVData, userFeedback: string): Promise<CVData> => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          fullName: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          linkedin: { type: "string" },
          summary: { type: "string" },
          experience: {
            type: "array",
            items: {
              type: "object",
              properties: {
                company: { type: "string" },
                role: { type: "string" },
                duration: { type: "string" },
                description: { 
                  type: "array", 
                  items: { type: "string" }
                }
              },
              required: ["company", "role", "duration", "description"]
            }
          },
          education: {
            type: "array",
            items: {
              type: "object",
              properties: {
                institution: { type: "string" },
                degree: { type: "string" },
                graduationYear: { type: "string" }
              },
              required: ["institution", "degree", "graduationYear"]
            }
          },
          skills: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["fullName", "email", "phone", "summary", "experience", "education", "skills"]
      }
    }
  });

  const prompt = `
You are a professional CV editor. Below is a tailored CV and user feedback on what they want to change or improve.

Current CV (JSON):
${JSON.stringify(currentCV, null, 2)}

User Feedback:
${userFeedback}

Please modify the CV according to the user's feedback. Make the requested changes precisely while maintaining the overall quality and structure. NEVER use "NA" in any field.

The output MUST be in the same language as the current CV.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  if (!text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(text.trim()) as CVData;
};

export const generateCoverLetter = async (cvData: CVData, jobDescription: string): Promise<CoverLetter> => {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          content: { 
            type: "string",
            description: "A professional cover letter tailored to the job description"
          }
        },
        required: ["content"]
      }
    }
  });

  const prompt = `
You are an expert cover letter writer. Based on the CV data and job description below, write a compelling, professional cover letter.

The cover letter should:
1. Be addressed professionally (use generic greeting if company name isn't clear)
2. Highlight the candidate's most relevant skills and experiences for this specific role
3. Show enthusiasm for the position
4. Be concise (3-4 paragraphs)
5. Match the language of the CV and job description (Hebrew or English)
6. Include proper spacing between paragraphs (use \\n\\n)

CV Data:
Name: ${cvData.fullName}
Email: ${cvData.email}
Phone: ${cvData.phone}
Summary: ${cvData.summary}
Skills: ${cvData.skills.join(', ')}
Experience: ${cvData.experience.map(exp => `${exp.role} at ${exp.company}: ${exp.description.join('; ')}`).join(' | ')}

Job Description:
${jobDescription}

Please provide a professional cover letter in JSON format.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  if (!text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(text.trim()) as CoverLetter;
};
