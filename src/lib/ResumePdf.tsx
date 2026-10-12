import path from "node:path";
import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { roles, education, summary } from "@/content/resume";
import { PREVIEW_CAPTIONS } from "@/content/previews";
import { EMAIL, LOCATION } from "@/content/site";
import { RESUME_NAME, RESUME_ROLE } from "@/lib/resumeExport";

const FONTS = path.join(process.cwd(), "public/fonts");

// The site's own faces, embedded (subset) in the PDF. Weight 500 is the
// SemiExtendedMedium cut, as in layout.tsx.
Font.register({
  family: "Reform",
  fonts: [
    { src: path.join(FONTS, "Reform-GroteskRegular.otf"), fontWeight: 400 },
    { src: path.join(FONTS, "Reform-GroteskSemiExtendedMedium.otf"), fontWeight: 500 },
  ],
});
Font.register({ family: "Monument", src: path.join(FONTS, "MonumentRegular.otf") });
// No automatic hyphenation — the site doesn't hyphenate either.
Font.registerHyphenationCallback((word) => [word]);

// Light-mode AlignUI tokens. text-* as on the page; rules use stroke-sub-300
// (one tier darker than the page's stroke-soft-200), since #eaecf0 is too
// faint to survive most printers.
const C = {
  strong: "#0e121b", // text-strong-950
  sub: "#525866", // text-sub-600
  soft: "#99a0ae", // text-soft-400
  rule: "#cacfd8", // stroke-sub-300
};

// The page's type, scaled 18px → 10pt: body, titles and designations share
// one size as on the site; dates in Monument at the eyebrow's 16/18 ratio,
// captions at the preview caption's 14/18.
const BODY = 10;
const LEADING = 15;
const DATE = 9;
const CAPTION = 8;

// Letter, 0.75in margins. The date column is a quarter of the measure,
// echoing the site's channel (310 of the frame's 1240).
const MARGIN = 54;

// Line heights in absolute points. A unitless lineHeight in react-pdf
// multiplies the font's own line height (ascent + descent + gap), not its
// size — on Reform, 1.5 came out ~21pt, not 15.
const pt = (n: number) => `${n}pt`;
const MEASURE = 612 - MARGIN * 2;
const DATE_COL = MEASURE / 4;

const s = StyleSheet.create({
  page: { paddingVertical: MARGIN, paddingHorizontal: MARGIN, fontFamily: "Reform", fontSize: BODY, color: C.sub },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  name: { fontWeight: 500, color: C.strong, lineHeight: pt(LEADING) },
  contact: { fontFamily: "Monument", fontSize: DATE, lineHeight: pt(LEADING), textAlign: "right" },
  row: { flexDirection: "row" },
  dateCol: { width: DATE_COL },
  mainCol: { width: MEASURE - DATE_COL },
  rule: { borderTopWidth: 0.5, borderTopColor: C.rule, marginTop: 16, marginBottom: 10 },
  text: { lineHeight: pt(LEADING) },
  date: { fontFamily: "Monument", fontSize: DATE, lineHeight: pt(LEADING) },
  org: { fontWeight: 500, color: C.strong, textDecoration: "none", lineHeight: pt(LEADING) },
  caption: { fontFamily: "Monument", fontSize: CAPTION, color: C.soft, lineHeight: pt(12), marginTop: 2 },
  label: { fontFamily: "Monument", fontSize: DATE, lineHeight: pt(LEADING), marginBottom: 6 },
  points: { marginTop: 6 },
  point: { flexDirection: "row", marginTop: 3 },
  // Inset, not hung: the bullet sits on the column's edge and the text
  // indents past it, as on the page.
  bullet: { width: 9 },
  pointText: { flex: 1, lineHeight: pt(LEADING) },
});

function Entry({
  dates,
  org,
  href,
  subtitle,
  caption,
  children,
}: {
  dates: string;
  org: string;
  href: string;
  subtitle: string;
  caption: string;
  children?: React.ReactNode;
}) {
  // Date and org start level; DATE_BASELINE_SHIFT drops the date onto the
  // org's baseline.
  return (
    <View style={s.row} wrap={false}>
      <View style={s.dateCol}>
        <Text style={[s.date, { marginTop: DATE_BASELINE_SHIFT }]}>{dates}</Text>
      </View>
      <View style={s.mainCol}>
        <Link src={href} style={s.org}>
          {org}
        </Link>
        <Text style={s.text}>{subtitle}</Text>
        <Text style={s.caption}>{caption}</Text>
        {children}
      </View>
    </View>
  );
}

/**
 * Moves a Monument line down onto the baseline of the Reform line beside
 * it. react-pdf sets each line's baseline one ascent below the top of its
 * line box (extra leading goes underneath, unlike CSS), so two faces at
 * different sizes sharing a top sit their baselines apart by the
 * difference of their ascents. Ascents are the fonts' own (hhea, per em):
 * Reform Medium 951/1000, Monument 950/1000 — 9.51pt vs 8.55pt here, a
 * 0.96pt shift, which is what the unshifted PDF measured.
 */
const REFORM_ASCENT = 0.951;
const MONUMENT_ASCENT = 0.95;
const DATE_BASELINE_SHIFT = REFORM_ASCENT * BODY - MONUMENT_ASCENT * DATE;

export default function ResumePdf() {
  return (
    <Document title={`${RESUME_NAME} — Resume`} author={RESUME_NAME}>
      <Page size="LETTER" style={s.page}>
        <View style={s.header}>
          <View>
            <Text style={s.name}>{RESUME_NAME}</Text>
            <Text style={s.text}>{RESUME_ROLE}</Text>
          </View>
          <View style={{ marginTop: DATE_BASELINE_SHIFT }}>
            <Link src={`mailto:${EMAIL}`} style={[s.contact, { color: C.sub, textDecoration: "none" }]}>
              {EMAIL}
            </Link>
            <Text style={s.contact}>{LOCATION}</Text>
          </View>
        </View>

        <View style={s.rule} />
        <View style={s.row}>
          <View style={s.dateCol} />
          <View style={s.mainCol}>
            <Text style={s.text}>{summary}</Text>
          </View>
        </View>

        {roles.map((role) => (
          <View key={role.id}>
            <View style={s.rule} />
            <Entry
              dates={role.dates}
              org={role.org}
              href={role.href}
              subtitle={role.title}
              caption={PREVIEW_CAPTIONS[role.id]}
            >
              <View style={s.points}>
                {role.points.map((point) => (
                  <View key={point} style={s.point}>
                    {role.points.length > 1 && <Text style={s.bullet}>•</Text>}
                    <Text style={s.pointText}>{point}</Text>
                  </View>
                ))}
              </View>
            </Entry>
          </View>
        ))}

        <View style={s.rule} />
        <View style={s.row}>
          <View style={s.dateCol} />
          <View style={s.mainCol}>
            <Text style={s.label}>Education</Text>
          </View>
        </View>
        {education.map((school, i) => (
          <View key={school.id} style={{ marginTop: i === 0 ? 0 : 10 }}>
            <Entry
              dates={school.dates}
              org={school.org}
              href={school.href}
              subtitle={school.degree}
              caption={PREVIEW_CAPTIONS[school.id]}
            />
          </View>
        ))}
      </Page>
    </Document>
  );
}
