/**
 * Shapes for every file in `src/data/`.
 *
 * All portfolio copy lives in JSON; these interfaces are the contract between
 * those files and the components. Change a field name in a JSON file without
 * changing it here and `npm run typecheck` fails before the page can break.
 */

export interface PhotoAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, so the crop can be aimed at the face from JSON. */
  position?: string;
}

export interface Profile {
  name: string;
  shortName: string;
  /** Two-letter mark used by the header and the splash screen. */
  monogram: string;
  role: string;
  brand: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  website: string;
  headline: { lead: string; accent: string };
  intro: string[];
  summary: string;
  about: { statement: string; lead: string; detail: string };
  photos: {
    portrait: PhotoAsset;
    contact: PhotoAsset;
  };
}

export interface Stat {
  id: string;
  value: string;
  accent?: string;
  label: string;
}

export type ProjectArt = 'services' | 'realtime' | 'ai';

export interface Project {
  id: string;
  index: string;
  name: string;
  tagline: string;
  summary: string;
  artLabel: string;
  artCaption: string;
  art: ProjectArt;
  points: string[];
  tags: string[];
  status: 'live' | 'wip';
  repo?: string;
  live?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  /** `null` renders as "Present". */
  end: string | null;
  bullets: string[];
  tags: string[];
}

export interface SkillGroup {
  id: string;
  index: string;
  title: string;
  items: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
}

export interface Achievements {
  highlights: string[];
  certifications: string[];
  chips: string[];
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface Social {
  id: string;
  label: string;
  href: string;
}

export interface SectionMeta {
  index: string;
  eyebrow: string;
  title: string[];
  description: string;
}

export type Sections = Record<'work' | 'experience' | 'about' | 'skills' | 'contact', SectionMeta>;

export interface Seo {
  title: string;
  description: string;
  cvTitle: string;
  cvDescription: string;
  url: string;
  ogImage: string;
}
