import React from 'react';
import { ResumeData, StyleConfig, ThemePreset } from '../types';
import { Mail, Phone, Globe, MapPin, Calendar, ExternalLink, Award, BookOpen, Briefcase, Code, Compass, Languages } from 'lucide-react';

interface TemplateRendererProps {
  data: ResumeData;
  style: StyleConfig;
  templateId: ThemePreset;
}

export const TEMPLATE_PRESETS: { id: ThemePreset; name: string; description: string }[] = [
  { id: 'professional', name: 'Professional Corporate', description: 'Classic corporate style with centered title page layout for traditional industries.' },
  { id: 'modern', name: 'Modern Minimalist', description: 'Stylish left accent borders, modern typography spacing, and high impact design.' },
  { id: 'creative', name: 'Creative Designer', description: 'Splashes of bold geometric blocks, customizable margins, and editorial accent weights.' },
  { id: 'executive', name: 'Executive Elegance', description: 'Sophisticated traditional serif, customized margins, designed for senior leaders.' },
  { id: 'academic', name: 'Academic & CV', description: 'Clean, structured list layout optimized for research publications, teaching, and detail.' },
  { id: 'tech', name: 'Tech / Developer Mono', description: 'Monospacded and developer tags style inspired by Github profiles and tech cards.' },
  { id: 'bold', name: 'Bold Header Canvas', description: 'Striking colored banner top blocks carrying contact credentials for strong visual presence.' },
  { id: 'sidebar', name: 'Modern Split Sidebar', description: 'Two-column nested layouts splitting primary skills and corporate work profiles.' },
  { id: 'compact', name: 'Compact One-Page Plus', description: 'Highly optimized spatial scaling tailored to pack maximum experience on a single page.' },
  { id: 'minimal', name: 'Warm Editorial Luxe', description: 'Sophisticated typography pairing with thin separator systems and italics accents.' }
];

export default function TemplateRenderer({ data, style, templateId }: TemplateRendererProps) {
  // Map font config to css names
  const getFontFamilyClass = (font: string) => {
    switch (font) {
      case 'font-sans': return 'font-sans';
      case 'font-mono': return 'font-mono';
      case 'font-grotesk': return 'font-grotesk';
      case 'font-outfit': return 'font-outfit';
      case 'font-serif-lora': return 'font-serif-lora';
      case 'font-serif-playfair': return 'font-serif-playfair';
      case 'font-jakarta': return 'font-jakarta';
      default: return 'font-sans';
    }
  };

  const fontClass = getFontFamilyClass(style.fontFamily);

  // Map font sizing
  const getFontSizeClasses = (size: string) => {
    switch (size) {
      case 'xs':
        return {
          base: 'text-xs leading-relaxed',
          title: 'text-sm font-semibold',
          heading: 'text-lg font-bold',
          name: 'text-2xl font-extrabold',
          meta: 'text-[10px]'
        };
      case 'sm':
        return {
          base: 'text-[13px] leading-relaxed',
          title: 'text-[15px] font-semibold',
          heading: 'text-xl font-bold',
          name: 'text-3xl font-extrabold',
          meta: 'text-xs'
        };
      case 'lg':
        return {
          base: 'text-[15px] leading-relaxed',
          title: 'text-[17px] font-semibold',
          heading: 'text-3xl font-bold',
          name: 'text-5xl font-extrabold',
          meta: 'text-sm'
        };
      case 'md':
      default:
        return {
          base: 'text-sm leading-relaxed',
          title: 'text-base font-semibold',
          heading: 'text-2xl font-bold',
          name: 'text-4xl font-extrabold',
          meta: 'text-xs'
        };
    }
  };

  const textClasses = getFontSizeClasses(style.fontSize);

  // Advanced typography & size settings
  const fontSizeBase = style.customFontSizeVal || (style.fontSize === 'xs' ? 12 : style.fontSize === 'sm' ? 13 : style.fontSize === 'lg' ? 15 : 14);
  const customLineHeight = style.customLineHeightVal || (style.lineHeight === 'tight' ? 1.25 : style.lineHeight === 'relaxed' ? 1.75 : 1.5);
  
  const textStyles = {
    base: {
      fontSize: `${fontSizeBase}px`,
      lineHeight: `${customLineHeight}`,
      letterSpacing: style.letterSpacing === 'tighter' ? '-0.05em' : style.letterSpacing === 'tight' ? '-0.025em' : style.letterSpacing === 'wide' ? '0.025em' : style.letterSpacing === 'widest' ? '0.1em' : 'normal',
    },
    title: {
      fontSize: `${fontSizeBase + 2}px`,
      letterSpacing: style.letterSpacing === 'tighter' ? '-0.04em' : style.letterSpacing === 'tight' ? '-0.01em' : style.letterSpacing === 'wide' ? '0.01em' : style.letterSpacing === 'widest' ? '0.05em' : 'normal',
    },
    heading: {
      fontSize: `${fontSizeBase + 7}px`,
      letterSpacing: style.letterSpacing === 'tighter' ? '-0.03em' : style.letterSpacing === 'tight' ? '-0.01em' : style.letterSpacing === 'wide' ? '0.02em' : style.letterSpacing === 'widest' ? '0.08em' : 'normal',
    },
    name: {
      fontSize: `${fontSizeBase + 18}px`,
      letterSpacing: style.letterSpacing === 'tighter' ? '-0.04em' : style.letterSpacing === 'tight' ? '-0.02em' : style.letterSpacing === 'wide' ? '0.05em' : style.letterSpacing === 'widest' ? '0.12em' : 'normal',
    },
    meta: {
      fontSize: `${Math.max(10, fontSizeBase - 2)}px`,
    }
  };

  const getBulletGlyph = () => {
    switch (style.bulletStyle) {
      case 'circle': return '○';
      case 'square': return '■';
      case 'dash': return '—';
      case 'arrow': return '➔';
      case 'star': return '✦';
      case 'disc':
      default:
        return '•';
    }
  };

  const getBorderThicknessVal = () => {
    switch (style.borderThickness) {
      case 'none': return '0px';
      case 'thin': return '1px';
      case 'medium': return '2px';
      case 'thick': return '4px';
      default: return '1px';
    }
  };

  const getPaddingStyle = (classes: string) => {
    if (style.pagePaddingVal !== undefined) {
      return { padding: `${style.pagePaddingVal}px` };
    }
    return {};
  };

  // Spacing helper maps
  const getSpacingClass = (spacing: string) => {
    switch (spacing) {
      case 'compact':
        return {
          section: 'mb-3 pb-2',
          item: 'mb-2 pb-1',
          header: 'mb-3 pb-2',
          spacingUnit: 'gap-y-1',
          listGap: 'gap-1'
        };
      case 'generous':
        return {
          section: 'mb-8 pb-5',
          item: 'mb-6 pb-2',
          header: 'mb-8 pb-6',
          spacingUnit: 'gap-y-3',
          listGap: 'gap-3.5'
        };
      case 'normal':
      default:
        return {
          section: 'mb-5 pb-3',
          item: 'mb-4 pb-1.5',
          header: 'mb-5 pb-4',
          spacingUnit: 'gap-y-2',
          listGap: 'gap-2'
        };
    }
  };

  const spacing = getSpacingClass(style.sectionSpacing);

  // Photo Style helper
  const getPhotoStyleClass = (photoStyle: string) => {
    switch (photoStyle) {
      case 'square': return 'rounded-none';
      case 'rounded': return 'rounded-xl';
      case 'circle':
      default:
        return 'rounded-full';
    }
  };

  // Safe split items helper
  const parseBullets = (desc: string | string[]) => {
    if (Array.isArray(desc)) return desc;
    if (typeof desc === 'string') {
      return desc.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^-\s*/, ''));
    }
    return [];
  };

  // Hex opacity helper
  const getHexOpacity = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${percent})`;
  };

  // --- RENDERING INTERNAL SUB-COMPONENTS ---
  const renderSummaryBlock = () => {
    if (!data.personalInfo.summary) return null;
    return (
      <div className={`${spacing.section}`}>
        {renderSectionTitle('Professional Summary', <Compass className="w-4 h-4" />)}
        <p className={`${textClasses.base} text-justify`} style={{ color: style.textColor }}>
          {data.personalInfo.summary}
        </p>
      </div>
    );
  };

  const renderWorkBlock = () => {
    if (!data.workExperience || data.workExperience.length === 0) return null;
    return (
      <div className={`${spacing.section}`}>
        {renderSectionTitle('Professional Experience', <Briefcase className="w-4 h-4" />)}
        <div className={`flex flex-col ${spacing.spacingUnit}`}>
          {data.workExperience.map((exp) => (
            <div key={exp.id} className={`${spacing.item}`}>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                <div>
                  <h4 className={`${textClasses.title} font-bold`} style={{ color: style.primaryColor }}>
                    {exp.role}
                  </h4>
                  <span className={`${textClasses.base} font-medium tracking-wide opacity-90`} style={{ color: style.accentColor }}>
                    {exp.company}
                  </span>
                </div>
                <div className="text-right sm:text-right mt-0.5 sm:mt-0">
                  <span className={`${textClasses.meta} font-semibold flex items-center gap-1 sm:justify-end text-gray-500`}>
                    <Calendar className="w-3.5 h-3.5 inline" />
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                  {exp.location && (
                    <span className={`${textClasses.meta} block text-gray-400 mt-0.5`}>
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>
              <ul className="pl-1 mt-1.5 space-y-1 text-gray-600">
                {parseBullets(exp.description).map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2" style={textStyles.base}>
                    <span 
                      className="shrink-0 select-none opacity-85 font-sans font-bold" 
                      style={{ 
                        color: style.accentColor, 
                        fontSize: `${fontSizeBase - 1}px`, 
                        lineHeight: 'inherit' 
                      }}
                    >
                      {getBulletGlyph()}
                    </span>
                    <span style={{ color: style.textColor, lineHeight: 'inherit' }}>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationBlock = () => {
    if (!data.education || data.education.length === 0) return null;
    return (
      <div className={`${spacing.section}`}>
        {renderSectionTitle('Education', <BookOpen className="w-4 h-4" />)}
        <div className={`flex flex-col ${spacing.spacingUnit}`}>
          {data.education.map((edu) => (
            <div key={edu.id} className={`${spacing.item}`}>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                <div>
                  <h4 className={`${textClasses.title} font-bold`} style={{ color: style.primaryColor }}>
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </h4>
                  <span className={`${textClasses.base} font-medium`} style={{ color: style.accentColor }}>
                    {edu.institution}
                  </span>
                </div>
                <div className="text-right sm:text-right mt-0.5 sm:mt-0">
                  <span className={`${textClasses.meta} font-semibold text-gray-500`}>
                    {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                  </span>
                  {edu.location && (
                    <span className={`${textClasses.meta} block text-gray-400 mt-0.5`}>
                      {edu.location}
                    </span>
                  )}
                </div>
              </div>
              {(edu.gpa || edu.description) && (
                <div className="mt-1">
                  {edu.gpa && (
                    <span className={`${textClasses.base} font-semibold inline-block mr-3 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs`}>
                      GPA: {edu.gpa}
                    </span>
                  )}
                  {edu.description && (
                    <span className={`${textClasses.base} italic text-gray-500 block sm:inline`}>
                      {edu.description}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillsBlock = () => {
    if (!data.skills || data.skills.length === 0) return null;

    // Is it developer mono / tech view (pills) or elegant text lines?
    const isTech = templateId === 'tech' || templateId === 'modern';

    return (
      <div className={`${spacing.section}`}>
        {renderSectionTitle('Skills & Expertise', <Code className="w-4 h-4" />)}
        <div className={`flex flex-col ${spacing.listGap}`}>
          {data.skills.map((group) => (
            <div key={group.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
              <span className={`${textClasses.base} font-bold min-w-[120px] shrink-0 text-slate-800`} style={{ color: style.primaryColor }}>
                {group.category}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className={`${textClasses.base} px-2.5 py-0.5 rounded-md font-medium`}
                    style={{
                      backgroundColor: isTech ? getHexOpacity(style.accentColor, 0.08) : 'transparent',
                      color: isTech ? style.primaryColor : style.textColor,
                      border: isTech ? `1px solid ${getHexOpacity(style.accentColor, 0.2)}` : 'none',
                      paddingLeft: isTech ? '0.6rem' : '0',
                      paddingRight: isTech ? '0.6rem' : '0',
                    }}
                  >
                    {skill}{idx < group.skills.length - 1 && !isTech ? ',' : ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectsBlock = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <div className={`${spacing.section}`}>
        {renderSectionTitle('Projects', <Compass className="w-4 h-4" />)}
        <div className={`flex flex-col ${spacing.spacingUnit}`}>
          {data.projects.map((proj) => (
            <div key={proj.id} className={`${spacing.item}`}>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h4 className={`${textClasses.title} font-bold`} style={{ color: style.primaryColor }}>
                    {proj.name}
                  </h4>
                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 flex items-center gap-0.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 inline" />
                    </a>
                  )}
                </div>
                {(proj.startDate || proj.endDate) && (
                  <span className={`${textClasses.meta} font-semibold text-gray-500`}>
                    {proj.startDate && `${proj.startDate}`} {proj.endDate && `– ${proj.endDate}`}
                  </span>
                )}
              </div>
              <p className={`${textClasses.base} text-gray-600 mb-2`} style={{ color: style.textColor }}>
                {proj.description}
              </p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertificationsBlock = () => {
    if (!data.certifications || data.certifications.length === 0) return null;
    return (
      <div className={`${spacing.section}`}>
        {renderSectionTitle('Certifications', <Award className="w-4 h-4" />)}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {data.certifications.map((cert) => (
            <div key={cert.id} className="flex flex-col justify-start pb-1">
              <div className="flex items-start gap-1">
                <div className="mt-1 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.accentColor }} />
                </div>
                <div>
                  <h4 className={`${textClasses.base} font-bold`} style={{ color: style.primaryColor }}>
                    {cert.name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">{cert.issuer}</span>
                    {cert.date && <span className="text-[11px] text-gray-400">• {cert.date}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguagesBlock = () => {
    if (!data.languages || data.languages.length === 0) return null;
    return (
      <div className={`${spacing.section}`}>
        {renderSectionTitle('Languages', <Languages className="w-4 h-4" />)}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {data.languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-2">
              <span className={`${textClasses.base} font-bold`} style={{ color: style.primaryColor }}>
                {lang.name}
              </span>
              <span className="text-xs text-gray-500 border border-slate-200 px-2 py-0.5 rounded-full bg-slate-50">
                {lang.proficiency}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCustomSections = () => {
    if (!data.customSections || data.customSections.length === 0) return null;
    return (
      <>
        {data.customSections.map((sect) => (
          <div key={sect.id} className={`${spacing.section}`}>
            {renderSectionTitle(sect.title, <Award className="w-4 h-4" />)}
            <div className={`flex flex-col ${spacing.spacingUnit}`}>
              {sect.items.map((item) => (
                <div key={item.id} className={`${spacing.item}`}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <div>
                      <h4 className={`${textClasses.title} font-bold`} style={{ color: style.primaryColor }}>
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <span className={`${textClasses.base} font-medium`} style={{ color: style.accentColor }}>
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                    {item.date && (
                      <span className={`${textClasses.meta} font-semibold text-gray-500`}>
                        {item.date}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className={`${textClasses.base}`} style={{ color: style.textColor }}>
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  };

  // TITLE BAR SYSTEM
  const renderSectionTitle = (title: string, icon: React.ReactNode) => {
    const sectionHeaderCase = style.sectionHeaderCase || 'uppercase';
    const displayTitle = sectionHeaderCase === 'uppercase' 
      ? title.toUpperCase() 
      : sectionHeaderCase === 'capitalize' 
        ? title.split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()).join(' ') 
        : title;

    const thickVal = getBorderThicknessVal();

    // Elegant headings variation
    if (templateId === 'modern') {
      return (
        <div className="flex items-center gap-2 border-l-[3.5px] pl-3 mb-3.5" style={{ borderColor: style.accentColor }}>
          <h3 className={`${textClasses.title} font-bold tracking-wider`} style={{ ...textStyles.title, color: style.primaryColor }}>
            {displayTitle}
          </h3>
        </div>
      );
    }

    if (templateId === 'tech') {
      return (
        <div className="mb-3">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-sm opacity-60" style={{ color: style.accentColor }}>&lt;</span>
            <h3 className={`${textClasses.title} font-semibold tracking-wide`} style={{ ...textStyles.title, color: style.primaryColor }}>
              {displayTitle}
            </h3>
            <span className="text-sm opacity-60" style={{ color: style.accentColor }}>/&gt;</span>
          </div>
          {style.showDividers && style.borderThickness !== 'none' && <div className="w-full mt-1.5" style={{ height: thickVal, backgroundColor: getHexOpacity(style.primaryColor, 0.15) }} />}
        </div>
      );
    }

    if (templateId === 'executive') {
      return (
        <div className="text-center mb-4 font-serif-lora">
          <h3 className={`${textClasses.title} font-semibold italic tracking-wider`} style={{ ...textStyles.title, color: style.primaryColor }}>
            {displayTitle}
          </h3>
          {style.showDividers && style.borderThickness !== 'none' && (
            <div className="flex justify-center items-center gap-2 mt-1 opacity-40">
              <div className="w-12" style={{ height: thickVal, backgroundColor: style.primaryColor }} />
              <div className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: style.primaryColor }} />
              <div className="w-12" style={{ height: thickVal, backgroundColor: style.primaryColor }} />
            </div>
          )}
        </div>
      );
    }

    if (templateId === 'minimal') {
      return (
        <div className="mb-3.5">
          <h3 className={`${textClasses.title} font-medium tracking-widest text-xs`} style={{ ...textStyles.title, color: style.primaryColor }}>
            {displayTitle}
          </h3>
          {style.showDividers && style.borderThickness !== 'none' && <div className="w-full mt-1.5 bg-slate-200" style={{ height: thickVal }} />}
        </div>
      );
    }

    return (
      <div className="mb-4">
        <h3 className={`${textClasses.title} font-bold mr-2 tracking-wide flex items-center gap-2`} style={{ ...textStyles.title, color: style.primaryColor }}>
          {style.showPhoto ? null : <span className="opacity-70">{icon}</span>}
          {displayTitle}
        </h3>
        {style.showDividers && style.borderThickness !== 'none' && <div className="w-full mt-1.5" style={{ height: thickVal, backgroundColor: style.primaryColor }} />}
      </div>
    );
  };

  const renderSection = (secName: string) => {
    switch (secName) {
      case 'summary': return renderSummaryBlock();
      case 'work': return renderWorkBlock();
      case 'education': return renderEducationBlock();
      case 'skills': return renderSkillsBlock();
      case 'projects': return renderProjectsBlock();
      case 'certifications': return renderCertificationsBlock();
      case 'languages': return renderLanguagesBlock();
      case 'custom': return renderCustomSections();
      default: return null;
    }
  };

  // Standard Header Elements (Name, title, badges)
  const renderContactItem = (icon: React.ReactNode, value: string, link?: string) => {
    if (!value) return null;
    const body = (
      <span className="flex items-center gap-1 hover:opacity-100 transition-opacity">
        <span className="opacity-60">{icon}</span>
        <span>{value}</span>
      </span>
    );
    if (link) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:underline">
          {body}
        </a>
      );
    }
    return body;
  };

  // TIERED TEMPLATES DEFINITIONS
  // 1. PROFESSIONAL STANDARD
  const renderProfessionalTemplate = () => {
    return (
      <div className="p-8 sm:p-12" style={getPaddingStyle('p-8 sm:p-12')}>
        {/* Header Block Section */}
        <div className={`flex flex-col sm:flex-row items-center justify-between border-b pb-6 ${spacing.header}`}>
          <div className="text-center sm:text-left flex-1">
            <h1 className={`${textClasses.name}`} style={{ color: style.primaryColor }}>
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <h2 className={`${textClasses.title} font-medium tracking-wide mt-1`} style={{ color: style.accentColor }}>
              {data.personalInfo.jobTitle || 'Your Profession'}
            </h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-500">
              {renderContactItem(<Mail className="w-3.5 h-3.5" />, data.personalInfo.email, `mailto:${data.personalInfo.email}`)}
              {renderContactItem(<Phone className="w-3.5 h-3.5" />, data.personalInfo.phone, `tel:${data.personalInfo.phone}`)}
              {renderContactItem(<MapPin className="w-3.5 h-3.5" />, data.personalInfo.location)}
              {renderContactItem(<Globe className="w-3.5 h-3.5" />, data.personalInfo.website, data.personalInfo.website)}
            </div>
          </div>
          {style.showPhoto && data.personalInfo.photoUrl && (
            <div className="mt-4 sm:mt-0 sm:ml-6 shrink-0">
              <img
                src={data.personalInfo.photoUrl}
                alt={data.personalInfo.fullName}
                referrerPolicy="no-referrer"
                className={`w-28 h-28 object-cover border-4 border-slate-100 shadow-md ${getPhotoStyleClass(style.photoStyle)}`}
              />
            </div>
          )}
        </div>

        {/* Scalable Layout List */}
        <div className="flex flex-col">
          {style.sectionOrder.map((sectionName) => (
            <React.Fragment key={sectionName}>
              {renderSection(sectionName)}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // 2. MODERN MINIMALIST (Left accents)
  const renderModernTemplate = () => {
    return (
      <div className="p-8 sm:p-12" style={getPaddingStyle('p-8 sm:p-12')}>
        <div className={`flex flex-col md:flex-row justify-between mb-8 pb-4 ${spacing.header}`}>
          <div className="flex-1">
            <h1 className={`${textClasses.name} uppercase tracking-tight`} style={{ color: style.primaryColor }}>
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <h2 className={`${textClasses.title} tracking-wider font-semibold uppercase mt-1 text-slate-500`} style={{ color: style.accentColor }}>
              {data.personalInfo.jobTitle || 'Your Profession'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4 text-xs text-gray-500 max-w-4xl">
              {data.personalInfo.email && renderContactItem(<Mail className="w-3.5 h-3.5" />, data.personalInfo.email, `mailto:${data.personalInfo.email}`)}
              {data.personalInfo.phone && renderContactItem(<Phone className="w-3.5 h-3.5" />, data.personalInfo.phone, `tel:${data.personalInfo.phone}`)}
              {data.personalInfo.location && renderContactItem(<MapPin className="w-3.5 h-3.5" />, data.personalInfo.location)}
              {data.personalInfo.website && renderContactItem(<Globe className="w-3.5 h-3.5" />, data.personalInfo.website, data.personalInfo.website)}
            </div>
          </div>
          {style.showPhoto && data.personalInfo.photoUrl && (
            <div className="mt-4 md:mt-0 md:ml-4 shrink-0">
              <img
                src={data.personalInfo.photoUrl}
                alt={data.personalInfo.fullName}
                referrerPolicy="no-referrer"
                className={`w-24 h-24 object-cover ${getPhotoStyleClass(style.photoStyle)}`}
              />
            </div>
          )}
        </div>

        {style.sectionOrder.map((sectionName) => (
          <React.Fragment key={sectionName}>
            {renderSection(sectionName)}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // 3. CREATIVE DESIGNER (Geometric styling)
  const renderCreativeTemplate = () => {
    return (
      <div className="p-0">
        <div className="p-8 sm:p-12 text-white" style={{ backgroundColor: style.primaryColor }}>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div>
              <h1 className={`${textClasses.name} tracking-tight font-extrabold`}>
                {data.personalInfo.fullName || 'Your Name'}
              </h1>
              <span className="text-sm font-semibold max-w-max tracking-widest uppercase bg-white/15 px-3 py-1 rounded inline-block mt-2">
                {data.personalInfo.jobTitle || 'Your Profession'}
              </span>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 text-xs text-slate-200">
                {renderContactItem(<Mail className="w-3.5 h-3.5" />, data.personalInfo.email, `mailto:${data.personalInfo.email}`)}
                {renderContactItem(<Phone className="w-3.5 h-3.5" />, data.personalInfo.phone, `tel:${data.personalInfo.phone}`)}
                {renderContactItem(<MapPin className="w-3.5 h-3.5" />, data.personalInfo.location)}
                {renderContactItem(<Globe className="w-3.5 h-3.5" />, data.personalInfo.website, data.personalInfo.website)}
              </div>
            </div>
            {style.showPhoto && data.personalInfo.photoUrl && (
              <img
                src={data.personalInfo.photoUrl}
                alt={data.personalInfo.fullName}
                referrerPolicy="no-referrer"
                className={`w-28 h-28 object-cover border-4 border-white/20 shadow-xl ${getPhotoStyleClass(style.photoStyle)}`}
              />
            )}
          </div>
        </div>
        <div className="p-8 sm:p-12" style={getPaddingStyle('p-8 sm:p-12')}>
          {style.sectionOrder.map((sectionName) => (
            <React.Fragment key={sectionName}>
              {renderSection(sectionName)}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // 4. EXECUTIVE ELEGANCE (Traditional Serif editorial layout)
  const renderExecutiveTemplate = () => {
    return (
      <div className={`p-8 sm:p-12 font-serif-lora`} style={getPaddingStyle('p-8 sm:p-12 font-serif-lora')}>
        <div className="text-center flex flex-col items-center mb-8">
          <h1 className={`${textClasses.name} font-medium tracking-wide`} style={{ color: style.primaryColor }}>
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <h2 className="text-base tracking-widest uppercase text-slate-500 font-sans font-medium mt-1 mb-3">
            {data.personalInfo.jobTitle || 'Your Profession'}
          </h2>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-gray-500 font-sans border-t border-b py-2 w-full max-w-2xl">
            {data.personalInfo.email && renderContactItem(<Mail className="w-3.5 h-3.5" />, data.personalInfo.email, `mailto:${data.personalInfo.email}`)}
            {data.personalInfo.phone && renderContactItem(<Phone className="w-3.5 h-3.5" />, data.personalInfo.phone, `tel:${data.personalInfo.phone}`)}
            {data.personalInfo.location && renderContactItem(<MapPin className="w-3.5 h-3.5" />, data.personalInfo.location)}
            {data.personalInfo.website && renderContactItem(<Globe className="w-3.5 h-3.5" />, data.personalInfo.website, data.personalInfo.website)}
          </div>
          {style.showPhoto && data.personalInfo.photoUrl && (
            <img
              src={data.personalInfo.photoUrl}
              alt={data.personalInfo.fullName}
              referrerPolicy="no-referrer"
              className={`w-20 h-20 object-cover mt-4 outline outline-offset-4 outline-slate-200 ${getPhotoStyleClass(style.photoStyle)}`}
            />
          )}
        </div>

        <div>
          {style.sectionOrder.map((sectionName) => (
            <React.Fragment key={sectionName}>
              {renderSection(sectionName)}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // 5. ACADEMIC & CV (Pure structured layout)
  const renderAcademicTemplate = () => {
    return (
      <div className="p-8 sm:p-12" style={getPaddingStyle('p-8 sm:p-12')}>
        <div className="mb-8 border-b-2 pb-4">
          <h1 className={`${textClasses.name} font-extrabold`} style={{ color: style.primaryColor }}>
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-slate-500 text-sm mt-1 mb-3 font-semibold uppercase">{data.personalInfo.jobTitle || 'Your Profession'}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600 mt-2">
            <span><strong>Email:</strong> {data.personalInfo.email}</span>
            <span><strong>Phone:</strong> {data.personalInfo.phone}</span>
            {data.personalInfo.location && <span><strong>Address:</strong> {data.personalInfo.location}</span>}
            {data.personalInfo.website && <span><strong>Website:</strong> {data.personalInfo.website}</span>}
          </div>
        </div>

        {style.sectionOrder.map((sectionName) => (
          <React.Fragment key={sectionName}>
            {renderSection(sectionName)}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // 6. TECH / DEVELOPER MONO (Fira code details)
  const renderTechTemplate = () => {
    return (
      <div className="p-8 sm:p-12 font-mono" style={getPaddingStyle('p-8 sm:p-12 font-mono')}>
        <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
          <div className="flex items-center gap-1 text-xs text-blue-500 mb-1">
            <span>root</span>
            <span>@</span>
            <span>developer:~$</span>
          </div>
          <h1 className={`${textClasses.name} font-bold text-slate-800`} style={{ color: style.primaryColor }}>
            {data.personalInfo.fullName || 'Developer_Draft'}
          </h1>
          <h2 className="text-sm font-semibold text-slate-600 mt-1" style={{ color: style.accentColor }}>
            ./{data.personalInfo.jobTitle?.replace(/\s+/g, '_') || 'Profession'}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-[11px] text-slate-500 border-t border-slate-200/60 pt-3">
            {renderContactItem(<Mail className="w-3.5 h-3.5" />, data.personalInfo.email, `mailto:${data.personalInfo.email}`)}
            {renderContactItem(<Phone className="w-3.5 h-3.5" />, data.personalInfo.phone, `tel:${data.personalInfo.phone}`)}
            {renderContactItem(<MapPin className="w-3.5 h-3.5" />, data.personalInfo.location)}
            {renderContactItem(<Globe className="w-3.5 h-3.5" />, data.personalInfo.website, data.personalInfo.website)}
          </div>
        </div>

        {style.sectionOrder.map((sectionName) => (
          <React.Fragment key={sectionName}>
            {renderSection(sectionName)}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // 7. BOLD HEADER CANVAS (Solid corporate banner)
  const renderBoldTemplate = () => {
    return (
      <div className="p-0">
        <div className="bg-slate-900 text-white px-8 py-10 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-6" style={{ backgroundColor: style.primaryColor }}>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <h2 className="text-base font-semibold tracking-widest uppercase text-slate-300 mt-1" style={{ color: style.accentColor }}>
              {data.personalInfo.jobTitle || 'Your Profession'}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-4 text-slate-300">
              {renderContactItem(<Mail className="w-3.5 h-3.5" />, data.personalInfo.email)}
              {renderContactItem(<Phone className="w-3.5 h-3.5" />, data.personalInfo.phone)}
              {renderContactItem(<MapPin className="w-3.5 h-3.5" />, data.personalInfo.location)}
              {renderContactItem(<Globe className="w-3.5 h-3.5" />, data.personalInfo.website)}
            </div>
          </div>
          {style.showPhoto && data.personalInfo.photoUrl && (
            <img
              src={data.personalInfo.photoUrl}
              alt={data.personalInfo.fullName}
              referrerPolicy="no-referrer"
              className={`w-24 h-24 object-cover bg-white ring-4 ring-white/10 ${getPhotoStyleClass(style.photoStyle)}`}
            />
          )}
        </div>

        <div className="p-8 sm:p-12" style={getPaddingStyle('p-8 sm:p-12')}>
          {style.sectionOrder.map((sectionName) => (
            <React.Fragment key={sectionName}>
              {renderSection(sectionName)}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // 8. SPLIT SIDEBAR LAYOUT (Highly desired double columns)
  const renderSidebarTemplate = () => {
    // Collect specific sidebar elements
    const leftElements = ['skills', 'languages', 'certifications'];
    const rightElements = ['summary', 'work', 'education', 'projects', 'custom'];

    return (
      <div className="p-0 flex flex-col md:flex-row min-h-max align-stretch">
        {/* Left Column (Sidebar) */}
        <div className="w-full md:w-1/3 p-6 sm:p-8 shrink-0 text-white flex flex-col justify-between" style={{ backgroundColor: style.primaryColor }}>
          <div>
            {style.showPhoto && data.personalInfo.photoUrl && (
              <div className="mb-6 flex justify-center md:justify-start">
                <img
                  src={data.personalInfo.photoUrl}
                  alt={data.personalInfo.fullName}
                  referrerPolicy="no-referrer"
                  className={`w-28 h-28 object-cover border-2 border-white/20 shadow-md ${getPhotoStyleClass(style.photoStyle)}`}
                />
              </div>
            )}
            <h1 className="text-xl sm:text-2xl font-black leading-none uppercase">
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <p className="text-xs tracking-wider uppercase font-semibold text-slate-300 mt-1 mb-6">
              {data.personalInfo.jobTitle || 'Your Profession'}
            </p>

            {/* Profile connections details styled nicely for sidebar */}
            <div className="flex flex-col gap-3.5 pt-4 border-t border-white/10 text-xs text-slate-200">
              {data.personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-300 shrink-0" />
                  <span className="truncate">{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center gap-2 overflow-hidden">
                  <Globe className="w-4 h-4 text-slate-300 shrink-0" />
                  <span className="truncate">{data.personalInfo.website}</span>
                </div>
              )}
            </div>

            {/* Dynamic Left sidebar lists (Skills, Languages, Certifications) */}
            <div className="mt-8 space-y-6">
              {leftElements.map((sectionName) => (
                <div key={sectionName}>
                  {style.sectionOrder.includes(sectionName) && renderSection(sectionName)}
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-white/40 mt-8 pt-4 border-t border-white/5 font-mono">
            Generated via client builder
          </div>
        </div>

        {/* Right Column (Standard Content) */}
        <div className="flex-1 p-6 sm:p-10 bg-white" style={getPaddingStyle('p-6 sm:p-10 bg-white')}>
          <div className="space-y-6">
            {rightElements.map((sectionName) => (
              <div key={sectionName}>
                {style.sectionOrder.includes(sectionName) && renderSection(sectionName)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 9. COMPACT ONE-PAGE (Spatially density focused)
  const renderCompactTemplate = () => {
    return (
      <div className="p-4 sm:p-6 text-[12px] leading-tight" style={getPaddingStyle('p-4 sm:p-6 text-[12px] leading-tight')}>
        <div className={`flex flex-row justify-between items-center border-b pb-2 mb-3`}>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800" style={{ color: style.primaryColor }}>
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <h2 className="text-xs font-semibold uppercase tracking-wide" style={{ color: style.accentColor }}>
              {data.personalInfo.jobTitle || 'Your Profession'}
            </h2>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[10px] text-gray-500">
              {data.personalInfo.email && <span>Email: {data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>Phone: {data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>Location: {data.personalInfo.location}</span>}
              {data.personalInfo.website && <span>Site: {data.personalInfo.website}</span>}
            </div>
          </div>
          {style.showPhoto && data.personalInfo.photoUrl && (
            <img
              src={data.personalInfo.photoUrl}
              alt={data.personalInfo.fullName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 object-cover rounded-md"
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-y-2">
          {style.sectionOrder.map((sectionName) => (
            <React.Fragment key={sectionName}>
              {renderSection(sectionName)}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // 10. LUXE WARM EDITORIAL (Clean spacing aesthetic)
  const renderMinimalTemplate = () => {
    return (
      <div className="p-8 sm:p-12" style={getPaddingStyle('p-8 sm:p-12')}>
        <div className={`text-center mb-8 pb-4 border-b border-dashed border-slate-200`}>
          <h1 className="font-light tracking-[0.2em] uppercase text-xl sm:text-2xl text-slate-700" style={{ color: style.primaryColor }}>
            {data.personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-widest">{data.personalInfo.jobTitle || 'Your Profession'}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-[11px] text-slate-500 italic">
            <span>{data.personalInfo.email}</span>
            <span>•</span>
            <span>{data.personalInfo.phone}</span>
            {data.personalInfo.location && (
              <>
                <span>•</span>
                <span>{data.personalInfo.location}</span>
              </>
            )}
            {data.personalInfo.website && (
              <>
                <span>•</span>
                <span>{data.personalInfo.website}</span>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {style.sectionOrder.map((sectionName) => (
            <React.Fragment key={sectionName}>
              {renderSection(sectionName)}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Choose the render function
  const renderTemplateLayout = () => {
    switch (templateId) {
      case 'modern': return renderModernTemplate();
      case 'creative': return renderCreativeTemplate();
      case 'executive': return renderExecutiveTemplate();
      case 'academic': return renderAcademicTemplate();
      case 'tech': return renderTechTemplate();
      case 'bold': return renderBoldTemplate();
      case 'sidebar': return renderSidebarTemplate();
      case 'compact': return renderCompactTemplate();
      case 'minimal': return renderMinimalTemplate();
      case 'professional':
      default:
        return renderProfessionalTemplate();
    }
  };

  return (
    <div
      id="printable-resume"
      className={`print-area shadow-lg hover:shadow-xl transition-shadow bg-white ${fontClass} border border-slate-100 overflow-hidden text-left mx-auto`}
      style={{
        maxWidth: style.paperSize === 'letter' ? '816px' : '794px',
        minHeight: style.paperSize === 'letter' ? '1056px' : '1123px',
      }}
    >
      {renderTemplateLayout()}
    </div>
  );
}
