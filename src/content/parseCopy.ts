/**
 * Reads copy.md into a tree the copy module walks. Deliberately small: it
 * understands only the shapes copy.md uses (see the comment at its top).
 *
 * Every lookup is recorded, and `assertAllUsed` throws on anything nobody
 * read, so a misspelled label or a leftover entry fails the build instead
 * of silently vanishing from the site.
 */

export type CopyNode = {
  name: string;
  path: string;
  fields: Map<string, string>;
  paragraphs: string[];
  items: string[];
  children: Map<string, CopyNode>;
};

const FIELD = /^- ([^:]{1,40}): (.+)$/;
const ITEM = /^(?:\d+\.|-) (.+)$/;

function node(name: string, path: string): CopyNode {
  return { name, path, fields: new Map(), paragraphs: [], items: [], children: new Map() };
}

export function parseCopy(source: string): CopyNode {
  const root = node("", "copy.md");
  let section: CopyNode | null = null;
  let current = root;
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length) current.paragraphs.push(paragraph.join(" "));
    paragraph = [];
  };

  const lines = source.replace(/<!--[\s\S]*?-->/g, "").split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    const heading = /^(#{1,2}) (.+)$/.exec(line);
    if (heading) {
      flush();
      const [, hashes, name] = heading;
      const parent = hashes === "#" ? root : section;
      if (!parent) throw new Error(`copy.md: "## ${name}" has no "# Section" above it`);
      if (parent.children.has(name)) throw new Error(`copy.md: "${name}" appears twice in ${parent.path}`);
      const child = node(name, parent === root ? name : `${parent.path} › ${name}`);
      parent.children.set(name, child);
      current = child;
      if (hashes === "#") section = child;
      continue;
    }
    if (!line) {
      flush();
      continue;
    }
    const field = FIELD.exec(line);
    if (field) {
      flush();
      if (current.fields.has(field[1])) throw new Error(`copy.md: "${field[1]}" appears twice in ${current.path}`);
      current.fields.set(field[1], field[2]);
      continue;
    }
    const item = ITEM.exec(line);
    if (item) {
      flush();
      current.items.push(item[1]);
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return root;
}

/** Typed, tracked access to one node of the tree. */
export class CopyReader {
  private usedFields = new Set<string>();
  private usedChildren = new Set<string>();
  private usedParagraphs = false;
  private usedItems = false;
  private readers: CopyReader[] = [];

  constructor(readonly node: CopyNode) {}

  field(key: string): string {
    const value = this.node.fields.get(key);
    if (value === undefined) throw new Error(`copy.md: ${this.node.path} is missing "- ${key}: …"`);
    this.usedFields.add(key);
    return value;
  }

  optional(key: string): string | undefined {
    this.usedFields.add(key);
    return this.node.fields.get(key);
  }

  /** Every field, in order — for sections that are a plain label/value list. */
  entries(): [string, string][] {
    for (const key of this.node.fields.keys()) this.usedFields.add(key);
    return [...this.node.fields];
  }

  paragraphs(): string[] {
    this.usedParagraphs = true;
    return this.node.paragraphs;
  }

  paragraph(): string {
    const [first, ...rest] = this.paragraphs();
    if (!first || rest.length) throw new Error(`copy.md: ${this.node.path} needs exactly one paragraph`);
    return first;
  }

  items(): string[] {
    this.usedItems = true;
    return this.node.items;
  }

  child(name: string): CopyReader {
    const child = this.node.children.get(name);
    if (!child) throw new Error(`copy.md: ${this.node.path} is missing "${name}"`);
    this.usedChildren.add(name);
    const reader = new CopyReader(child);
    this.readers.push(reader);
    return reader;
  }

  children(): CopyReader[] {
    return [...this.node.children.keys()].map((name) => this.child(name));
  }

  assertAllUsed() {
    const unused = [
      ...[...this.node.fields.keys()].filter((k) => !this.usedFields.has(k)).map((k) => `"- ${k}:"`),
      ...[...this.node.children.keys()].filter((k) => !this.usedChildren.has(k)).map((k) => `"${k}"`),
    ];
    if (!this.usedParagraphs && this.node.paragraphs.length) unused.push(`text "${this.node.paragraphs[0].slice(0, 40)}…"`);
    if (!this.usedItems && this.node.items.length) unused.push(`list item "${this.node.items[0].slice(0, 40)}…"`);
    if (unused.length) {
      throw new Error(`copy.md: ${this.node.path || "top level"} has ${unused.join(", ")} that nothing on the site reads`);
    }
    this.readers.forEach((r) => r.assertAllUsed());
  }
}

/** Fills `{name}` placeholders. Throws on one it wasn't given a value for. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (!(key in values)) throw new Error(`copy.md: no value for {${key}} in "${template}"`);
    return String(values[key]);
  });
}

export type Inline = { text: string; link?: string };

/** Splits `[text](key)` links out of a line of copy. */
export function parseInline(text: string): Inline[] {
  const parts: Inline[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index) });
    parts.push({ text: m[1], link: m[2] });
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}
