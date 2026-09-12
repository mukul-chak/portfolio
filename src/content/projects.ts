export type Project = {
  slug: string;
  title: string;
  description: string;
  caseStudyHref: string;
  // Placeholder image count until real assets land. Max 6.
  imageCount: number;
  // Placeholder single-line caption per image, in image order. Replace with real copy.
  captions: string[];
};

const PITHY =
  "A pithy description of what the product is, why it was important, and how quickly we built this.";

// TODO: replace with real per-image captions.
const placeholderCaptions = (n: number) =>
  Array.from({ length: n }, (_, i) => `Caption for image ${i + 1} — replace with real copy.`);

export const projects: Project[] = [
  {
    slug: "direct-bill-automation",
    title: "Ascend Direct Bill Automation",
    description: PITHY,
    caseStudyHref: "#",
    imageCount: 6,
    captions: placeholderCaptions(6),
  },
  {
    slug: "cash-application",
    title: "Ascend Cash Application",
    description: PITHY,
    caseStudyHref: "#",
    imageCount: 5,
    captions: placeholderCaptions(5),
  },
  {
    slug: "project-three",
    title: "Ascend Project Three",
    description: PITHY,
    caseStudyHref: "#",
    imageCount: 4,
    captions: placeholderCaptions(4),
  },
  {
    slug: "project-four",
    title: "Ascend Project Four",
    description: PITHY,
    caseStudyHref: "#",
    imageCount: 6,
    captions: placeholderCaptions(6),
  },
];
