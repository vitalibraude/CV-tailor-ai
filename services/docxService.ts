
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import saveAs from "file-saver";
import { CVData, CoverLetter } from "../types";

export const generateWordDoc = async (data: CVData, additionalText: string = "", textColor: string = "#000000") => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: data.fullName, bold: true, size: 32 }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${data.email} | ${data.phone}${data.linkedin ? ` | ${data.linkedin}` : ""}`, size: 20 }),
            ],
          }),
          new Paragraph({ text: "", spacing: { before: 200 } }),

          // Professional Summary
          new Paragraph({ text: "Professional Summary", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.summary, spacing: { after: 200 } }),

          // Experience
          new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2 }),
          ...data.experience.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.company, bold: true }),
                new TextRun({ text: ` - ${exp.role}`, italics: true }),
              ],
            }),
            new Paragraph({
              children: [new TextRun({ text: exp.duration, size: 18, color: "666666" })],
              spacing: { after: 100 },
            }),
            ...exp.description.map((bullet) => (
              new Paragraph({
                text: bullet,
                bullet: { level: 0 },
              })
            )),
            new Paragraph({ text: "", spacing: { before: 100 } }),
          ]),

          // Skills
          new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({
            children: [new TextRun({ text: data.skills.join(", ") })],
            spacing: { after: 200 },
          }),

          // Education
          new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
          ...data.education.map((edu) => (
            new Paragraph({
              children: [
                new TextRun({ text: `${edu.degree}, ${edu.institution}`, bold: true }),
                new TextRun({ text: ` (${edu.graduationYear})`, size: 18 }),
              ],
            })
          )),

          // Additional Text (if provided)
          ...(additionalText.trim() ? [
            new Paragraph({ text: "", spacing: { before: 400 } }),
            new Paragraph({
              children: [new TextRun({ 
                text: additionalText, 
                size: 18,
                color: textColor.replace('#', '')
              })],
            }),
          ] : []),
        ],
      },
    ],
  });

  try {
    const blob = await Packer.toBlob(doc);
    // file-saver's default export is usually the saveAs function in ESM environments
    const saver = (saveAs as any).saveAs || saveAs;
    saver(blob, `CV_${data.fullName.replace(/\s+/g, "_")}.docx`);
  } catch (error) {
    console.error("Error generating or saving document:", error);
    throw error;
  }
};

export const generateCoverLetterDoc = async (coverLetter: CoverLetter, fullName: string) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Cover Letter", bold: true, size: 32 }),
            ],
            spacing: { after: 400 },
          }),
          
          // Split content by paragraphs and create proper spacing
          ...coverLetter.content.split('\n\n').map(paragraph => 
            new Paragraph({
              text: paragraph.trim(),
              spacing: { after: 200 },
              alignment: AlignmentType.LEFT,
            })
          ),
        ],
      },
    ],
  });

  try {
    const blob = await Packer.toBlob(doc);
    const saver = (saveAs as any).saveAs || saveAs;
    saver(blob, `CoverLetter_${fullName.replace(/\s+/g, "_")}.docx`);
  } catch (error) {
    console.error("Error generating or saving cover letter:", error);
    throw error;
  }
};
