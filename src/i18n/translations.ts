export type Locale = "en" | "es";
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALES: readonly Locale[] = ["en", "es"] as const;
export const LOCALE_COOKIE = "NEXT_LOCALE";

const translations = {
  en: {
    nav: {
      about: "About",
      work: "Projects",
      blog: "Blog",
      gallery: "Gallery",
    },
    home: {
      latestBlog: "Latest from the blog",
      whatIDo: "What I do",
      projects: "Projects",
    },
    about: {
      scheduleCall: "Schedule a call",
      certifications: "Certifications",
      verify: "Verify",
      present: "Present",
      work: "Work Experience",
      studies: "Studies",
      technical: "Technical Skills",
    },
    blog: {
      earlierPosts: "Earlier posts",
      recentPosts: "Recent posts",
      minRead: "min read",
    },
    gallery: {
      all: "All",
      noResults: "No photos match the selected filters.",
      clearLocation: "Clear location filter",
      filterByLocation: "Filter by location",
      filterByTag: "Filter by tag",
      close: "Close",
    },
    work: {
      noProjects: "No projects to show yet.",
      backToProjects: "Projects",
      relatedProjects: "Related projects",
    },
  },
  es: {
    nav: {
      about: "Acerca de",
      work: "Proyectos",
      blog: "Blog",
      gallery: "Galería",
    },
    home: {
      latestBlog: "Lo último del blog",
      whatIDo: "Qué hago",
      projects: "Proyectos",
    },
    about: {
      scheduleCall: "Agendar una llamada",
      certifications: "Certificaciones",
      verify: "Verificar",
      present: "Presente",
      work: "Experiencia Laboral",
      studies: "Estudios",
      technical: "Habilidades Técnicas",
    },
    blog: {
      earlierPosts: "Posts anteriores",
      recentPosts: "Posts recientes",
      minRead: "min de lectura",
    },
    gallery: {
      all: "Todos",
      noResults: "Ninguna foto coincide con los filtros seleccionados.",
      clearLocation: "Limpiar filtro de ubicación",
      filterByLocation: "Filtrar por ubicación",
      filterByTag: "Filtrar por etiqueta",
      close: "Cerrar",
    },
    work: {
      noProjects: "Sin proyectos por mostrar.",
      backToProjects: "Proyectos",
      relatedProjects: "Proyectos relacionados",
    },
  },
} as const;

export type Translations = typeof translations.en;

export function getT(locale: Locale): Translations {
  return (translations[locale] ?? translations[DEFAULT_LOCALE]) as Translations;
}
