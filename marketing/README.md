# AdaptIQ public frontend

## Direction and reference review

An editorial, warm-white public site with a dark interview studio as its primary visual language. Blue identifies decisions and actions. Quiet green distinguishes illustrative learning data; there are no gradients, decorative illustrations, testimonial inventions, or customer-logo claims.

Reviewed on September 29, 2026:

- [Lando Norris](https://landonorris.com/): desktop 1440px and mobile 390px screenshots and scroll sequences. Persistent navigation, typography moving through a shared visual field, shifts between light and dark scenes, controlled image overlap, and interactive interruption of the scroll story. AdaptIQ translates these into a persistent interview surface rather than copying its imagery, colors, typography, or motorsport identity.
- [HireVue](https://www.hirevue.com/), [video interviewing](https://www.hirevue.com/solutions/video-interviewing), [AI interviewer](https://www.hirevue.com/solutions/ai-interviewer), and [enterprise security](https://www.hirevue.com/platform/enterprise-security-compliance): immediate value proposition, product/demo pairing, workflow-based explanation, numerical proof with ownership, and a dedicated trust layer. Browser screenshots and page content reviewed; some reference media did not load.
- [Salesforce](https://www.salesforce.com/): page content reviewed for outcome-led introductions, product demonstrations, segmented use cases, repeated conversion opportunities, and trust. Its live browser request returned Access Denied, so visual browser inspection was unavailable.

Seven translated principles: conventional navigation; immediate product visibility; a persistent visual object; typographic story chapters; evidence before interpretation; proof next to attribution; repeated CTAs after meaningful explanations.

## Existing architecture and reused behavior

The app is plain HTML/CSS/JavaScript and an Express backend, not React/Next.js. No framework migration is needed for this homepage. Firebase hosts the live public pages. `/app` and `/` are home; `/interview` is the existing interview studio. Home is public and never automatically redirects a signed-in user. The studio owns Firebase Google sign-in. Review requests verify Firebase ID tokens on the backend.

The redesign reuses the studio's question/camera arrangement, four review stages, current feedback vocabulary, practice CTA, branding, and real privacy architecture. It does not replace the recorder, sensors, Jev integration, or account logic. No analytics/event-tracking integration was found in the current public page, auth entry, or studio; none was added.

## Modules

- `components.mjs`: reusable navigation, interview/signal/coaching surfaces, profile/report scenes, statistics, organization preview, privacy story, closing CTA, and accessible native dialog.
- `content.mjs`: fictional demo records and proposed coaching-preference examples, separate from business state.
- `main.js`: interaction controls, timeline scrubbing, profile keyboard/swipe behavior, metrics, cohort selection, and dialog focus restoration.
- `motion.js`: one GSAP/ScrollTrigger story timeline, responsive setup/cleanup, and secondary connected section timelines. Native scroll is retained; Lenis is unnecessary here.
- `site.css`: public-only design system; does not change the authenticated studio's dark theme.

Desktop sequence: hero → expanded interview → gaze/voice/structure → context → coaching → selectable preferences → report. The same product DOM remains mounted throughout. Smaller viewports and reduced-motion settings use a complete vertical layout, one signal at a time, and tap/keyboard/swipe profile selection. No long mobile pinning. A persisted Simple view setting is available independently of the operating system preference. Without JavaScript, the page remains readable and all three profile examples are expanded.

## Product truth

Current studio: editable template questions, per-question recording, silent replay, audio-only replay, full replay, skipping reviews, automatic Jev analysis from transcript and measured estimates with disclosure before starting. The review service must be configured and reachable for Jev observations. Saved duration guidance and practice encouragement also work during service failures.

Concepts, labeled at the point of use: live coaching interventions, ADHD/anxiety/autism preference examples, saved session history/readiness progression, organization dashboards. Preference examples are chosen by the learner, not inferred diagnoses. No camera metric is presented as confidence, ability, emotion, or hiring suitability. Demonstration scores are fictional.

Privacy: raw recordings stay in browser memory and are released on advancement/finish. Optional analysis sends the question, transcript, and timestamped estimates to TypeSafe. Browser speech recognition may send audio to its provider. No certification or institutional-deployment claims are made.

Industry evidence: HireVue's homepage stated 70 million interviews and 200 million assessments on the access date above. Attribution and an explicit distinction from AdaptIQ metrics are visible on the page. Hackathon recognition comes from the existing project content and the user's supplied brief.

## Asset provenance

`assets/interview-demo.jpg` is an AI-generated, fictional webcam portrait, produced with the built-in image-generation tool (not a real user, customer, or testimonial). Final prompt: “Photorealistic-natural webcam photograph for a clearly labeled fictional interview software demo. An adult woman around 28, medium brown skin, dark brown curly shoulder-length hair, a charcoal-blue crewneck knit top, seated facing a laptop camera at eye level in a restrained home office. Chest-up, natural skin texture, softly lit pale gray background with a small plant and bookshelf. Slight friendly smile, explaining a work project. No interface, text, logos, watermark, graphics, illustration, or 3D.” Optimized to a local 1280px JPEG (~192 KB). No remote image hotlinking.

## Build and verification

`npm run build:review` builds the public homepage and interview studio into the existing ignored public output. Only public marketing modules, CSS, local GSAP distributions, the demo portrait, and the studio's existing assets are published. Use `REVIEW_API_ORIGIN` only when the API is actually reachable over HTTPS.

`node scripts/serve-public.mjs` serves that output on 127.0.0.1:4175. `node tests/marketing-browser.cjs` checks desktop/tablet/mobile navigation, overflow, profile selection, metrics, scrubbing, dialog dismissal, reduced-motion, and no-JavaScript content; screenshots are written to ignored `data/marketing-qa`. Override `PLAYWRIGHT_EXECUTABLE_PATH` for a locally installed browser if necessary.

Verified at 1440, 1024, 768, 430, 390, and 375 CSS pixels with no horizontal page overflow or browser exceptions. Additional checks cover manual profile selection during the scroll story, persisted Simple view, resize cleanup, a short 650px viewport, a 720px layout equivalent to 200% zoom on a 1440px screen, modal keyboard focus/return, and all profile content with JavaScript disabled. A 2.2-second headless desktop scroll sample recorded a 16.7ms median frame interval and zero intervals over 33ms; this is a local observation, not a guarantee for all devices. The existing 18 review tests pass.
