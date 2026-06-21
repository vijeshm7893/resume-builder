import { StyleConfig, ThemePreset } from '../types';
import { TEMPLATE_PRESETS } from './TemplateRenderer';
import { Check, ArrowDown, ArrowUp, RefreshCw, Layers, Sliders, Type, Palette } from 'lucide-react';
import React, { useState } from 'react';

interface CustomizePanelProps {
  style: StyleConfig;
  onChangeStyle: (style: StyleConfig) => void;
  activeTemplate: ThemePreset;
  onChangeTemplate: (templateId: ThemePreset) => void;
}

const COLOR_PALETTES = [
  { name: 'Midnight Charcoal', primary: '#0f172a', accent: '#3b82f6', text: '#334155' },
  { name: 'Royal Indigo', primary: '#1e1b4b', accent: '#6366f1', text: '#312e81' },
  { name: 'Emerald Scholar', primary: '#064e3b', accent: '#059669', text: '#022c22' },
  { name: 'Executive Crimson', primary: '#451a03', accent: '#dc2626', text: '#1c1917' },
  { name: 'Deep Burgundy', primary: '#4c0519', accent: '#db2777', text: '#27272a' },
  { name: 'Tech Monochrome', primary: '#18181b', accent: '#27272a', text: '#3f3f46' },
  { name: 'Warm Amber', primary: '#78350f', accent: '#d97706', text: '#451a03' },
  { name: 'Pacific Teal', primary: '#115e59', accent: '#0d9488', text: '#1f2937' },
];

const FONTS = [
  { id: 'font-sans', name: 'Inter (Professional Sans)', css: 'font-sans' },
  { id: 'font-jakarta', name: 'Plus Jakarta (Modern Sans)', css: 'font-jakarta' },
  { id: 'font-outfit', name: 'Outfit (Sleek Geometric)', css: 'font-outfit' },
  { id: 'font-grotesk', name: 'Space Grotesk (Tech Heading)', css: 'font-grotesk' },
  { id: 'font-serif-lora', name: 'Lora (Editorial Serif)', css: 'font-serif-lora' },
  { id: 'font-serif-playfair', name: 'Playfair (Executive Serif)', css: 'font-serif-playfair' },
  { id: 'font-mono', name: 'Fira Code (Developer Mono)', css: 'font-mono' },
];

const SIZES: { id: StyleConfig['fontSize']; name: string }[] = [
  { id: 'xs', name: 'Extra Compact (12px)' },
  { id: 'sm', name: 'Compact (13px)' },
  { id: 'md', name: 'Standard (14px)' },
  { id: 'lg', name: 'Generous (15px)' },
];

const SPACING_OPTIONS: { id: StyleConfig['sectionSpacing']; name: string }[] = [
  { id: 'compact', name: 'Compact Spacing' },
  { id: 'normal', name: 'Normal Spacing' },
  { id: 'generous', name: 'Generous Spacing' },
];

const SECTION_LABELS: Record<string, string> = {
  summary: 'Professional Summary',
  work: 'Work Experience',
  education: 'Education Details',
  skills: 'Skills & Capabilities',
  projects: 'Projects Showcase',
  certifications: 'Certifications',
  languages: 'Languages',
  custom: 'Volunteer & Leadership',
};

export default function CustomizePanel({
  style,
  onChangeStyle,
  activeTemplate,
  onChangeTemplate,
}: CustomizePanelProps) {
  // Accordion active sections
  const [activeAccordion, setActiveAccordion] = useState<string>('templates');

  // Helper to trigger deep updates
  const updateStyleParam = <K extends keyof StyleConfig>(key: K, value: StyleConfig[K]) => {
    onChangeStyle({
      ...style,
      [key]: value
    });
  };

  // Preset Colors selection
  const selectPalette = (palette: typeof COLOR_PALETTES[0]) => {
    onChangeStyle({
      ...style,
      primaryColor: palette.primary,
      accentColor: palette.accent,
      textColor: palette.text
    });
  };

  // Reordering lists safely
  const moveSection = (idx: number, direction: 'up' | 'down') => {
    const list = [...style.sectionOrder];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    // Swap items
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    updateStyleParam('sectionOrder', list);
  };

  const toggleAccordion = (name: string) => {
    setActiveAccordion(activeAccordion === name ? '' : name);
  };

  return (
    <div className="flex flex-col gap-3 pb-10">
      
      {/* 1. TEMPLATES ACCORDION */}
      <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
        <button
          onClick={() => toggleAccordion('templates')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>1. Resume Templates ({TEMPLATE_PRESETS.length})</span>
          </div>
          <span className="text-xs text-indigo-500 font-medium font-mono uppercase bg-indigo-50 px-2 py-0.5 rounded-full">
            {activeTemplate}
          </span>
        </button>
        
        {activeAccordion === 'templates' && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 max-h-[380px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATE_PRESETS.map((t) => {
              const isActive = activeTemplate === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChangeTemplate(t.id)}
                  className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-sm whitespace-nowrap overflow-hidden text-overflow-ellipsis block">
                      {t.name}
                    </span>
                    {isActive && (
                      <span className="bg-indigo-600 text-white rounded-full p-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-normal line-clamp-2">
                    {t.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. COLORS ACCORDION */}
      <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
        <button
          onClick={() => toggleAccordion('colors')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-500" />
            <span>2. Colors & Branding</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full shadow-inner border border-white" style={{ backgroundColor: style.primaryColor }} />
            <div className="w-3.5 h-3.5 rounded-full shadow-inner border border-white" style={{ backgroundColor: style.accentColor }} />
          </div>
        </button>

        {activeAccordion === 'colors' && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
            {/* Presets Grid */}
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase tracking-wide">
                Designer Presets
              </span>
              <div className="grid grid-cols-2 gap-2">
                {COLOR_PALETTES.map((p, idx) => {
                  const isMatching = style.primaryColor === p.primary && style.accentColor === p.accent;
                  return (
                    <button
                      key={idx}
                      onClick={() => selectPalette(p)}
                      className={`p-2 rounded-lg bg-white border text-left flex items-center justify-between hover:bg-slate-50 transition-all ${
                        isMatching ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-medium text-slate-600 truncate mr-1">{p.name}</span>
                      <div className="flex shrink-0 gap-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.primary }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.accent }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Hex Pickers */}
            <div className="border-t border-slate-200/60 pt-3">
              <span className="text-xs font-semibold text-slate-500 block mb-2.5 uppercase tracking-wide">
                Custom Fine Tuning
              </span>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Primary Color</label>
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                    <input
                      type="color"
                      value={style.primaryColor}
                      onChange={(e) => updateStyleParam('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={style.primaryColor}
                      onChange={(e) => updateStyleParam('primaryColor', e.target.value)}
                      className="text-xs font-mono w-full focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500 block mb-1">Accent / Dates</label>
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                    <input
                      type="color"
                      value={style.accentColor}
                      onChange={(e) => updateStyleParam('accentColor', e.target.value)}
                      className="w-8 h-8 rounded border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={style.accentColor}
                      onChange={(e) => updateStyleParam('accentColor', e.target.value)}
                      className="text-xs font-mono w-full focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. TYPOGRAPHY ACCORDION */}
      <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
        <button
          onClick={() => toggleAccordion('typography')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-500" />
            <span>3. Typography & Size Customization</span>
          </div>
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-serif-lora uppercase tracking-tighter">
            {style.fontFamily === 'font-sans' ? 'Inter' : style.fontFamily.replace('font-serif-', '').replace('font-', '')}
          </span>
        </button>

        {activeAccordion === 'typography' && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
            
            {/* Fonts list */}
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase tracking-wide">
                Selected Typeface
              </span>
              <div className="grid grid-cols-1 gap-1.5 max-h-[170px] overflow-y-auto pr-1">
                {FONTS.map((font) => {
                  const isActive = style.fontFamily === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() => updateStyleParam('fontFamily', font.id)}
                      className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-white border-blue-600 text-blue-900 font-bold shadow-sm'
                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className={`text-sm ${font.css}`}>{font.name}</span>
                      {isActive && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advanced Fine Tuning font size slider */}
            <div className="border-t border-slate-200/60 pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Precise Font size
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {style.customFontSizeVal ?? 13}px
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="18"
                step="0.5"
                value={style.customFontSizeVal ?? 13}
                onChange={(e) => updateStyleParam('customFontSizeVal', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>10px (Very small)</span>
                <span>14px (Standard)</span>
                <span>18px (Large)</span>
              </div>
            </div>

            {/* Custom Line Height Slider */}
            <div className="border-t border-slate-200/60 pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Line Height / Spacing
                </span>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {style.customLineHeightVal ?? 1.5}
                </span>
              </div>
              <input
                type="range"
                min="1.1"
                max="2.1"
                step="0.05"
                value={style.customLineHeightVal ?? 1.5}
                onChange={(e) => updateStyleParam('customLineHeightVal', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>1.1 (Compact)</span>
                <span>1.5 (Standard)</span>
                <span>2.1 (Generous)</span>
              </div>
            </div>

            {/* Custom Letter Spacing Buttons */}
            <div className="border-t border-slate-200/60 pt-3">
              <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase tracking-wide">
                Letter Spacing (Kerning)
              </span>
              <div className="grid grid-cols-5 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                {(['tighter', 'tight', 'normal', 'wide', 'widest'] as const).map((space) => {
                  const isActive = (style.letterSpacing || 'normal') === space;
                  return (
                    <button
                      key={space}
                      onClick={() => updateStyleParam('letterSpacing', space)}
                      className={`text-[10px] sm:text-xs py-1.5 font-semibold rounded capitalize transition-all shrink-0 ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {space}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Bullet Style Option */}
            <div className="border-t border-slate-200/60 pt-3">
              <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase tracking-wide">
                Bullet point icons list shape
              </span>
              <div className="grid grid-cols-6 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                {[
                  { id: 'disc', glyph: '•', label: 'Disc' },
                  { id: 'circle', glyph: '○', label: 'Ring' },
                  { id: 'square', glyph: '■', label: 'Box' },
                  { id: 'dash', glyph: '—', label: 'Dash' },
                  { id: 'arrow', glyph: '➔', label: 'Arrow' },
                  { id: 'star', glyph: '✦', label: 'Star' }
                ].map((bul) => {
                  const isActive = (style.bulletStyle || 'disc') === bul.id;
                  return (
                    <button
                      key={bul.id}
                      onClick={() => updateStyleParam('bulletStyle', bul.id as StyleConfig['bulletStyle'])}
                      className={`py-2 px-1 rounded flex flex-col items-center justify-center border transition-all ${
                        isActive
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-transparent hover:bg-slate-50 text-slate-500'
                      }`}
                      title={bul.label}
                    >
                      <span className="text-sm font-bold block leading-none mb-0.5">{bul.glyph}</span>
                      <span className="text-[8px] font-semibold text-gray-400 capitalize">{bul.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section Headings Casing */}
            <div className="border-t border-slate-200/60 pt-3">
              <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase tracking-wide">
                Header text casing format
              </span>
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                {[
                  { id: 'uppercase', label: 'ALL CAPS' },
                  { id: 'capitalize', label: 'Title Case' },
                  { id: 'normal', label: 'As Typed' }
                ].map((cs) => {
                  const isActive = (style.sectionHeaderCase || 'uppercase') === cs.id;
                  return (
                    <button
                      key={cs.id}
                      onClick={() => updateStyleParam('sectionHeaderCase', cs.id as StyleConfig['sectionHeaderCase'])}
                      className={`text-xs py-1.5 font-bold rounded capitalize transition-all ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cs.label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 4. LAYOUT ADJUSTMENTS ACCORDION */}
      <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
        <button
          onClick={() => toggleAccordion('layout')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-500" />
            <span>4. Layout & Margins</span>
          </div>
          <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-mono uppercase">
            {style.paperSize}
          </span>
        </button>

        {activeAccordion === 'layout' && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-4">
            
            {/* Settings Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5 uppercase tracking-wide">
                  Paper Dimension
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStyleParam('paperSize', 'letter')}
                    className={`p-2 rounded-lg text-xs font-semibold border ${
                      style.paperSize === 'letter' ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    US Letter
                  </button>
                  <button
                    onClick={() => updateStyleParam('paperSize', 'a4')}
                    className={`p-2 rounded-lg text-xs font-semibold border ${
                      style.paperSize === 'a4' ? 'bg-amber-600 border-amber-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    DIN A4
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5 uppercase tracking-wide">
                  Spacing Density (Grid)
                </label>
                <div className="flex flex-col gap-1">
                  {SPACING_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateStyleParam('sectionSpacing', opt.id)}
                      className={`text-left p-1.5 px-3 rounded text-xs border ${
                        style.sectionSpacing === opt.id ? 'bg-white border-slate-400 font-semibold text-slate-800' : 'bg-white/40 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Page Padding / Margin Slider */}
            <div className="border-t border-slate-200/60 pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Document Margins / Outer Padding
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  {style.pagePaddingVal ?? 40}px
                </span>
              </div>
              <input
                type="range"
                min="16"
                max="64"
                step="2"
                value={style.pagePaddingVal ?? 40}
                onChange={(e) => updateStyleParam('pagePaddingVal', parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>16px (Dense space)</span>
                <span>40px (Standard space)</span>
                <span>64px (Luxe margins)</span>
              </div>
            </div>

            {/* Document toggles */}
            <div className="border-t border-slate-200/60 pt-3 space-y-2">
              <span className="text-xs font-semibold text-slate-500 block mb-2 uppercase tracking-wide">
                Display Anchors & Dividers
              </span>
              
              <label className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={style.showPhoto}
                  onChange={(e) => updateStyleParam('showPhoto', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-700 block">Render Profile Image</span>
                  <span className="text-xs text-gray-500 block">Toggle personal photograph in document header.</span>
                </div>
              </label>

              {style.showPhoto && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 ml-5">
                  <span className="text-xs text-slate-500 block">Avatar Frame Crop Shape</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['circle', 'rounded', 'square'] as const).map((sh) => (
                      <button
                        key={sh}
                        onClick={() => updateStyleParam('photoStyle', sh)}
                        className={`p-1.5 text-xs rounded border capitalize font-semibold ${
                          style.photoStyle === sh ? 'bg-slate-800 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {sh}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={style.showDividers}
                  onChange={(e) => updateStyleParam('showDividers', e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-700 block">Draw Accent Divider Lines</span>
                  <span className="text-xs text-gray-400 block">Adds visual borders beneath section headers.</span>
                </div>
              </label>

              {style.showDividers && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 ml-5">
                  <span className="text-xs text-slate-500 block">Accent Divider Line Weight</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'thin', label: '1px' },
                      { id: 'medium', label: '2px' },
                      { id: 'thick', label: '4px' }
                    ].map((bw) => (
                      <button
                        key={bw.id}
                        onClick={() => updateStyleParam('borderThickness', bw.id as StyleConfig['borderThickness'])}
                        className={`p-1.5 text-xs rounded border capitalize font-semibold transition-all ${
                          (style.borderThickness || 'thin') === bw.id ? 'bg-slate-800 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {bw.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 5. RE-ORDER SECTIONS ACCORDION */}
      <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
        <button
          onClick={() => toggleAccordion('ordering')}
          className="w-full flex items-center justify-between p-4 font-semibold text-slate-800 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-purple-500" />
            <span>5. Drag-Free Section Ordering</span>
          </div>
          <span className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase">
            Order Console
          </span>
        </button>

        {activeAccordion === 'ordering' && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
            <p className="text-xs text-gray-500 leading-normal mb-3">
              Use the simple Up & Down controls to immediately re-arrange sections in real-time. The renderer dynamically shifts headers and timelines as directed.
            </p>
            <div className="space-y-1.5">
              {style.sectionOrder.map((secName, idx) => {
                const label = SECTION_LABELS[secName] || secName;
                const isFirst = idx === 0;
                const isLast = idx === style.sectionOrder.length - 1;
                return (
                  <div
                    key={secName}
                    className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 px-3 shadow-sm hover:border-slate-300 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-700">{label}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveSection(idx, 'up')}
                        disabled={isFirst}
                        className={`p-1.5 rounded transition-all select-none ${
                          isFirst ? 'text-gray-200 cursor-not-allowed' : 'text-slate-500 hover:bg-gray-100 active:scale-95'
                        }`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSection(idx, 'down')}
                        disabled={isLast}
                        className={`p-1.5 rounded transition-all select-none ${
                          isLast ? 'text-gray-200 cursor-not-allowed' : 'text-slate-500 hover:bg-gray-100 active:scale-95'
                        }`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
