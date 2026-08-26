import type { Project } from '@christoesser/shared';

const projects: Project[] = [
  {
    id: 'christos-prints',
    title: "Christo's Prints",
    slug: 'christos-prints',
    description: 'A 3D-printing business focused on custom, larger-scale orders and one-off parts, alongside fidget toys, gadgets, decorative items, and other products.',
    body: null,
    technologies: ['3D printing', 'CAD', 'Custom orders', 'Manufacturing'],
    links: [{ label: 'Visit christoprints.com', url: 'https://christoprints.com' }],
    image_path: null,
    image_url: null,
    date: 'Ongoing',
    category: '3D printing',
    featured: true,
    published: true,
  },
  {
    id: 'filmmaking-project',
    title: 'Lost Signal - Wish You Were Here',
    slug: 'lost-signal-wish-you-were-here',
    description: 'A trailer for a fictional film, made as a school project to practise cinematography, editing, and visual storytelling.',
    body: null,
    technologies: ['Cinematography', 'Editing', 'YouTube'],
    links: [{ label: 'Watch on YouTube', url: 'https://youtu.be/V0yvHQ7gYEg' }],
    image_path: null,
    image_url: null,
    date: 'Published',
    category: 'Filmmaking',
    featured: true,
    published: true,
  },
  {
    id: 'experiments',
    title: 'Experiments and prototypes',
    slug: 'experiments',
    description: 'Small software, web, hardware, and creative projects made to learn, test ideas, and solve practical problems.',
    body: null,
    technologies: ['Web development', 'Software', 'Hardware'],
    links: [],
    image_path: null,
    image_url: null,
    date: 'Ongoing',
    category: 'Engineering',
    featured: true,
    published: true,
  },
];

export async function publishedProjects() { return projects; }
export async function siteText(key: string, defaultValue: string) {
  const copy: Record<string, string> = {
    hero_subhead: 'I’m a developer, designer, and maker based in Edinburgh, Scotland. I build web projects, software, 3D-printed products, and other things I’m curious about.',
    about_headline: 'Developer. Designer. Maker.',
    about_bio: 'I’m Christo Esser, a developer, designer, and maker from Edinburgh, Scotland. I’m passionate about photography and cinematography, which I share on my YouTube channel, as well as 3D printing, engineering, and CAD. I’ve trained and competed in judo for over eight years.',
    contact_subhead: 'Have a question, a project idea, or something you think I should see?',
  };
  return copy[key] || defaultValue;
}
