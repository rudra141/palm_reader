# Content Plan — Per-Page Copy

> Locked at CP1. Drafts only — final voice tightened with brand name decision. Translation keys exposed in `/content/` for future locales.

---

## Voice principles

- **Decisive, never hedging.** Same voice as the AI's master-practitioner tone, but for marketing copy.
- **Restraint.** Aesop-like. White space is content.
- **No mystic adjectives.** No "ancient secrets," "unlock your destiny," "discover the mystical." We don't need to convince the reader something is mystical — we let the depth show.
- **No fortune-teller tropes.** No crystal balls in copy or imagery.
- **Short sentences.** Periods are tools.

---

## Landing — `/`

### Hero (over Beat 1 of the scroll story)

```
H1 (kinetic, large, restrained):
A reading from the original texts.

Sub:
Indian and Chinese palmistry, read by an AI grounded in the classical sources — not the pop-culture residue.

CTA:
Begin reading
```

### Section: How a reading is made (paired to scroll Beats 2–3)

```
H2:
Three steps. No theatre.

Step 1 — Upload.
A single photo of your palm. Well-lit. Fingers spread.
We delete it within 24 hours.

Step 2 — Choose a tradition.
Indian (Hasta Samudrika Shastra) or Chinese (Mian Xiang).
Each with its own canonical sub-styles.

Step 3 — Read.
A reading written in the master practitioner's register —
declarative, source-grounded, never wishy-washy.
```

### Section: Methodology preview (anchor to `/methodology`)

```
H2:
Why this is different.

Card 1 — From the source.
Every claim traces back to a primary classical text.
We don't blend traditions. We don't repackage Western pop-palmistry as Indian.

Card 2 — A practitioner's voice.
Decisive. Confident. The way a master speaks after twenty years of study.

Card 3 — Boundaries that hold.
No exact dates. No medical claims. No fortune-telling theatre.
Reflection, not prophecy.

CTA:
See the full methodology →
```

### Section: Final CTA (paired to scroll Beat 4 — the conversion beat)

```
H2 (large):
Ready when you are.

Body:
Your reading takes about 30 seconds and lasts a lifetime in your inbox.

CTA:
Begin reading
```

### Footer disclaimer line (small, present on every page)

```
This site offers readings for entertainment and reflection. Not medical, legal, or financial advice.
```

---

## Upload — `/upload`

### Step 1 — Photo

```
H1:
A clear photo of your dominant palm.

Body:
Three things make a reading good:
— Bright, even light. No harsh shadows.
— Palm fully open. Fingers naturally spread.
— Fill the frame. The hand should be the subject, not the room.

Hints (rotating, contextual):
"If you're indoors, face a window."
"Avoid tight rings or watch straps."
"It's fine if your hand isn't perfectly steady — we're forgiving."

CTA:
Take a photo / Upload from device
```

### Step 2 — A few details (optional)

```
H2:
A few details, if you'd like.

Body:
None of this is required. The reading works without it. But a name and a date of birth lets the practitioner address you directly.

Field labels:
- Your name (optional)
- Date of birth (optional)
- Gender (optional — male / female / non-binary / prefer not to say)
- This is your dominant hand (required toggle: yes / no — if no, ask which)
```

### Step 3 — Choose your tradition

```
H2:
Choose how you'd like to be read.

Body:
Each tradition has its own canonical texts and its own way of speaking. Pick one. The reading will be entirely in that voice.

Dropdown groups (populated from /docs/research.md):
— Indian (Hasta Samudrika Shastra)
   • Comprehensive Samudrika
   • Hasta-Rekha (line-focused)
   • Mount-based / planetary
— Chinese (Mian Xiang 面相)
   • Five Elements (Wu Xing 五行)
   • Classical Ma Yi (麻衣) lineage
   • Eight Trigrams (Bagua 八卦) palmistry

Tooltip on hover for each:
[short, one-paragraph description from research.md]
```

### Step 4 — Confirm

```
H2:
Two things to confirm.

Checkbox 1 (required):
I understand this reading is for entertainment and reflection — not medical, legal, or financial advice.

Checkbox 2 (optional, default off):
Save my reading and the photo. Otherwise we delete the photo within 24 hours and keep only the written reading in your account.

CTA:
Begin reading
```

### Loading state (during inference)

Progressive feedback strings, displayed in sequence:

```
Examining the major lines…
Reading the mounts…
Considering the finger ratios…
Synthesizing your reading…
Polishing the language…
```

---

## Report — `/report/[id]`

### Header

```
H1:
A reading for [Name, if provided] / "A reading"

Sub-header:
[Tradition name] · [Sub-style name] · [date]
```

### Section order (matching ai-spec)

1. **Opening** — "What I see."
2. **Character** — "Who you are."
3. **Mind** — "How you think."
4. **Heart** — "How you love and connect." (Emotional / relationships)
5. **Career** — "Your work."
6. **Wealth** — "Your relationship to material life."
7. **Health** — "Your constitution."
   - With mandatory health preamble (verbatim per ai-spec §6)
8. **Trajectory** — "How your life unfolds."
9. **Spirit** — "Your inner orientation." (only if `karmic_supported`)
10. **Strengths** — "What to lean into."
11. **Cautions** — "What to attend to."
12. **Closing** — "A parting word."

### Disclaimers (rendered persistent at footer of report)

```
Verbatim per /docs/ai-spec.md §6:

"This reading is offered for entertainment and reflection. It is one practitioner's view through one tradition, not a verdict on your life."

"Nothing here is medical, legal, financial, or professional advice. For decisions that matter, consult someone qualified in that domain."
```

### Action bar

```
- Download as PDF
- Share privately (generates a link)
- Save to my account (if not authed → prompts sign-up)
- Delete this reading (with confirmation)
```

---

## Methodology — `/methodology`

```
H1:
How the readings are grounded.

Lede:
This is not pop-palmistry with an AI veneer. The product is built on two principles, simple to state and unforgiving in execution.

H2:
Principle one — every claim traces to a source.

Body:
The readings draw from the canonical texts of two traditions: Hasta Samudrika Shastra in Indian palmistry, and the Mian Xiang lineage in Chinese palmistry. Within each tradition, we offer multiple sub-styles. Each sub-style has its own primary classical sources and its own way of speaking. We never blend them. We never substitute Western pop-palmistry for Indian classical sources, and we never present generic Chinese astrology as palmistry.

H3 — Indian tradition
Body: [populate from research.md once domain-researcher returns]

H3 — Chinese tradition
Body: [populate from research.md once domain-researcher returns]

H2:
Principle two — boundaries that hold.

Body:
A reading is reflection, not prophecy. There are things a serious practitioner does not say. We've encoded those into the product.

Bulleted list:
— No exact dates of death. Ever.
— No medical diagnoses. The health section discusses traditional textual associations only, never replaces a clinician.
— No specific tragedy predictions.
— No legal or financial advice.
— No past-life identity claims.
— No claims that contradict the cited sources of the chosen tradition.

H2:
Principle three — your image is yours.

Body:
We delete your photo within 24 hours by default. If you opt in to save your reading, we keep the photo only as long as you want it kept. We never train any model on your photo. We never log it.

H2:
A note on the tone.

Body:
The voice is decisive. A master practitioner does not say "perhaps" or "could be" — that's the register of a beginner. We've built the product in that voice. It is one practitioner's view, written with conviction. Take from it what feels true; set aside what doesn't.

CTA:
Begin a reading →
```

---

## About — `/about`

```
H1:
About [Brand].

Body:
[Brand] was built by [team]. We come from [backgrounds]. We started this because the digital options for palm readings were embarrassing — slot-machine fortune-tellers wrapped in bad design — and the in-person options were either inaccessible or wildly inconsistent.

So we did one thing carefully:
— We anchored the AI to authentic classical sources, with citations.
— We hired a tone that respects the reader.
— We left out everything that didn't deserve to be in.

The result is a product we think of less as an app and more as an instrument.

[Sign-off, designer/founder photo if applicable]
```

---

## Disclaimer — `/disclaimer`

```
H1:
Disclaimer.

Body:
[Brand] offers readings for **entertainment and reflection**. Each reading is one practitioner's view through one tradition. It is not, and is not intended as, a substitute for professional advice in any domain.

In particular:

— **Health.** The health section of any reading discusses traditional textual associations between hand markers and constitutional tendencies. These are not medical diagnoses. They are not predictions. If anything in any reading concerns you, please speak with a qualified clinician.

— **Legal, financial, and professional matters.** Nothing in any reading is legal advice, financial advice, investment advice, or any kind of professional advice. For decisions that matter, consult someone qualified in that domain.

— **Predictions.** A reading describes tendencies and dispositions, not deterministic outcomes. A reading does not predict specific events, specific dates, or specific tragedies. We do not, and will not, generate readings that do.

— **Past lives.** Where a chosen tradition supports karmic themes, those are discussed as broad themes only. We do not assign specific past-life identities.

— **Tradition fidelity.** We do not blend traditions. An Indian-tradition reading uses Indian sources. A Chinese-tradition reading uses Chinese sources. We do not present Western pop-palmistry as either.

By using [Brand], you acknowledge the above.

Last updated: [date]
```

---

## Privacy — `/privacy`

```
H1:
Privacy.

Lede:
We treat your hand photo as the sensitive personal data it is.

H2: What we collect
Body:
- The photo of your hand you upload.
- Optional context you supply (name, date of birth, gender, dominant hand).
- Account information if you sign up (email, via Clerk; we never store your password).
- Standard analytics data (page views, clicks) via PostHog. We do not track you across sites.

H2: What we do with your photo
Body:
Your photo is uploaded to a private storage bucket, encrypted at rest, accessible only via short-lived signed URLs. We resize and re-encode it (which strips its EXIF metadata) and pass it to the inference engine.

H2: What we never do
Body:
- We never train any model on your photo.
- We never share your photo with anyone.
- We never log the photo bytes anywhere — not in error reports, not in analytics, nowhere.

H2: How long we keep your photo
Body:
By default, your photo is deleted within **24 hours** of upload. If you opt in to "Save my reading," your photo is retained as long as your account or the saved reading exists. You can delete a reading (and its photo) at any time from your dashboard or directly from a share link.

H2: Your written reading
Body:
The text of your reading is stored in our database for as long as you have an account, or until you delete it. If you don't have an account, we still keep the reading text (with no link to your identity) so the share link works.

H2: Sharing
Body:
A share link reveals the reading to anyone with the link. The link does not include your identity unless your account display name is shown. Share links are not indexed by search engines.

H2: Your rights
Body:
You can request deletion of any reading at any time (from your dashboard, from a share link, or by emailing us). On request we will hard-delete the reading and any associated photo from our systems. You can also request a full account deletion, which removes all your readings.

H2: Cookies
Body:
We use a small number of essential cookies (session cookie via Clerk; preference cookie for locale and reduced-motion). We use PostHog analytics, which sets a single first-party cookie. We do not use advertising cookies.

H2: Contact
Body:
For privacy questions: [email TBD].

Last updated: [date].
```

---

## Terms — `/terms`

```
H1:
Terms of service.

[Standard ToS skeleton, with the AI-output limitation of liability paragraph:]

H2: Limitation of liability for AI outputs
Body:
[Brand] readings are generated by an AI system grounded in classical palmistry sources. While we have built rigorous source-grounding and safety boundaries, the readings are AI-generated text and may occasionally err. [Brand] makes no warranty about the accuracy, completeness, or applicability of any reading to any specific person or situation. [Brand] is not liable for any decision a user makes on the basis of a reading.

[Standard governing-law clause: India primary, with carve-outs for mandatory consumer protections in user's jurisdiction.]

[Standard arbitration clause.]

Last updated: [date].
```

---

## Contact — `/contact`

```
H1:
Get in touch.

Body:
For privacy questions, deletion requests, or anything else:
[email TBD]

For press / brand:
[email TBD]

For collaboration with practitioners or researchers in classical palmistry:
[email TBD]
```

---

## Error pages

### `/_404`

```
H1: This page isn't here.
Body: It may have moved, or never existed. Either way:
CTA: Take me home →
```

### `/_500`

```
H1: Something broke.
Body: Not on your end. We're looking at it. Try again in a moment.
CTA: Take me home →
```

---

## Microcopy library (for buttons, errors, toasts)

```
buttons.beginReading: "Begin reading"
buttons.takePhoto: "Take a photo"
buttons.uploadFromDevice: "Upload from device"
buttons.continue: "Continue"
buttons.back: "Back"
buttons.viewReading: "View your reading"
buttons.downloadPdf: "Download as PDF"
buttons.share: "Share privately"
buttons.deleteReading: "Delete this reading"
buttons.confirmDelete: "Yes, delete"
buttons.cancel: "Cancel"
buttons.signIn: "Sign in"
buttons.createAccount: "Create account"

toasts.uploadSuccess: "Photo received."
toasts.uploadError: "We couldn't process that photo. Try another?"
toasts.shareLinkCopied: "Link copied. Anyone with the link can read this."
toasts.readingDeleted: "Deleted. Gone for good."
toasts.dailyLimitHit: "You've reached today's limit. Come back tomorrow."

errors.handNotDetected: "We couldn't see your palm clearly. A brighter, more open shot will work better."
errors.networkError: "Network hiccup. Please try again."
errors.inferenceUnavailable: "The reader is taking a moment. Please try again in a few seconds."
errors.tooLarge: "That photo is too large. Anything under 10MB works."
errors.wrongFormat: "We accept JPEG, PNG, or WebP photos."

empty.noSavedReadings: "No saved readings yet. Your first one will appear here."
```

---

## Translation keys (i18n-ready)

All copy above lives under namespaced keys in `/content/en/`. Hindi (`/content/hi/`) added at v1.1. Keys follow `page.section.element` format (e.g., `landing.hero.h1`).
