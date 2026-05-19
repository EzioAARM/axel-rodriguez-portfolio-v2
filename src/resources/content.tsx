import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";

const person: Person = {
  firstName: "Axel",
  lastName: "Rodriguez",
  name: "Axel Rodriguez",
  role: "Cloud Specialist & Senior Software Engineer",
  avatar: "/images/avatar.jpg",
  email: "alejandrom9712@gmail.com",
  location: "America/Guatemala",
  languages: ["Spanish", "English"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>Updates on cloud engineering, DevOps, and software architecture.</>,
};

const social: Social = [];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name} – Portfolio`,
  description: `Portfolio of ${person.name}, ${person.role} based in Guatemala.`,
  headline: <>Cloud, code, and a bit of everything</>,
  featured: {
    display: false,
    title: <>Featured work</>,
    href: "/work",
  },
  subline: (
    <>
      I'm Axel, a Cloud Specialist and Senior Software Engineer based in Guatemala. I build
      scalable infrastructure and software systems.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from Guatemala.`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: <></>,
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Blog",
  description: `Articles and thoughts by ${person.name}`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: "Work",
  description: `Projects and case studies by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: "Gallery",
  description: `Photography by ${person.name}`,
  images: [],
};

export { person, social, newsletter, home, about, blog, work, gallery };
