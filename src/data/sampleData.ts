import { ResumeData, StyleConfig } from '../types';

export const SAMPLE_RESUME: ResumeData = {
  id: 'sample-resume',
  title: 'Alex Mercer - Senior Software Engineer',
  updatedAt: '2026-06-20T00:00:00.000Z',
  personalInfo: {
    fullName: 'Alex Mercer',
    jobTitle: 'Senior Full-Stack Developer',
    email: 'alex.mercer@devmail.com',
    phone: '+1 (555) 234-5678',
    website: 'https://alexmercer.dev',
    location: 'San Francisco, CA',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    summary: 'Senior Software Engineer with 8+ years of experience designing and building scalable cloud-native architectures and highly polished user interfaces. Proven track record of leading product-focused engineering teams, slashing latency by 40%, and delivering complex full-stack products from concept to launch.'
  },
  workExperience: [
    {
      id: 'w-1',
      company: 'TechNovus Systems Inc.',
      role: 'Lead Full-Stack Architect',
      location: 'San Francisco, CA',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: [
        'Championed the transition of standard legacy architectures into full-stack Next.js and microservice backends, speeding up load times by 42% for 2.4M active users.',
        'Led and coached a highly collaborative cross-functional product team of 12 engineers in shipping key payment integration modules, increasing recurring checkout volume by 28%.',
        'Implemented rigorous automated end-to-end testing systems (Playwright, Jest), reducing regression issues and production bugs by over 55% during continuous deployment streams.'
      ]
    },
    {
      id: 'w-2',
      company: 'CloudFlow Solutions',
      role: 'Senior Software Engineer',
      location: 'Austin, TX (Remote)',
      startDate: '2019-06',
      endDate: '2022-02',
      current: false,
      description: [
        'Spearheaded the optimization of internal Node.js/PostgreSQL dashboard pipelines, optimizing query execution plans resulting in a 70ms improvement in server response times.',
        'Constructed custom internal reactive component libraries and systems using Tailwind CSS and React, removing over 200MB of unused CSS dependencies and modernizing UI visuals.',
        'Managed and coordinated robust CI/CD workflow pipelines on AWS using Github Actions, facilitating effortless daily serverless code releases and ensuring 99.98% runtime availability.'
      ]
    },
    {
      id: 'w-3',
      company: 'VeloLabs Creative Studio',
      role: 'Software Developer',
      location: 'Seattle, WA',
      startDate: '2017-01',
      endDate: '2019-05',
      current: false,
      description: [
        'Built interactive client websites, dashboards, and rich offline-first web portals utilizing modern React, Redux, and mobile-responsive layouts.',
        'Collaborated closely with visual designers to implement beautiful motion layouts, custom interactions, and strict accessibility standards compliance.'
      ]
    }
  ],
  education: [
    {
      id: 'e-1',
      institution: 'University of California, Berkeley',
      degree: 'Master of Science',
      fieldOfStudy: 'Computer Science & Engineering',
      location: 'Berkeley, CA',
      startDate: '2014-09',
      endDate: '2016-06',
      current: false,
      gpa: '3.91',
      description: 'Specialized in Advanced Cloud Computing and Human-Computer Interaction models.'
    },
    {
      id: 'e-2',
      institution: 'Seattle University',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      location: 'Seattle, WA',
      startDate: '2010-09',
      endDate: '2014-06',
      current: false,
      gpa: '3.82',
      description: 'Graduated Magna Cum Laude. Member of the Engineering Honor Society.'
    }
  ],
  skills: [
    {
      id: 'sg-1',
      category: 'Languages',
      skills: ['TypeScript', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'SQL', 'Rust', 'Python']
    },
    {
      id: 'sg-2',
      category: 'Frameworks / Libs',
      skills: ['React', 'Next.js', 'Express', 'Tailwind CSS', 'Redux Toolkit', 'D3.js', 'Node.js']
    },
    {
      id: 'sg-3',
      category: 'Platforms / Tools',
      skills: ['AWS', 'Docker', 'Git / Github', 'Vercel', 'PostgreSQL', 'Jest & Playwright', 'GraphQL']
    }
  ],
  projects: [
    {
      id: 'p-1',
      name: 'OmniTask AI Dashboard',
      description: 'Created a responsive, offline-first project collaboration command center featuring fluid drag-and-drop mechanics, automated task scheduling queues, and SVG matrix analytics.',
      technologies: ['React', 'Vite', 'Tailwind CSS', 'IndexedDB', 'D3.js'],
      url: 'https://omnitask-pro.app',
      startDate: '2024-01',
      endDate: '2024-05'
    },
    {
      id: 'p-2',
      name: 'HydroCloud Database Client',
      description: 'Engineered a highly aesthetic terminal-styled explorer interface mapping PostgreSQL collections and indices into comprehensive visual nodes with low latency overhead.',
      technologies: ['Electron', 'Rust', 'TypeScript', 'Tailwind', 'WebSockets'],
      url: 'https://hydrocloud.io',
      startDate: '2023-08',
      endDate: '2023-11'
    }
  ],
  certifications: [
    {
      id: 'c-1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: '2024-04',
      url: 'https://aws.amazon.com/certification'
    },
    {
      id: 'c-2',
      name: 'React Advanced Security Specialist',
      issuer: 'Security Certified Consortium',
      date: '2023-10',
      url: ''
    }
  ],
  languages: [
    {
      id: 'l-1',
      name: 'English',
      proficiency: 'Native / Bilingual'
    },
    {
      id: 'l-2',
      name: 'Spanish',
      proficiency: 'Professional Working'
    }
  ],
  customSections: [
    {
      id: 'cs-1',
      title: 'Volunteer Work & Leadership',
      items: [
        {
          id: 'csi-1',
          title: 'Lead Volunteer Web Educator',
          subtitle: 'Code For Clean Oceans Initiative',
          date: '2021-03 - 2023-12',
          description: 'Designed interactive web development and web design curriculum for underserved youth, volunteering 6 hours weekly to instruct standard web applications.'
        }
      ]
    }
  ]
};

export const INITIAL_EMPTY_RESUME: ResumeData = {
  id: 'empty-resume',
  title: 'My Resume Draft',
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    photoUrl: '',
    summary: ''
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: []
};

export const DEFAULT_STYLE_CONFIG: StyleConfig = {
  fontFamily: 'font-sans',
  primaryColor: '#0f172a', // slate-900
  textColor: '#334155', // slate-700
  accentColor: '#3b82f6', // blue-500
  fontSize: 'md',
  lineHeight: 'normal',
  sectionSpacing: 'normal',
  paperSize: 'letter',
  showPhoto: true,
  photoStyle: 'circle',
  showDividers: true,
  sectionOrder: ['summary', 'work', 'education', 'skills', 'projects', 'certifications', 'languages', 'custom'],
  customFontSizeVal: 13,
  letterSpacing: 'normal',
  bulletStyle: 'disc',
  sectionHeaderCase: 'uppercase',
  borderThickness: 'thin',
  pagePaddingVal: 40,
  customLineHeightVal: 1.5
};
