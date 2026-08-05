import type { Photo, Project } from '@christoesser/shared';

// The public site is intentionally provider-independent. Content can later be
// generated into this module or loaded from a public API without adding auth or
// private storage credentials to the visitor-facing application.
export const photos: Photo[] = [];
export const projects: Project[] = [];

export function publishedPhotos() {
  return photos.filter((photo) => photo.published);
}

export function publishedProjects() {
  return projects.filter((project) => project.published);
}
