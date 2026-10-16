// Render + deliver one "stile Kallaway" reel.
//   node kw-kit/deliver.cjs <reel dir> <DD> [posterSeconds]
// → raw-4k.mp4 (portrait 4K render) ·
//   "2026-10-DD - INFOGRAFICA KALLAWAY STYLE (4K, senza copertina).mp4" (clean copy for editing) ·
//   only with posterSeconds: poster.jpg (best settled frame) +
//   "2026-10-DD - INFOGRAFICA KALLAWAY STYLE (4K).mp4" (poster baked as frame 0)
// Dall'11/10 l'utente vuole solo la versione senza copertina (monta in DaVinci): si lancia senza posterSeconds.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const VER = "0.8.138";
const dir = path.resolve(process.argv[2]);
const dd = process.argv[3];
const poster = process.argv[4];
const comp = path.join(dir, "composition");
// la shell serve solo a npx su Windows: ffmpeg va lanciato senza, altrimenti i nomi con spazi e parentesi ("… (4K).mp4") si rompono
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd: cwd || dir, stdio: ["ignore", "inherit", "inherit"], shell: process.platform === "win32" && cmd === "npx" });

const t0 = Date.now();
run("npx", ["--yes", `hyperframes@${VER}`, "render", "--resolution", "portrait-4k", "--quality", "delivery", "--workers", "4", "--quiet", "-o", "../raw-4k.mp4"], comp);
const name = `2026-10-${dd} - INFOGRAFICA KALLAWAY STYLE (4K)`;
const clean = `${name.replace("(4K)", "(4K, senza copertina)")}.mp4`;
fs.copyFileSync(path.join(dir, "raw-4k.mp4"), path.join(dir, clean));
let out = clean;
if (poster) {
  run("ffmpeg", ["-v", "error", "-y", "-ss", poster, "-i", "raw-4k.mp4", "-frames:v", "1", "-q:v", "2", "poster.jpg"]);
  run("ffmpeg", ["-v", "error", "-y", "-i", "raw-4k.mp4", "-i", "poster.jpg", "-filter_complex", "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]", "-map", "[v]", "-map", "0:a?", "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", `${name}.mp4`]);
  out = `${name}.mp4`;
}
const probe = execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height,nb_frames", "-show_entries", "format=duration", "-of", "compact", out], { cwd: dir }).toString();
console.log(probe.trim());
console.log(`delivered reel ${dd} in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
