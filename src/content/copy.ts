/**
 * The site's copy, read from copy.md and shaped for the components. This is
 * the only module that knows copy.md's layout; everything else imports
 * `copy` (or the helpers below) and carries no copy of its own.
 *
 * Built once, when the module loads: a missing, misspelled or unused entry
 * in copy.md throws here, which fails `next build` and the resume script.
 */
import source from "./copy.md";
import { CopyReader, fill, parseCopy, parseInline, type Inline } from "./parseCopy";

export { fill, type Inline };

/** Every organisation with a hover note. Media keyed by these lives in previews.ts. */
export const ORG_KEYS = ["ascend", "saag", "fidelity", "bd", "massart", "bu", "risd", "rvce"] as const;
export type OrgKey = (typeof ORG_KEYS)[number];

function orgKey(name: string, where: string): OrgKey {
  if (!(ORG_KEYS as readonly string[]).includes(name)) {
    throw new Error(`copy.md: "${name}" in ${where} isn't an organisation (${ORG_KEYS.join(", ")})`);
  }
  return name as OrgKey;
}

export type Role = {
  id: OrgKey;
  /** As printed on the resume. */
  org: string;
  /** The page's fuller name, where it differs. */
  siteOrg?: string;
  title: string;
  /** The page's shorter title, where it differs. */
  siteTitle?: string;
  /** "2024–Present"; the page swaps "Present" for `experience.ongoing`. */
  dates: string;
  href: string;
  points: string[];
};

export type ListEntry = {
  id: OrgKey;
  org: string;
  href: string;
  /** The line under the org: a degree, or a role and department. */
  detail: string;
  dates: string;
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  type: string;
  captions: string[];
};

function build() {
  const root = new CopyReader(parseCopy(source));

  const orgsNode = root.child("Organisations");
  const orgs = Object.fromEntries(
    ORG_KEYS.map((key) => {
      const o = orgsNode.child(key);
      return [key, { href: o.field("Link"), preview: o.field("Preview"), siteLine: o.optional("Site line") }];
    }),
  ) as Record<OrgKey, { href: string; preview: string; siteLine?: string }>;

  const siteNode = root.child("Site");
  const site = {
    name: siteNode.field("Name"),
    role: siteNode.field("Role"),
    email: siteNode.field("Email"),
    location: siteNode.field("Location"),
    pageTitle: siteNode.field("Page title"),
    pageDescription: siteNode.field("Page description"),
  };

  const bioNode = root.child("Bio");
  const bioParagraph = parseInline(bioNode.paragraph());
  for (const part of bioParagraph) if (part.link) orgKey(part.link, "the bio");
  const bio = {
    paragraph: bioParagraph as (Inline & { link?: OrgKey })[],
    aboutLink: bioNode.field("About link"),
    copyEmailLink: bioNode.field("Copy email link"),
    contactLink: bioNode.field("Contact link"),
  };

  const workNode = root.child("Work");
  const work = {
    title: workNode.field("Title"),
    projects: workNode.children().map(
      (p): Project => ({
        slug: p.node.name,
        title: p.field("Title"),
        year: p.field("Year"),
        type: p.field("Type"),
        captions: p.items(),
      }),
    ),
  };

  const listEntry = (e: CopyReader): ListEntry => {
    const id = orgKey(e.node.name, e.node.path);
    return {
      id,
      org: e.field("Organisation"),
      href: orgs[id].href,
      detail: e.field("Detail"),
      dates: e.field("Dates"),
    };
  };

  const expNode = root.child("Experience");
  const experience = {
    title: expNode.field("Title"),
    downloadResume: expNode.field("Download resume"),
    pdfFormat: expNode.field("PDF format"),
    markdownFormat: expNode.field("Markdown format"),
    resumeDocumentTitle: expNode.field("Resume document title"),
    ongoing: expNode.field("Ongoing on site"),
    summary: expNode.paragraph(),
    roles: expNode.children().map((r): Role => {
      const id = orgKey(r.node.name, r.node.path);
      return {
        id,
        org: r.field("Organisation"),
        siteOrg: r.optional("Organisation on site"),
        title: r.field("Title"),
        siteTitle: r.optional("Title on site"),
        dates: r.field("Dates"),
        href: orgs[id].href,
        points: r.paragraphs(),
      };
    }),
  };

  const teachNode = root.child("Teaching");
  const teaching = {
    title: teachNode.field("Title"),
    summary: teachNode.paragraph(),
    entries: teachNode.children().map(listEntry),
  };

  const eduNode = root.child("Education");
  const education = { title: eduNode.field("Title"), entries: eduNode.children().map(listEntry) };

  const contactNode = root.child("Contact");
  const contact = { title: contactNode.field("Title"), copyHint: contactNode.field("Copy hint") };

  const socials = root
    .child("Socials")
    .entries()
    .map(([label, href]) => ({ label, href }));

  const footerNode = root.child("Footer");
  const footer = {
    colophon: footerNode.paragraph(),
    quote: footerNode.field("Quote"),
    quoteAuthor: footerNode.field("Quote author"),
    quoteSource: footerNode.field("Quote source"),
    backToTop: footerNode.field("Back to top"),
  };

  const formNode = root.child("Contact form");
  const contactForm = {
    title: formNode.field("Title"),
    toLabel: formNode.field("To label"),
    fromLabel: formNode.field("From label"),
    subjectLabel: formNode.field("Subject label"),
    fromPlaceholder: formNode.field("From placeholder"),
    subjectPlaceholder: formNode.field("Subject placeholder"),
    shortSubjectPlaceholder: formNode.field("Short subject placeholder"),
    messagePlaceholder: formNode.field("Message placeholder"),
    hint: formNode.field("Hint"),
    cancel: formNode.field("Cancel"),
    send: formNode.field("Send"),
    sending: formNode.field("Sending"),
    missingEmail: formNode.field("Missing email"),
    invalidEmail: formNode.field("Invalid email"),
    missingSubject: formNode.field("Missing subject"),
    missingMessage: formNode.field("Missing message"),
    sentTitle: formNode.field("Sent title"),
    sentBody: formNode.field("Sent body"),
    sendFailed: formNode.field("Send failed"),
  };

  const about = { title: root.child("About drawer").field("Title") };

  const notices = { emailCopied: root.child("Notices").field("Email copied") };

  const a11yNode = root.child("Screen reader labels");
  const a11y = {
    themeSystem: a11yNode.field("Theme system"),
    themeLight: a11yNode.field("Theme light"),
    themeDark: a11yNode.field("Theme dark"),
    closeDrawer: a11yNode.field("Close drawer"),
    nameLink: a11yNode.field("Name link"),
    imageDots: a11yNode.field("Image dots"),
    imageDot: a11yNode.field("Image dot"),
    messageField: a11yNode.field("Message field"),
  };

  root.assertAllUsed();

  return {
    site,
    bio,
    work,
    experience,
    teaching,
    education,
    contact,
    socials,
    footer,
    orgs,
    contactForm,
    about,
    notices,
    a11y,
  };
}

export const copy = build();

/** Dates as the page shows them: "Present" becomes `experience.ongoing`. */
export const siteDates = (dates: string) => dates.replace("Present", copy.experience.ongoing);
