import { ResumeData, WorkExperience, Education, SkillGroup, Project, Certification, Language, CustomSection, CustomSectionItem } from '../types';
import { Plus, Trash, ChevronDown, ChevronUp, User, Briefcase, GraduationCap, Code, Compass, Award, Globe, Layers, ArrowUp, ArrowDown } from 'lucide-react';
import React, { useState } from 'react';

interface ResumeFormProps {
  data: ResumeData;
  onChangeData: (data: ResumeData) => void;
}

export default function ResumeForm({ data, onChangeData }: ResumeFormProps) {
  // Tabs active state
  type FormTab = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'custom';
  const [activeTab, setActiveTab] = useState<FormTab>('personal');

  // Open status of individual list card panels
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});

  // Trigger helper for deep changes
  const updateData = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    onChangeData({
      ...data,
      updatedAt: new Date().toISOString(),
      [key]: value
    });
  };

  const toggleCard = (id: string) => {
    setOpenCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- 1. PERSONAL INFO SYNC ---
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChangeData({
      ...data,
      updatedAt: new Date().toISOString(),
      personalInfo: {
        ...data.personalInfo,
        [name]: value
      }
    });
  };

  // --- 2. WORK EXPERIENCE HELPERS ---
  const addWork = () => {
    const newWork: WorkExperience = {
      id: `w-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: []
    };
    const updated = [...(data.workExperience || []), newWork];
    updateData('workExperience', updated);
    setOpenCards(prev => ({ ...prev, [newWork.id]: true }));
  };

  const deleteWork = (id: string) => {
    const updated = data.workExperience.filter(w => w.id !== id);
    updateData('workExperience', updated);
  };

  const updateWorkItem = (id: string, fields: Partial<WorkExperience>) => {
    const updated = data.workExperience.map(w => {
      if (w.id === id) {
        return { ...w, ...fields };
      }
      return w;
    });
    updateData('workExperience', updated);
  };

  const moveWork = (idx: number, direction: 'up' | 'down') => {
    const list = [...data.workExperience];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    updateData('workExperience', list);
  };

  // --- 3. EDUCATION HELPERS ---
  const addEducation = () => {
    const newEdu: Education = {
      id: `e-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: ''
    };
    const updated = [...(data.education || []), newEdu];
    updateData('education', updated);
    setOpenCards(prev => ({ ...prev, [newEdu.id]: true }));
  };

  const deleteEducation = (id: string) => {
    const updated = data.education.filter(e => e.id !== id);
    updateData('education', updated);
  };

  const updateEducationItem = (id: string, fields: Partial<Education>) => {
    const updated = data.education.map(e => {
      if (e.id === id) {
        return { ...e, ...fields };
      }
      return e;
    });
    updateData('education', updated);
  };

  const moveEducation = (idx: number, direction: 'up' | 'down') => {
    const list = [...data.education];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    updateData('education', list);
  };

  // --- 4. SKILL GROUPS HELPERS ---
  const addSkillGroup = () => {
    const newGroup: SkillGroup = {
      id: `sg-${Date.now()}`,
      category: '',
      skills: []
    };
    const updated = [...(data.skills || []), newGroup];
    updateData('skills', updated);
    setOpenCards(prev => ({ ...prev, [newGroup.id]: true }));
  };

  const deleteSkillGroup = (id: string) => {
    const updated = data.skills.filter(sg => sg.id !== id);
    updateData('skills', updated);
  };

  const updateSkillGroupItem = (id: string, category: string, rawSkillsString: string) => {
    const list = rawSkillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const updated = data.skills.map(sg => {
      if (sg.id === id) {
        return { ...sg, category, skills: list };
      }
      return sg;
    });
    updateData('skills', updated);
  };

  const moveSkillGroup = (idx: number, direction: 'up' | 'down') => {
    const list = [...data.skills];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    updateData('skills', list);
  };

  // --- 5. PROJECTS HELPERS ---
  const addProject = () => {
    const newProj: Project = {
      id: `p-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: ''
    };
    const updated = [...(data.projects || []), newProj];
    updateData('projects', updated);
    setOpenCards(prev => ({ ...prev, [newProj.id]: true }));
  };

  const deleteProject = (id: string) => {
    const updated = data.projects.filter(p => p.id !== id);
    updateData('projects', updated);
  };

  const updateProjectItem = (id: string, fields: Partial<Project> & { rawTech?: string }) => {
    const updated = data.projects.map(p => {
      if (p.id === id) {
        const base = { ...p, ...fields };
        if (fields.rawTech !== undefined) {
          base.technologies = fields.rawTech.split(',').map(t => t.trim()).filter(t => t.length > 0);
        }
        return base;
      }
      return p;
    });
    updateData('projects', updated);
  };

  const moveProject = (idx: number, direction: 'up' | 'down') => {
    const list = [...data.projects];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    updateData('projects', list);
  };

  // --- 6. CERTIFICATIONS HELPERS ---
  const addCertification = () => {
    const newCert: Certification = {
      id: `c-${Date.now()}`,
      name: '',
      issuer: '',
      date: '',
      url: ''
    };
    const updated = [...(data.certifications || []), newCert];
    updateData('certifications', updated);
    setOpenCards(prev => ({ ...prev, [newCert.id]: true }));
  };

  const deleteCertification = (id: string) => {
    const updated = data.certifications.filter(c => c.id !== id);
    updateData('certifications', updated);
  };

  const updateCertificationItem = (id: string, fields: Partial<Certification>) => {
    const updated = data.certifications.map(c => {
      if (c.id === id) return { ...c, ...fields };
      return c;
    });
    updateData('certifications', updated);
  };

  const moveCertification = (idx: number, direction: 'up' | 'down') => {
    const list = [...data.certifications];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    updateData('certifications', list);
  };

  // --- 7. LANGUAGES HELPERS ---
  const addLanguage = () => {
    const newLang: Language = {
      id: `l-${Date.now()}`,
      name: '',
      proficiency: 'Native / Bilingual'
    };
    const updated = [...(data.languages || []), newLang];
    updateData('languages', updated);
    setOpenCards(prev => ({ ...prev, [newLang.id]: true }));
  };

  const deleteLanguage = (id: string) => {
    const updated = data.languages.filter(l => l.id !== id);
    updateData('languages', updated);
  };

  const updateLanguageItem = (id: string, fields: Partial<Language>) => {
    const updated = data.languages.map(l => {
      if (l.id === id) return { ...l, ...fields };
      return l;
    });
    updateData('languages', updated);
  };

  const moveLanguage = (idx: number, direction: 'up' | 'down') => {
    const list = [...data.languages];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    updateData('languages', list);
  };

  // --- 8. CUSTOM SECTION HELPERS ---
  const addCustomSection = () => {
    const newSect: CustomSection = {
      id: `cs-${Date.now()}`,
      title: 'Volunteer Experience',
      items: []
    };
    const updated = [...(data.customSections || []), newSect];
    updateData('customSections', updated);
    setOpenCards(prev => ({ ...prev, [newSect.id]: true }));
  };

  const deleteCustomSection = (id: string) => {
    const updated = data.customSections.filter(cs => cs.id !== id);
    updateData('customSections', updated);
  };

  const updateCustomSectionTitle = (id: string, title: string) => {
    const updated = data.customSections.map(cs => {
      if (cs.id === id) return { ...cs, title };
      return cs;
    });
    updateData('customSections', updated);
  };

  const addCustomItem = (sectId: string) => {
    const newItem: CustomSectionItem = {
      id: `csi-${Date.now()}`,
      title: '',
      subtitle: '',
      date: '',
      description: ''
    };
    const updated = data.customSections.map(cs => {
      if (cs.id === sectId) {
        return { ...cs, items: [...(cs.items || []), newItem] };
      }
      return cs;
    });
    updateData('customSections', updated);
    setOpenCards(prev => ({ ...prev, [newItem.id]: true }));
  };

  const deleteCustomItem = (sectId: string, itemId: string) => {
    const updated = data.customSections.map(cs => {
      if (cs.id === sectId) {
        return { ...cs, items: cs.items.filter(item => item.id !== itemId) };
      }
      return cs;
    });
    updateData('customSections', updated);
  };

  const updateCustomItemFields = (sectId: string, itemId: string, fields: Partial<CustomSectionItem>) => {
    const updated = data.customSections.map(cs => {
      if (cs.id === sectId) {
        return {
          ...cs,
          items: cs.items.map(item => {
            if (item.id === itemId) return { ...item, ...fields };
            return item;
          })
        };
      }
      return cs;
    });
    updateData('customSections', updated);
  };


  // --- FORM INPUT COMPONENT WRAPPER CLASS ---
  const formInput = (name: string, label: string, val: string, handle: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder = '') => (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
      <input
        type="text"
        name={name}
        value={val || ''}
        placeholder={placeholder}
        onChange={handle}
        className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-base sm:text-sm border border-slate-200 focus:border-indigo-500 rounded-lg p-3 sm:p-2.5 outline-none transition-colors"
      />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* LEFT NAVIGATION COLUMN */}
      <div className="w-full md:w-56 shrink-0 md:border-r border-slate-200/60 p-2 md:p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible no-scrollbar md:sticky md:top-0 bg-white md:bg-transparent border-b md:border-b-0 border-slate-100">
        {[
          { id: 'personal', name: 'Profile', icon: <User className="w-4 h-4" /> },
          { id: 'experience', name: 'Work', icon: <Briefcase className="w-4 h-4" /> },
          { id: 'education', name: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'skills', name: 'Skills', icon: <Code className="w-4 h-4" /> },
          { id: 'projects', name: 'Projects', icon: <Compass className="w-4 h-4" /> },
          { id: 'certifications', name: 'Credentials', icon: <Award className="w-4 h-4" /> },
          { id: 'languages', name: 'Languages', icon: <Globe className="w-4 h-4" /> },
          { id: 'custom', name: 'Custom', icon: <Layers className="w-4 h-4" /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FormTab)}
              className={`flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100/80 active:scale-95'
              }`}
            >
              <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* RIGHT FIELDS GRID */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
        
        {/* TAB 1: PERSONAL INFORMATION */}
        {activeTab === 'personal' && (
          <div className="flex flex-col gap-5">
            <div className="border-b border-slate-200/60 pb-3">
              <h3 className="text-base font-bold text-slate-800">Contact & Header Profile</h3>
              <p className="text-xs text-gray-500 mt-1">This section carries your essential contact details and professional tagline.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {formInput('fullName', 'Full Name', data.personalInfo.fullName, handlePersonalInfoChange, 'Alex Mercer')}
              {formInput('jobTitle', 'Professional Title', data.personalInfo.jobTitle, handlePersonalInfoChange, 'Senior Full-Stack Architect')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formInput('email', 'Email Address', data.personalInfo.email, handlePersonalInfoChange, 'alex.mercer@gmail.com')}
              {formInput('phone', 'Phone Number', data.personalInfo.phone, handlePersonalInfoChange, '+1 (555) 234-5678')}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formInput('location', 'Location (City, ST)', data.personalInfo.location, handlePersonalInfoChange, 'San Francisco, CA')}
              {formInput('website', 'Personal Website / URL', data.personalInfo.website, handlePersonalInfoChange, 'https://alexmercer.dev')}
            </div>

            {formInput('photoUrl', 'Profile Photo Link (URL)', data.personalInfo.photoUrl, handlePersonalInfoChange, 'Paste an image URL (Unsplash/Imgur)')}

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Professional Abstract Summary</label>
              <textarea
                name="summary"
                value={data.personalInfo.summary || ''}
                onChange={handlePersonalInfoChange}
                placeholder="Briefly state your core highlights, achievements, and unique strengths..."
                rows={5}
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm border border-slate-200 focus:border-indigo-500 rounded-lg p-2.5 outline-none transition-colors resize-y leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 2: WORK EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Professional Experience</h3>
                <p className="text-xs text-gray-500 mt-0.5">Chronologically log your employment records.</p>
              </div>
              <button
                onClick={addWork}
                className="flex items-center gap-1.5 p-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-lg text-xs leading-none transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Record</span>
              </button>
            </div>

            {(!data.workExperience || data.workExperience.length === 0) ? (
              <div className="text-center p-12 py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <span className="text-sm font-bold text-slate-600 block">No experiences added yet</span>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Get started by pressing the Add Record button above.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {data.workExperience.map((exp, idx) => {
                  const isOpen = !!openCards[exp.id];
                  return (
                    <div key={exp.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                      {/* HEADER LINE */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-50/50">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-700 text-sm truncate">
                            {exp.role || '(New Role)'} {exp.company ? `@ ${exp.company}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {/* Ordering controls on the items */}
                          <button
                            onClick={() => moveWork(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveWork(idx, 'down')}
                            disabled={idx === data.workExperience.length - 1}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => deleteWork(exp.id)}
                            className="p-1 px-1.5 text-rose-500 hover:bg-rose-50 rounded"
                            title="Delete"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleCard(exp.id)}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          >
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* WORK DETAILS FORM */}
                      {isOpen && (
                        <div className="p-4 border-t border-slate-100 grid grid-cols-1 gap-4 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Corporate / Company</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => updateWorkItem(exp.id, { company: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. Acme Corp"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Professional Title / Role</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => updateWorkItem(exp.id, { role: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. lead developer"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Date Started (YYYY-MM)</label>
                              <input
                                type="text"
                                value={exp.startDate}
                                onChange={(e) => updateWorkItem(exp.id, { startDate: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. 2022-03"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Date Ended (YYYY-MM)</label>
                              <input
                                type="text"
                                value={exp.endDate}
                                disabled={exp.current}
                                onChange={(e) => updateWorkItem(exp.id, { endDate: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none disabled:bg-slate-100 disabled:opacity-50"
                                placeholder="e.g. 2024-05"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Office Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) => updateWorkItem(exp.id, { location: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. Austin, TX"
                              />
                            </div>
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateWorkItem(exp.id, { current: e.target.checked })}
                              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-xs text-slate-600 font-semibold">I currently work here in this capacity</span>
                          </label>

                          <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                            <label className="text-[11px] font-bold text-slate-500">Achievements / Bullet Details</label>
                            <span className="text-[10px] text-gray-400 mb-1">Write your achievements here. Press Enter to start a new bullet.</span>
                            <textarea
                              value={exp.description.join('\n')}
                              onChange={(e) => updateWorkItem(exp.id, { description: e.target.value.split('\n') })}
                              rows={4}
                              className="w-full bg-slate-50 focus:bg-white text-xs border border-slate-200 focus:border-indigo-500 rounded p-2 outline-none leading-relaxed"
                              placeholder="• Spearheaded project team of 5 engineers delivering SaaS dashboards...
• Slashing server latency bottleneck by 30%..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EDUCATION */}
        {activeTab === 'education' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Academic History</h3>
                <p className="text-xs text-gray-500 mt-0.5">Log collegiate degrees and academic accolades.</p>
              </div>
              <button
                onClick={addEducation}
                className="flex items-center gap-1.5 p-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-lg text-xs leading-none transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Degree</span>
              </button>
            </div>

            {(!data.education || data.education.length === 0) ? (
              <div className="text-center p-12 py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <span className="text-sm font-bold text-slate-600 block">No education credentials log</span>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Load credentials using the Add Degree button above.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {data.education.map((edu, idx) => {
                  const isOpen = !!openCards[edu.id];
                  return (
                    <div key={edu.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-3.5 bg-slate-50/50">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-700 text-sm truncate">
                            {edu.degree || '(New Degree)'} {edu.institution ? `@ ${edu.institution}` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveEducation(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveEducation(idx, 'down')}
                            disabled={idx === data.education.length - 1}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteEducation(edu.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleCard(edu.id)}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          >
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="p-4 border-t border-slate-100 grid grid-cols-1 gap-4 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Institution / University</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => updateEducationItem(edu.id, { institution: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. University of California"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Degree & Specialization</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => updateEducationItem(edu.id, { degree: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. Bachelor of Science"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Field of Study</label>
                              <input
                                type="text"
                                value={edu.fieldOfStudy}
                                onChange={(e) => updateEducationItem(edu.id, { fieldOfStudy: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. Computer Science"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500 font-mono">GPA Score (Optional)</label>
                              <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => updateEducationItem(edu.id, { gpa: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. 3.92"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Campus Location</label>
                              <input
                                type="text"
                                value={edu.location}
                                onChange={(e) => updateEducationItem(edu.id, { location: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. Berkeley, CA"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Enrollment Start (YYYY-MM)</label>
                              <input
                                type="text"
                                value={edu.startDate}
                                onChange={(e) => updateEducationItem(edu.id, { startDate: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. 2018-09"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Graduation Date (YYYY-MM)</label>
                              <input
                                type="text"
                                value={edu.endDate}
                                disabled={edu.current}
                                onChange={(e) => updateEducationItem(edu.id, { endDate: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none disabled:opacity-50"
                                placeholder="e.g. 2022-06"
                              />
                            </div>
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer mt-1">
                            <input
                              type="checkbox"
                              checked={edu.current}
                              onChange={(e) => updateEducationItem(edu.id, { current: e.target.checked })}
                              className="w-3.5 h-3.5 rounded text-indigo-600"
                            />
                            <span className="text-xs text-slate-600 font-semibold font-mono">Presently enrolled / ongoing study</span>
                          </label>

                          <div className="flex flex-col gap-1 border-t border-slate-100 pt-3">
                            <label className="text-[11px] font-bold text-slate-500">Additional Bio Details / Projects / Dean's Honors List</label>
                            <input
                              type="text"
                              value={edu.description}
                              onChange={(e) => updateEducationItem(edu.id, { description: e.target.value })}
                              className="bg-slate-50 p-2.5 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                              placeholder="e.g. Specialized in Artificial Intelligence. Received dean list award."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SKILLS GRID */}
        {activeTab === 'skills' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Skills Grouping Matrix</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-sans">Group skills categorically (e.g. Languages, Databases) with list blocks.</p>
              </div>
              <button
                onClick={addSkillGroup}
                className="flex items-center gap-1.5 p-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-lg text-xs leading-none transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Group</span>
              </button>
            </div>

            {(!data.skills || data.skills.length === 0) ? (
              <div className="text-center p-12 py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                <Code className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <span className="text-sm font-bold text-slate-600 block">No skills defined yet</span>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Create a modern skills group (e.g. Technical Skills) to begin.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {data.skills.map((sg, idx) => {
                  const isOpen = !!openCards[sg.id];
                  return (
                    <div key={sg.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-3.5 bg-slate-50/50">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="font-bold text-slate-700 text-sm truncate">
                            {sg.category || '(New Category)'} {sg.skills.length > 0 ? `(${sg.skills.length} items)` : ''}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveSkillGroup(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveSkillGroup(idx, 'down')}
                            disabled={idx === data.skills.length - 1}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSkillGroup(sg.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleCard(sg.id)}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          >
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="p-4 border-t border-slate-100 grid grid-cols-1 gap-4 bg-white">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Group Name / Category</label>
                            <input
                              type="text"
                              value={sg.category}
                              onChange={(e) => updateSkillGroupItem(sg.id, e.target.value, sg.skills.join(','))}
                              className="bg-slate-50 p-2.5 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                              placeholder="e.g. Programming Languages, Design Suite"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">List of Skills (Comma separated)</label>
                            <span className="text-[10px] text-gray-400 mb-1">Separate individual entries by comma. Whitespace trims automatically.</span>
                            <input
                              type="text"
                              value={sg.skills.join(', ')}
                              onChange={(e) => updateSkillGroupItem(sg.id, sg.category, e.target.value)}
                              className="bg-slate-50 p-2.5 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                              placeholder="e.g. JavaScript, Ruby on Rails, CSS"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Portfolio Projects</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-sans">Highlight remarkable side initiatives or corporate deliveries.</p>
              </div>
              <button
                onClick={addProject}
                className="flex items-center gap-1.5 p-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-lg text-xs leading-none transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {(!data.projects || data.projects.length === 0) ? (
              <div className="text-center p-12 py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                <Compass className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <span className="text-sm font-bold text-slate-600 block">No projects added yet</span>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Click the Add Project button above to register side ventures.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {data.projects.map((proj, idx) => {
                  const isOpen = !!openCards[proj.id];
                  return (
                    <div key={proj.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-3.5 bg-slate-50/50">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-700 text-sm truncate">
                            {proj.name || '(New Project)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveProject(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveProject(idx, 'down')}
                            disabled={idx === data.projects.length - 1}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProject(proj.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toggleCard(proj.id)}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          >
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="p-4 border-t border-slate-100 grid grid-cols-1 gap-4 bg-white">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Project Name</label>
                              <input
                                type="text"
                                value={proj.name}
                                onChange={(e) => updateProjectItem(proj.id, { name: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. My Portfolio Site"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Demo / Repository Link (URL)</label>
                              <input
                                type="text"
                                value={proj.url}
                                onChange={(e) => updateProjectItem(proj.id, { url: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. https://portfolio.com"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">Start Date</label>
                              <input
                                type="text"
                                value={proj.startDate}
                                onChange={(e) => updateProjectItem(proj.id, { startDate: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. 2024-01"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500">End Date</label>
                              <input
                                type="text"
                                value={proj.endDate}
                                onChange={(e) => updateProjectItem(proj.id, { endDate: e.target.value })}
                                className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                                placeholder="e.g. 2024-05"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-500">Technologies Utilized (Comma separated)</label>
                            <input
                              type="text"
                              value={proj.technologies.join(', ')}
                              onChange={(e) => updateProjectItem(proj.id, { rawTech: e.target.value })}
                              className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                              placeholder="e.g. React, NextSB, Tailwind CSS"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-500">Project Description SUMMARY</label>
                            <textarea
                              value={proj.description}
                              onChange={(e) => updateProjectItem(proj.id, { description: e.target.value })}
                              rows={3}
                              className="w-full bg-slate-50 focus:bg-white text-xs border border-slate-200 rounded p-2 outline-none leading-relaxed"
                              placeholder="A comprehensive offline-first project collaboration command center mapping SVG matrices..."
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Certifications & Licenses</h3>
                <p className="text-xs text-gray-500 mt-0.5">Certify expertise from authorized agencies (e.g. AWS, Cisco).</p>
              </div>
              <button
                onClick={addCertification}
                className="flex items-center gap-1.5 p-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-lg text-xs leading-none transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Cert</span>
              </button>
            </div>

            {(!data.certifications || data.certifications.length === 0) ? (
              <div className="text-center p-12 py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                <Award className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <span className="text-sm font-bold text-slate-600 block">No certification credentials log</span>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Get started by pressing the Add Cert button.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.certifications.map((cert, idx) => {
                  const isOpen = !!openCards[cert.id];
                  return (
                    <div key={cert.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-slate-50/50">
                        <span className="font-bold text-slate-700 text-sm truncate">{cert.name || '(New Certification)'}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveCertification(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => moveCertification(idx, 'down')}
                            disabled={idx === data.certifications.length - 1}
                            className="p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteCertification(cert.id)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400">Certification Name</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => updateCertificationItem(cert.id, { name: e.target.value })}
                            className="bg-slate-50 p-2 text-xs border border-slate-250 focus:bg-white rounded outline-none"
                            placeholder="e.g. AWS Solutions Architect"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400">Issuer Agency</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => updateCertificationItem(cert.id, { issuer: e.target.value })}
                            className="bg-slate-50 p-2 text-xs border border-slate-250 focus:bg-white rounded outline-none"
                            placeholder="e.g. Amazon Web Services"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 font-mono">Date Obtained (YYYY-MM)</label>
                          <input
                            type="text"
                            value={cert.date}
                            onChange={(e) => updateCertificationItem(cert.id, { date: e.target.value })}
                            className="bg-slate-50 p-2 text-xs border border-slate-250 focus:bg-white rounded outline-none"
                            placeholder="e.g. 2024-04"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400">Verification Link (URL)</label>
                          <input
                            type="text"
                            value={cert.url}
                            onChange={(e) => updateCertificationItem(cert.id, { url: e.target.value })}
                            className="bg-slate-50 p-2 text-xs border border-slate-250 focus:bg-white rounded outline-none"
                            placeholder="e.g. https://aws.cert"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: LANGUAGES */}
        {activeTab === 'languages' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Languages</h3>
                <p className="text-xs text-gray-500 mt-0.5 font-sans">Document multilingual proficiencies.</p>
              </div>
              <button
                onClick={addLanguage}
                className="flex items-center gap-1.5 p-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-lg text-xs leading-none transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lang</span>
              </button>
            </div>

            {(!data.languages || data.languages.length === 0) ? (
              <div className="text-center p-12 py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                <Globe className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <span className="text-sm font-bold text-slate-600 block">No languages recorded</span>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Click Add Lang above to include your verbal and written languages.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {data.languages.map((lang, idx) => {
                  return (
                    <div key={lang.id} className="border border-slate-200 rounded-xl bg-white p-3.5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                      <div className="grid grid-cols-2 gap-3 flex-1 w-full">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400">Language</label>
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => updateLanguageItem(lang.id, { name: e.target.value })}
                            className="bg-slate-50 p-2 text-xs border border-slate-200 focus:bg-white rounded outline-none"
                            placeholder="e.g. English, Español"
                          />
                        </div>
                        <div className="flex flex-col gap-1 font-mono">
                          <label className="text-[10px] font-bold text-slate-400">Proficiency Level</label>
                          <select
                            value={lang.proficiency}
                            onChange={(e) => updateLanguageItem(lang.id, { proficiency: e.target.value })}
                            className="bg-slate-50 hover:bg-slate-100 p-2 text-xs border border-slate-200 rounded outline-none cursor-pointer"
                          >
                            <option value="Native / Bilingual">Native / Bilingual</option>
                            <option value="Full Professional">Full Professional</option>
                            <option value="Professional Working">Professional Working</option>
                            <option value="Limited Working">Limited Working</option>
                            <option value="Elementary / Basic">Elementary / Basic</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 mt-2 sm:mt-0">
                        <button
                          onClick={() => moveLanguage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveLanguage(idx, 'down')}
                          disabled={idx === data.languages.length - 1}
                          className="p-1.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30 rounded"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteLanguage(lang.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: CUSTOM SECTIONS */}
        {activeTab === 'custom' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-800">Volunteer Work & Custom Sections</h3>
                <p className="text-xs text-gray-500 mt-0.5">Customize your own secondary timeline segments (e.g., Volunteering, Publications).</p>
              </div>
              <button
                onClick={addCustomSection}
                className="flex items-center gap-1.5 p-2 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-lg text-xs leading-none transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Section Area</span>
              </button>
            </div>

            {(!data.customSections || data.customSections.length === 0) ? (
              <div className="text-center p-12 py-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/40">
                <Layers className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <span className="text-sm font-bold text-slate-600 block">No custom sections defined</span>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">Create specialized segments by hitting the Create Section Area button above.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {data.customSections.map((sect) => {
                  const isOpen = !!openCards[sect.id];
                  return (
                    <div key={sect.id} className="border border-indigo-100 rounded-xl bg-slate-50/30 p-4 border-l-4 border-l-indigo-500">
                      
                      {/* Section Head Title modifier */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200 pb-3 mb-4">
                        <div className="flex-1">
                          <label className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">Custom Segment Title</label>
                          <input
                            type="text"
                            value={sect.title}
                            onChange={(e) => updateCustomSectionTitle(sect.id, e.target.value)}
                            className="bg-white p-2 text-xs border border-indigo-200 font-bold focus:bg-white rounded w-full outline-none"
                            placeholder="e.g. Volunteer Work, Key Publications"
                          />
                        </div>
                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => addCustomItem(sect.id)}
                            className="flex items-center gap-1 p-1.5 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded text-[11px] leading-tight"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Item Block</span>
                          </button>
                          <button
                            onClick={() => deleteCustomSection(sect.id)}
                            className="p-1 px-2 text-rose-500 hover:bg-rose-50 rounded"
                            title="Delete whole Custom section"
                          >
                            <Trash className="w-3.5 h-3.5 inline mr-1" />
                            <span className="text-xs">Delete Area</span>
                          </button>
                        </div>
                      </div>

                      {/* Items loop inside this custom section */}
                      {(!sect.items || sect.items.length === 0) ? (
                        <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg bg-white/50 text-xs text-gray-400 font-bold">
                          No item records logged in this segment yet. Press "Add Item Block" to start adding activities.
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          {sect.items.map((item) => (
                            <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm relative">
                              <button
                                onClick={() => deleteCustomItem(sect.id, item.id)}
                                className="absolute top-2.5 right-2.5 p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                                title="Delete Item"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8 mb-3">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] text-gray-400 font-bold">Principal Title</label>
                                  <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => updateCustomItemFields(sect.id, item.id, { title: e.target.value })}
                                    className="bg-slate-50 p-1.5 text-xs border border-slate-200 rounded outline-none"
                                    placeholder="e.g. Lead Volunteer"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] text-gray-400 font-bold">Sub-institution</label>
                                  <input
                                    type="text"
                                    value={item.subtitle}
                                    onChange={(e) => updateCustomItemFields(sect.id, item.id, { subtitle: e.target.value })}
                                    className="bg-slate-50 p-1.5 text-xs border border-slate-200 rounded outline-none"
                                    placeholder="e.g. Red Cross"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-[10px] text-gray-400 font-bold font-mono">Date / Duration</label>
                                  <input
                                    type="text"
                                    value={item.date}
                                    onChange={(e) => updateCustomItemFields(sect.id, item.id, { date: e.target.value })}
                                    className="bg-slate-50 p-1.5 text-xs border border-slate-200 rounded outline-none"
                                    placeholder="e.g. 2021-03 – 2023-12"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-gray-400 font-bold">Brief Description Narrative</label>
                                <textarea
                                  value={item.description}
                                  onChange={(e) => updateCustomItemFields(sect.id, item.id, { description: e.target.value })}
                                  rows={2.5}
                                  className="w-full bg-slate-50 text-xs border border-slate-200 rounded p-1.5 outline-none leading-relaxed"
                                  placeholder="Provide bullet summaries or brief narratives outlining your duties..."
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
