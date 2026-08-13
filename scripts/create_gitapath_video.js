const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const dir = path.join(__dirname, "../public/media/projects/gitapath");
const f1 = path.join(dir, "gitapath-concept.png");
const f2 = path.join(dir, "gitapath-ui.png");
const f3 = path.join(dir, "gitapath-heritage.png");
const f4 = path.join(dir, "gitapath-hero-river.png");
const outMp4 = path.join(dir, "gitapath-teaser.mp4");
const outWebm = path.join(dir, "gitapath-teaser.webm");

console.log("Generating GitaPath 10-second looping video...");

// Generate smooth 60fps MP4 video with subtle pan/zoom & crossfades
const cmdMp4 = `ffmpeg -y -loop 1 -t 3 -i "${f1}" -loop 1 -t 3 -i "${f2}" -loop 1 -t 3 -i "${f3}" -loop 1 -t 3 -i "${f4}" -filter_complex "[0:v]scale=1920:1200,zoompan=z='min(zoom+0.001,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=1280x800,fade=t=in:st=0:d=0.5,fade=t=out:st=2.5:d=0.5[v0]; [1:v]scale=1920:1200,zoompan=z='min(zoom+0.001,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=1280x800,fade=t=in:st=0:d=0.5,fade=t=out:st=2.5:d=0.5[v1]; [2:v]scale=1920:1200,zoompan=z='min(zoom+0.001,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=1280x800,fade=t=in:st=0:d=0.5,fade=t=out:st=2.5:d=0.5[v2]; [3:v]scale=1920:1200,zoompan=z='min(zoom+0.001,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=180:s=1280x800,fade=t=in:st=0:d=0.5,fade=t=out:st=2.5:d=0.5[v3]; [v0][v1][v2][v3]concat=n=4:v=1:a=0[v]" -map "[v]" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 22 -an "${outMp4}"`;

try {
  execSync(cmdMp4, { stdio: "inherit" });
  console.log("MP4 generated successfully:", outMp4);
} catch (err) {
  console.error("Error generating MP4:", err);
}

// Generate WebM format fallback
const cmdWebm = `ffmpeg -y -i "${outMp4}" -c:v libvpx-vp9 -crf 30 -b:v 0 -an "${outWebm}"`;
try {
  execSync(cmdWebm, { stdio: "inherit" });
  console.log("WebM generated successfully:", outWebm);
} catch (err) {
  console.error("Error generating WebM:", err);
}
