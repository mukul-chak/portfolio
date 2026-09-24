/**
 * Copy for the Profile drawer.
 *
 * Transcribed verbatim from the design reference — this is reference text
 * about Theresa Hak Kyung Cha, not real profile copy. Replace the blocks
 * below when the actual writing lands; nothing in the components depends on
 * this specific content, only on the block shapes.
 *
 * `*emphasis*` renders italic (see withEmphasis in ProfileDrawer).
 */

export type Annotation = {
  /** Shown as-is, e.g. "01" — zero-padded here so the order is explicit. */
  index: string;
  text: string;
};

export type ProfileBlock =
  | {
      type: "paragraph";
      text: string;
      /** Sits in the side column, its top aligned to this paragraph's top. */
      annotation?: Annotation;
    }
  | { type: "pullquote"; text: string };

export const profileBlocks: ProfileBlock[] = [
  {
    type: "paragraph",
    text: "In what is commonly referred to as her magnum opus, *Dictée*—first published by Tanam Press months before her death in 1982—Theresa Hak Kyung Cha speaks of writing as a mode of survival and a means of abolishing time: “She says to herself if she were able to write she could continue to live.”",
    annotation: {
      index: "01",
      text: "Cha’s family, like many Korean families of the first half of the 20th century, underwent repeated displacements. Her parents were born in the 1920s in Manchuria.",
    },
  },
  {
    type: "pullquote",
    text: "[T]he casting of the Asian as “inscrutable other” also suggests a racialization wherein the other knows something that cannot be accessed from without.",
  },
  {
    type: "paragraph",
    text: "To claim inscrutability from an Asian diasporic positionality, then, is to protect a creative space and time in which minoritized lifeworlds may exist for their own audience.",
    annotation: {
      index: "02",
      text: "Cha sought in her work to embody Roland Barthes’s conception of pluralities, citing in a text accompanying her MFA thesis, *Paths*, the “[p]lurality of entrances, the opening of networks, the infinity of languages” that the latter writes of in *S/Z* (1970).",
    },
  },
  {
    type: "paragraph",
    text: "To exist for our own audience, in excess of our own identification: Cha’s practice glimmers beyond the identitarian confines of her myriad positionalities, as a multilingual Korean American who lived across three continents, and an artist-writer whose work enumerates the possibilities of language, image, voice, and embodiment across verbal, visual, and sonic registers.",
  },
];
