# Project Hover Videos

Drop short looping preview videos here using the exact filenames below. Each card on the site will auto-play its matching video on hover and reset to the static screenshot on leave.

## Expected filenames

| Card                 | MP4 filename                    | Optional WebM                    |
| -------------------- | ------------------------------- | -------------------------------- |
| LegacyLazarus        | `legacy-lazarus.mp4`            | `legacy-lazarus.webm`            |
| Macala Agent         | `macala-agent.mp4`              | `macala-agent.webm`              |
| CivicNerve           | `civicnerve.mp4`                | `civicnerve.webm`                |
| Sentinel Ledger      | `sentinel-ledger.mp4`           | `sentinel-ledger.webm`           |
| LinkUpGeo            | `linkupgeo.mp4`                 | `linkupgeo.webm`                 |
| Chain Quest          | `chain-quest.mp4`               | `chain-quest.webm`               |
| Skhokho (flagship)   | `skhokho.mp4`                   | `skhokho.webm`                   |

Chain Quest also needs a poster image at `assets/chain-quest.png` — otherwise the card falls back to the placeholder.

## Recommended video specs

- **Length**: 6–15 seconds, looping cleanly.
- **Dimensions**: 1280×720 or 1600×900. The card crops via `object-fit: cover`, so anything 16:9ish is fine.
- **Codec**: H.264 MP4 for universal support. WebM (VP9) is optional and loads first where supported.
- **Size**: aim for < 1.5 MB per clip. The site only loads a video after the user actually hovers (`preload="none"`), so you won't blow up first-paint if they're bigger.
- **Audio**: strip it. Videos autoplay muted.

## Tips

- Record a short screen capture of the app running (Loom, OBS, or just the browser dev tools record). Show the core moment — the AI responding, a page transition, a gameplay beat.
- Trim with `ffmpeg -ss 0 -i input.mov -t 10 -an -vcodec libx264 -crf 23 -pix_fmt yuv420p legacy-lazarus.mp4` or similar.
- If you don't have a video for a card yet, just skip it. The static screenshot keeps showing and hover becomes a no-op. No errors.
