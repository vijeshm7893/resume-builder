export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  photoUrl: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[]; // Bullet points
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
  description: string;
}

export interface SkillGroup {
  id: string;
  category: string; // e.g., "Languages", "Backend"
  skills: string[]; // List of skills
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  startDate: string;
  endDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // "Native", "Fluent", "Conversational", etc.
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  id: string;
  title: string; // Resume version/title for local list management (e.g., "Software Engineer Resume")
  updatedAt: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  customSections: CustomSection[];
}

export type ThemePreset = 'professional' | 'modern' | 'creative' | 'executive' | 'academic' | 'tech' | 'minimal' | 'bold' | 'sidebar' | 'compact';

export interface StyleConfig {
  fontFamily: string; // "sans" | "serif" | "mono" | "grotesk" | "outfit" | "lora" | "merriweather"
  primaryColor: string; // hex code
  textColor: string; // hex code
  accentColor: string; // hex code
  fontSize: 'xs' | 'sm' | 'md' | 'lg'; // Font text sizing base
  lineHeight: 'tight' | 'normal' | 'relaxed';
  sectionSpacing: 'compact' | 'normal' | 'generous';
  paperSize: 'letter' | 'a4';
  showPhoto: boolean;
  photoStyle: 'circle' | 'square' | 'rounded';
  showDividers: boolean;
  sectionOrder: string[]; // e.g., ['summary', 'work', 'education', 'skills', 'projects', 'certifications', 'languages', 'custom']
  
  // Advanced Customizer extensions requested by user
  customFontSizeVal?: number; // fine scale font size slider (e.g. 10 to 20 px)
  letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'widest';
  bulletStyle?: 'disc' | 'circle' | 'square' | 'dash' | 'arrow' | 'star';
  sectionHeaderCase?: 'uppercase' | 'capitalize' | 'normal';
  borderThickness?: 'thin' | 'medium' | 'thick' | 'none';
  pagePaddingVal?: number; // custom page padding padding slider (e.g. 15 to 60 px)
  customLineHeightVal?: number; // custom line height multiplier slider (e.g. 1.0 to 2.2)
}

export interface ResumeTemplate {
  id: ThemePreset;
  name: string;
  description: string;
  icon: string; // Lucide icon name or visual icon representation
  defaultStyle: StyleConfig;
}
