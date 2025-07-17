import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { CourseDetail, Module } from "@/types/course";
import { courseDetails } from "@/data/courseData";

const LOGO_URL = "https://logoipsum.com/artwork/359";

// Type definitions for better type safety
type Color = [number, number, number];
type FontStyle = "normal" | "bold" | "italic" | "bolditalic";

// Configuration des couleurs modernes
const COLORS = {
  primary: [103, 11, 255] as Color, // #670BFF
  secondary: [147, 51, 234] as Color, // #9333EA
  accent: [59, 130, 246] as Color, // #3B82F6
  success: [34, 197, 94] as Color, // #22C55E
  warning: [245, 158, 11] as Color, // #F59E0B
  dark: [15, 23, 42] as Color, // #0F172A
  gray: [100, 116, 139] as Color, // #64748B
  lightGray: [241, 245, 249] as Color, // #F1F5F9
  white: [255, 255, 255] as Color,
  gradient: {
    start: [103, 11, 255] as Color,
    end: [147, 51, 234] as Color
  }
};

// Configuration moderne de la typographie
const FONTS = {
  heading: { family: "helvetica", weight: "bold" as FontStyle, size: 18 },
  subheading: { family: "helvetica", weight: "bold" as FontStyle, size: 14 },
  body: { family: "helvetica", weight: "normal" as FontStyle, size: 11 },
  small: { family: "helvetica", weight: "normal" as FontStyle, size: 9 },
  caption: { family: "helvetica", weight: "normal" as FontStyle, size: 8 }
};

// Espacements modernes
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24
};

function generateGenericModules(description: string): Module[] {
  const keywordsMatch = description.match(/avec\s+([\w\s,]+)(?:\.|$)/i);
  const keywords = keywordsMatch
    ? keywordsMatch[1].split(/,|et/).map(k => k.trim()).filter(k => k)
    : ["Compétences de base"];
  
  return [
    {
      number: 1,
      title: "Introduction au cours",
      duration: "60H",
      description: `Introduction aux concepts clés : ${keywords.join(", ")}.`,
      steps: keywords.map(k => `Apprentissage de ${k}`),
      tools: [{ src: "/img/icon-placeholder.svg", name: "Outils de base" }],
    },
    {
      number: 2,
      title: "Projets pratiques",
      duration: "60H",
      description: "Application des compétences dans des projets pratiques adaptés au contexte guinéen.",
      steps: ["Mise en œuvre des compétences dans des projets réels"],
      tools: [{ src: "/img/icon-placeholder.svg", name: "Outils de projet" }],
    },
  ];
}

class ModernPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private yPosition: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  private addGradientHeader(y: number, height: number) {
    const steps = 20;
    const stepHeight = height / steps;
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = COLORS.gradient.start[0] + (COLORS.gradient.end[0] - COLORS.gradient.start[0]) * ratio;
      const g = COLORS.gradient.start[1] + (COLORS.gradient.end[1] - COLORS.gradient.start[1]) * ratio;
      const b = COLORS.gradient.start[2] + (COLORS.gradient.end[2] - COLORS.gradient.start[2]) * ratio;
      
      this.doc.setFillColor(r, g, b);
      this.doc.rect(0, y + i * stepHeight, this.pageWidth, stepHeight, 'F');
    }
  }

  private addCard(x: number, y: number, width: number, height: number, content: () => void) {
    this.doc.setFillColor(0, 0, 0, 0.1);
    this.doc.roundedRect(x + 1, y + 1, width, height, 3, 3, 'F');
    
    this.doc.setFillColor(...COLORS.white);
    this.doc.setDrawColor(...COLORS.lightGray);
    this.doc.setLineWidth(0.5);
    this.doc.roundedRect(x, y, width, height, 3, 3, 'FD');
    
    content();
  }

  private addModernHeader(course: CourseDetail) {
    this.addGradientHeader(0, 60);
    this.addLogoAsync(15, 15);
    
    this.doc.setTextColor(...COLORS.white);
    this.doc.setFontSize(24);
    this.doc.setFont(FONTS.heading.family, FONTS.heading.weight);
    this.doc.text(course.title, this.pageWidth / 2, 35, { align: "center" });
    
    this.doc.setFontSize(12);
    this.doc.setFont(FONTS.body.family, FONTS.body.weight);
    this.doc.text("Programme de formation • GouloTech", this.pageWidth / 2, 45, { align: "center" });
    
    this.yPosition = 80;
  }

  private addModernTOC() {
    this.addSectionTitle("Table des matières");
    
    const tocItems = [
      { title: "Introduction", page: 2 },
      { title: "À propos du cours", page: 2 },
      { title: "Objectifs", page: 2 },
      { title: "Contenu détaillé", page: 3 },
      { title: "Méthodologie", page: 4 },
      { title: "Évaluation", page: 4 },
      { title: "Informations pratiques", page: 5 },
      { title: "Partenaires", page: 5 },
    ];

    this.addCard(this.margin, this.yPosition, this.pageWidth - 2 * this.margin, 120, () => {
      let cardY = this.yPosition + SPACING.md;
      
      tocItems.forEach((item) => {
        this.doc.setTextColor(...COLORS.dark);
        this.doc.setFontSize(11);
        this.doc.setFont(FONTS.body.family, FONTS.body.weight);
        this.doc.text(item.title, this.margin + SPACING.sm, cardY);
        
        this.doc.setDrawColor(...COLORS.lightGray);
        this.doc.setLineDashPattern([1, 2], 0);
        this.doc.line(this.margin + 80, cardY - 2, this.pageWidth - 50, cardY - 2);
        this.doc.setLineDashPattern([], 0);
        
        this.doc.setTextColor(...COLORS.primary);
        this.doc.setFont(FONTS.body.family, "bold");
        this.doc.text(`${item.page}`, this.pageWidth - 40, cardY);
        
        cardY += SPACING.md;
      });
    });
    
    this.yPosition += 140;
  }

  private addSectionTitle(title: string) {
    if (this.yPosition > this.pageHeight - 50) {
      this.addPage();
    }

    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(this.margin, this.yPosition - 2, 4, 16, 'F');
    
    this.doc.setTextColor(...COLORS.dark);
    this.doc.setFontSize(FONTS.heading.size);
    this.doc.setFont(FONTS.heading.family, FONTS.heading.weight);
    this.doc.text(title, this.margin + SPACING.sm, this.yPosition + SPACING.sm);
    
    this.doc.setDrawColor(...COLORS.lightGray);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin + 80, this.yPosition + SPACING.sm + 2, this.pageWidth - this.margin, this.yPosition + SPACING.sm + 2);
    
    this.yPosition += SPACING.xl;
  }

  private addContentSection(title: string, content: string | string[]) {
    this.addSectionTitle(title);
    
    if (Array.isArray(content)) {
      content.forEach((item, index) => {
        this.addBulletPoint(item, index === 0);
      });
    } else {
      this.addTextContent(content);
    }
    
    this.yPosition += SPACING.md;
  }

  private addBulletPoint(text: string, isFirst: boolean = false) {
    if (this.yPosition > this.pageHeight - 30) {
      this.addPage();
    }

    this.doc.setFillColor(...COLORS.accent);
    this.doc.circle(this.margin + 4, this.yPosition - 2, 1.5, 'F');
    
    this.doc.setTextColor(...COLORS.dark);
    this.doc.setFontSize(FONTS.body.size);
    this.doc.setFont(FONTS.body.family, FONTS.body.weight);
    
    const textLines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin - 15);
    this.doc.text(textLines, this.margin + SPACING.sm, this.yPosition);
    
    this.yPosition += textLines.length * 6 + SPACING.xs;
  }

  private addTextContent(text: string) {
    this.doc.setTextColor(...COLORS.dark);
    this.doc.setFontSize(FONTS.body.size);
    this.doc.setFont(FONTS.body.family, FONTS.body.weight);
    
    const textLines = this.doc.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    this.doc.text(textLines, this.margin, this.yPosition);
    
    this.yPosition += textLines.length * 6 + SPACING.sm;
  }

  private addModernModulesTable(modules: Module[]) {
    this.addSectionTitle("Modules de formation");

    // Vérifier si on a assez d'espace pour le tableau complet
    const estimatedTableHeight = 30 + (modules.length * 15); // En-tête + lignes
    const availableSpace = this.pageHeight - this.yPosition - 40; // 40 pour les marges
    
    if (estimatedTableHeight > availableSpace) {
      this.addPage();
    }

    const tableData = modules.map((module, index) => [
      `Module ${module.number}`,
      module.title,
      module.duration || "N/A",
      module.description || "Description non disponible"
    ]);

    autoTable(this.doc, {
      startY: this.yPosition,
      head: [['Module', 'Titre', 'Durée', 'Description']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: COLORS.primary,
        textColor: COLORS.white,
        fontStyle: 'bold',
        fontSize: 8,
        cellPadding: 4
      },
      bodyStyles: {
        textColor: COLORS.dark,
        fontSize: 7,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center' },
        1: { cellWidth: 40, fontStyle: 'bold' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 90 }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] as Color
      },
      tableLineColor: COLORS.lightGray,
      tableLineWidth: 0.3,
      margin: { left: this.margin, right: this.margin },
      tableWidth: 'wrap',
      pageBreak: 'avoid', // Évite de couper le tableau
      didDrawPage: (data) => {
        this.yPosition = data.cursor!.y + SPACING.md;
      }
    });
  }

  private addStatsCards(course: CourseDetail) {
    const stats = [
      { label: "Durée", value: course.title.includes("Bureautique") ? "6 semaines" : "10 semaines", color: COLORS.primary },
      { label: "Heures/semaine", value: "20h", color: COLORS.success },
      { label: "Participants", value: "Max 10", color: COLORS.warning },
      { label: "Certification", value: "Incluse", color: COLORS.accent }
    ];

    const cardWidth = (this.pageWidth - 2 * this.margin - 3 * SPACING.sm) / 4;
    const cardHeight = 35;
    
    stats.forEach((stat, index) => {
      const x = this.margin + index * (cardWidth + SPACING.sm);
      
      this.addCard(x, this.yPosition, cardWidth, cardHeight, () => {
        this.doc.setTextColor(...stat.color);
        this.doc.setFontSize(10);
        this.doc.setFont(FONTS.body.family, 'bold');
        this.doc.text(stat.value, x + cardWidth/2, this.yPosition + 15, { align: 'center' });
        
        this.doc.setTextColor(...COLORS.gray);
        this.doc.setFontSize(8);
        this.doc.setFont(FONTS.body.family, 'normal');
        this.doc.text(stat.label, x + cardWidth/2, this.yPosition + 25, { align: 'center' });
      });
    });
    
    this.yPosition += cardHeight + SPACING.lg;
  }

  private addModernFooter() {
    const footerY = this.pageHeight - 15;
    
    this.doc.setDrawColor(...COLORS.primary);
    this.doc.setLineWidth(2);
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);
    
    this.doc.setTextColor(...COLORS.gray);
    this.doc.setFontSize(FONTS.small.size);
    this.doc.setFont(FONTS.small.family, FONTS.small.weight);
    this.doc.text("GouloTech • Formation Tech de qualité en Guinée", this.margin, footerY);
    
    const pageNum = this.doc.getCurrentPageInfo().pageNumber;
    this.doc.text(`Page ${pageNum}`, this.pageWidth - this.margin, footerY, { align: 'right' });
  }

  private addPage() {
    this.doc.addPage();
    this.yPosition = this.margin;
    
    this.doc.setFillColor(...COLORS.primary);
    this.doc.rect(0, 0, this.pageWidth, 8, 'F');
    
    this.yPosition += SPACING.md;
  }

  private async addLogoAsync(x: number, y: number) {
    try {
      const logoData = await getImageAsBase64(LOGO_URL);
      this.doc.addImage(logoData, "PNG", x, y, 20, 20);
    } catch (err) {
      console.warn("Logo non chargé :", err);
      this.doc.setFillColor(...COLORS.white);
      this.doc.circle(x + 10, y + 10, 10, 'F');
      this.doc.setTextColor(...COLORS.primary);
      this.doc.setFontSize(16);
      this.doc.setFont("helvetica", "bold");
      this.doc.text("GT", x + 6, y + 14);
    }
  }

  public async generateCourse(course: CourseDetail) {
    this.addModernHeader(course);
    this.addModernTOC();
    this.addPage();
    
    this.addStatsCards(course);
    
    const introText = course.sectionContents.introduction?.description || course.description;
    this.addContentSection("Introduction", introText);
    
    const objectives = course.sectionContents.introduction?.items || [
      "Maîtriser les compétences clés décrites dans la description du cours",
      "Appliquer les connaissances à des projets pratiques adaptés au contexte guinéen",
      "Préparer les participants à des opportunités d'emploi ou à la création de startups tech"
    ];
    this.addContentSection("Objectifs du cours", objectives);
    
    const curriculumOverview = course.sectionContents.curriculum?.children as { overviewDescription?: string; modules?: Module[] } | undefined;
    const modules = curriculumOverview?.modules?.length ? curriculumOverview.modules : generateGenericModules(course.description);
    
    if (modules.length) {
      this.addModernModulesTable(modules);
    }
    
    const methodology = course.sectionContents.method?.items || [
      "Approche pratique : 70% du temps consacré à des exercices et projets pratiques",
      "Mentoring : Accompagnement personnalisé par des instructeurs expérimentés",
      "Projets réels : Collaboration sur des projets inspirés des besoins locaux",
      "Environnement collaboratif : Travail en équipe pour simuler des conditions professionnelles"
    ];
    this.addContentSection("Méthodologie", methodology);
    
    const evaluation = [
      "Projets : 50% (évaluation des projets individuels et de groupe)",
      "Exercices pratiques : 30% (soumissions régulières)",
      "Participation : 20% (engagement en classe et collaboration)"
    ];
    this.addContentSection("Évaluation", evaluation);
    
    const practicalInfo = course.sectionContents.financing?.items || [
      course.title.includes("Bureautique") 
        ? "Durée : 6 semaines, 20 heures par semaine" 
        : "Durée : 9 semaines, 20 heures par semaine",
      "Lieu : Conakry, Guinée (GouloTech Campus)",
      "Prérequis : Aucun prérequis technique, mais une motivation pour apprendre est essentielle",
      "Contact : info@goulotech.com | +224 622 123 456"
    ];
    this.addContentSection("Informations pratiques", practicalInfo);
    
    if (course.partners.length > 0) {
      this.addContentSection("Partenaires", course.partners.map(p => p.name));
    }
    
    this.doc.setTextColor(...COLORS.primary);
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.textWithLink("Voir le programme complet en ligne", this.margin, this.yPosition, {
      url: `https://goulotech.com/${course.key}`,
    });
    
    const totalPages = this.doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);
      this.addModernFooter();
    }
    
    return this.doc;
  }
}

export async function downloadCourseByTitle(title: string) {
  const course: CourseDetail | undefined = courseDetails.find(
    (c) => c.title.toLowerCase() === title.toLowerCase()
  );

  if (!course) {
    console.error("Cours non trouvé !");
    throw new Error("Cours non trouvé");
  }

  const generator = new ModernPDFGenerator();
  const doc = await generator.generateCourse(course);
  
  const filename = `${course.title.replace(/\s+/g, "_")}_Programme_Moderne.pdf`;
  doc.save(filename);
}

async function getImageAsBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur lors du chargement de l'image");
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject("Erreur de lecture de l'image");
        }
      };
      reader.onerror = () => reject("Erreur de lecture de l'image");
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    throw new Error(`Erreur lors du chargement de l'image : ${err}`);
  }
}