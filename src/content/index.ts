/**
 * The single access point for portfolio content.
 *
 * Components import from here, never from `src/data/*.json` directly, so the
 * raw JSON gets typed exactly once and swapping a data source later touches
 * only this file.
 */
import achievementsJson from '@/data/achievements.json';
import educationJson from '@/data/education.json';
import experienceJson from '@/data/experience.json';
import navigationJson from '@/data/navigation.json';
import profileJson from '@/data/profile.json';
import projectsJson from '@/data/projects.json';
import sectionsJson from '@/data/sections.json';
import seoJson from '@/data/seo.json';
import skillsJson from '@/data/skills.json';
import socialsJson from '@/data/socials.json';
import statsJson from '@/data/stats.json';

import type {
  Achievements,
  Education,
  Experience,
  NavLink,
  Profile,
  Project,
  Sections,
  Seo,
  SkillGroup,
  Social,
  Stat,
} from '@/types/content';

export const profile: Profile = profileJson;
export const stats: Stat[] = statsJson;
export const projects: Project[] = projectsJson as Project[];
export const experience: Experience[] = experienceJson;
export const skills: SkillGroup[] = skillsJson;
export const education: Education = educationJson;
export const achievements: Achievements = achievementsJson;
export const navigation: NavLink[] = navigationJson;
export const socials: Social[] = socialsJson;
export const sections: Sections = sectionsJson;
export const seo: Seo = seoJson;

/** Path to the CV served from `public/`. Used by the /cv route and the hero CTA. */
export const CV_PATH = '/Rudra_Sharma.pdf';
export const CV_FILENAME = 'Rudra_Sharma_CV.pdf';
