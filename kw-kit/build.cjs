// Build for the "stile Kallaway" HyperFrames reels (test, isolated from hf-kit).
//   node kw-kit/build.cjs <reel dir>
// Reads <dir>/index.src.html and writes <dir>/composition/index.html:
//  · scaffolds composition/ (assets, hyperframes.json, package.json, meta.json) on first run
//  · inlines kw-kit/kit.js + kw-kit/kit2-*.js at /*__KIT__*/
//  · <!--WORDS path.ts--> injects the voice-over word timings as `const WORDS` (kit2 helpers: at(), wordsFrom())
//  · inlines every Lucide icon the source or the kit mentions at __ICONS__
//  · expands the <!--SFX ... --> cue block into <audio> tags (id, real duration, free lane)
const fs = require("fs");
const path = require("path");

const KIT = __dirname;
const ROOT = path.resolve(KIT, "..", "..");
const LUCIDE = path.join(ROOT, "my-video-ottobre-p1-test/node_modules/lucide-react/dist/esm/icons");
const dir = path.resolve(process.argv[2] || ".");
const comp = path.join(dir, "composition");

// ── scaffold (assets are re-synced every build so kit asset edits propagate) ──
fs.mkdirSync(comp, { recursive: true });
// copy only new/changed files (a running preview keeps fonts open on Windows)
const sync = (a, b) => {
  fs.mkdirSync(b, { recursive: true });
  for (const e of fs.readdirSync(a, { withFileTypes: true })) {
    const s = path.join(a, e.name), d = path.join(b, e.name);
    if (e.isDirectory()) { sync(s, d); continue; }
    const ss = fs.statSync(s);
    if (fs.existsSync(d)) { const ds = fs.statSync(d); if (ds.size === ss.size && ds.mtimeMs >= ss.mtimeMs) continue; }
    try { fs.copyFileSync(s, d); } catch (err) { console.warn(`skip ${e.name}: ${err.code}`); }
  }
};
sync(path.join(KIT, "assets"), path.join(comp, "assets"));
// reel-local assets (clips, avatars…) live next to the source
if (fs.existsSync(path.join(dir, "assets"))) sync(path.join(dir, "assets"), path.join(comp, "assets"));
for (const f of ["hyperframes.json", "package.json", "CLAUDE.md", "AGENTS.md"]) if (!fs.existsSync(path.join(comp, f))) fs.copyFileSync(path.join(KIT, "scaffold", f), path.join(comp, f));
if (!fs.existsSync(path.join(comp, "meta.json"))) {
  const id = "kw-" + path.basename(dir).replace(/[^a-z0-9-]/gi, "-");
  fs.writeFileSync(path.join(comp, "meta.json"), JSON.stringify({ id, name: id, createdAt: new Date().toISOString() }, null, 2));
}

let src = fs.readFileSync(path.join(dir, "index.src.html"), "utf8");
const rawSrc = src; // sorgente prima del kit: decide quali atlanti entrano nel pool
// kit.js first, then the v2 modules (kit2-*.js, alphabetical) measured on the 150 Kallaway reels
const kitFiles = ["kit.js", ...fs.readdirSync(KIT).filter((f) => /^kit2-.*\.js$/.test(f)).sort()];

// ── WORDS: <!--WORDS path/to/dNN.ts--> → const WORDS = [[word, startSec, endSec], …] (30 fps frames) ──
let words = [];
src = src.replace(/<!--WORDS\s+([^\s]+)\s*-->/, (m, rel) => {
  const f = path.resolve(dir, rel);
  const t = fs.readFileSync(f, "utf8");
  words = [...t.matchAll(/\[\s*"((?:[^"\\]|\\.)*)"\s*,\s*(\d+)\s*,\s*(\d+)\s*\]/g)].map((x) => [JSON.parse(`"${x[1]}"`), +(+x[2] / 30).toFixed(3), +(+x[3] / 30).toFixed(3)]);
  return `<!-- words: ${path.basename(f)} (${words.length}) -->`;
});

// ── SFX ──
const FILE = { bell: "bell.ogg", bong: "bong.ogg", card: "card.ogg", click: "click.ogg", click2: "click2.ogg", ding: "ding.wav", drop: "drop.ogg", error: "error.ogg", glitch: "glitch.ogg", key1: "key1.wav", key2: "key2.wav", key3: "key3.wav", key4: "key4.wav", key5: "key5.wav", key6: "key6.wav", land: "land.ogg", land2: "land2.ogg", pop: "pop.wav", rise: "rise.wav", slam: "slam.ogg", sub: "sub.wav", tap: "tap.ogg", tick: "tick.wav", toggle: "toggle.ogg", whoosh: "whoosh.wav" };
const LEN = { "bell.ogg": 1.5, "bong.ogg": 0.15, "card.ogg": 0.62, "click.ogg": 0.05, "click2.ogg": 0.05, "ding.wav": 0.72, "drop.ogg": 0.22, "error.ogg": 0.52, "glitch.ogg": 0.05, "key1.wav": 0.27, "key2.wav": 0.27, "key3.wav": 0.27, "key4.wav": 0.27, "key5.wav": 0.27, "key6.wav": 0.27, "land.ogg": 0.2, "land2.ogg": 0.17, "pop.wav": 0.24, "rise.wav": 1.22, "slam.ogg": 0.56, "sub.wav": 1.12, "tap.ogg": 0.08, "tick.wav": 0.08, "toggle.ogg": 0.63, "whoosh.wav": 0.57 };
const total = Number((src.match(/data-composition-id="main"[^>]*data-duration="([\d.]+)"/) || src.match(/data-duration="([\d.]+)"/))[1]);
const lanes = [];
let n = 0;
const lane = (start, dur) => {
  let l = lanes.findIndex((end) => end <= start - 0.01);
  if (l < 0) l = lanes.push(0) - 1;
  lanes[l] = start + dur;
  return l + 3;
};
src = src.replace(/<!--SFX([\s\S]*?)-->/, (m, body) => {
  const cues = [];
  for (const raw of body.split(/\n|;/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const [t, name, vol] = line.split(/\s+/);
    if (!FILE[name]) throw new Error("unknown sfx " + name);
    cues.push([Number(t), name, Number(vol || 0.2)]);
  }
  cues.sort((a, b) => a[0] - b[0]);
  return cues
    .filter(([t, name]) => t + LEN[FILE[name]] <= total + 0.001 || (console.warn(`drop sfx ${name}@${t} (past end)`), false))
    .map(([t, name, v]) => {
      const f = FILE[name], d = LEN[f];
      return `<audio id="s${String(++n).padStart(3, "0")}-${name}" src="assets/sfx/${f}" data-start="${t}" data-duration="${d}" data-track-index="${lane(t, d)}" data-volume="${v}"></audio>`;
    })
    .join("\n      ");
});

// ── VIDEOS: "id src start dur [mediaStart]" per line → muted <video> elements in a hidden pool ──
let nv = 0;
src = src.replace(/<!--VIDEOS([\s\S]*?)-->/, (m, body) => {
  const tags = [];
  for (const raw of body.split("\n")) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const [id, file, start, dur, ms] = line.split(/\s+/);
    if (!fs.existsSync(path.join(comp, file))) throw new Error("missing video " + file);
    tags.push(`<video id="${id}" src="${file}" muted playsinline data-start="${start}" data-duration="${dur}"${ms ? ` data-media-start="${ms}"` : ""} data-track-index="${20 + (nv++ % 9)}"></video>`);
  }
  return `<div id="vpool" style="position:absolute;left:0;top:0;width:0;height:0;overflow:hidden">\n        ${tags.join("\n        ")}\n      </div>`;
});

// ── kit: inlined only now, so the <!--SFX/VIDEOS--> markers above can never match text inside the kit ──
// KW_FISSO: le composizioni già approvate (reel-01 v5, reel-03) hanno il marcatore "KW_FISSO" nel sorgente e tengono il
// comportamento approvato delle funzioni corrette nel Blocco 3, finché l'utente non vede e approva la versione nuova
// KW_RITMO (il contrario): solo le composizioni col marcatore "KW_RITMO" nel sorgente usano le regole del ritmo R1–R6
// (kit2-ritmo.js: niente back.out, spinta, popK, apertura) e i template (kit2-template.js); le altre non cambiano
const kit = `const WORDS = ${JSON.stringify(words)};\nconst KW_FISSO = ${rawSrc.includes("KW_FISSO")};\nconst KW_RITMO = ${rawSrc.includes("KW_RITMO")};\n` + kitFiles.map((f) => `// ──── ${f} ────\n` + fs.readFileSync(path.join(KIT, f), "utf8")).join("\n");
src = src.replace("/*__KIT__*/", () => kit);

// ── icons: any quoted kebab token that names a Lucide icon ──
const icons = {};
for (const m of src.matchAll(/["'`]([a-z][a-z0-9]*(?:-[a-z0-9]+)*)["'`]/g)) {
  const n = m[1];
  if (icons[n] !== undefined) continue;
  const f = path.join(LUCIDE, n + ".js");
  if (!fs.existsSync(f)) { icons[n] = null; continue; }
  const t = fs.readFileSync(f, "utf8");
  const mm = t.match(/createLucideIcon\("[^"]*",\s*(\[[\s\S]*\])\);\s*\nexport/);
  if (!mm) { icons[n] = null; continue; }
  const nodes = Function("return " + mm[1])();
  icons[n] = nodes.map(([tag, a]) => { const b = { ...a }; delete b.key; return "<" + tag + " " + Object.entries(b).map(([k, v]) => `${k}="${v}"`).join(" ") + "/>"; }).join("");
}
for (const k of Object.keys(icons)) if (icons[k] === null) delete icons[k];
src = src.replace("__ICONS__", () => JSON.stringify(icons));

// ── IMAGES: every file in kw-kit/assets/obj (3D objects) and kw-kit/assets/avatars (real profile photos) becomes a
// static <img> in a hidden pool — the render compiler only handles media present in the static HTML (like videos);
// the kit moves them into place with imgIn(parent, "obj-cervello") / imgIn(parent, "av-hormozi").
const ipool = [];
for (const [dirName, pre] of [["obj", "obj-"], ["avatars", "av-"], ["thumbs", "th-"]]) {
  const d = path.join(KIT, "assets", dirName);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).sort()) {
    if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
    const id = pre + f.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    ipool.push(`<img id="${id}" src="assets/${dirName}/${f}" alt="">`);
  }
}
// atlanti (assets/atlas/<nome>.jpg, griglie di miniature di reel veri per i muri K11): solo se la composizione li usa
const dA = path.join(KIT, "assets", "atlas");
if (fs.existsSync(dA)) for (const f of fs.readdirSync(dA).sort()) {
  if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
  const nm = f.replace(/\.[^.]+$/, "").toLowerCase();
  if (rawSrc.includes("atlas-" + nm) || (nm === "muro" && /wallScroll\(|faceDot\(|volti:|raceChart\(|commentBurst\(|hookCatch\(|TPL\.K11\(/.test(rawSrc))) ipool.push(`<img id="atlas-${nm}" src="assets/atlas/${f}" alt="">`);
}
if (ipool.length) src = src.replace('<div id="stage">', () => `<div id="stage">
        <div id="ipool" style="position:absolute;left:0;top:0;width:0;height:0;overflow:hidden">${ipool.join("")}</div>`);

fs.writeFileSync(path.join(comp, "index.html"), src);
console.log(`${path.relative(ROOT, comp)}/index.html · ${Object.keys(icons).length} icons · ${n} sfx cues on ${lanes.length} lanes · ${nv} videos`);
