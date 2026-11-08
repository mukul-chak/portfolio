export type Project = {
  slug: string;
  title: string;
  year: string;
  // One of: Product Design, Brand, Art Direction, Motion.
  type: string;
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
    year: "2025", // TODO: confirm
    type: "Product Design", // TODO: confirm
    description: PITHY,
    caseStudyHref: "#",
    imageCount: 6,
    captions: [
      "Every carrier statement, reconciled to zero",
      "From carrier statement to AMS, in one pass",
      "Cora AI matches 130 commission entries as they load",
      "Map a carrier’s terms once, and matching reruns itself",
      "Cora AI finds the near miss and shows the difference",
      "Every post to the AMS, on the record",
    ],
  },
  {
    slug: "cash-application",
    title: "Ascend Cash Application",
    year: "2024", // TODO: confirm
    type: "Product Design", // TODO: confirm
    description: PITHY,
    caseStudyHref: "#",
    imageCount: 5,
    captions: placeholderCaptions(5),
  },
  {
    slug: "project-three",
    title: "Ascend Project Three",
    year: "2025", // TODO: confirm
    type: "Brand", // TODO: confirm
    description: PITHY,
    caseStudyHref: "#",
    imageCount: 4,
    captions: placeholderCaptions(4),
  },
  {
    slug: "project-four",
    title: "Ascend Project Four",
    year: "2025", // TODO: confirm
    type: "Motion", // TODO: confirm
    description: PITHY,
    caseStudyHref: "#",
    imageCount: 6,
    captions: placeholderCaptions(6),
  },
];
