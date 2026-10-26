# Portfolio revamp report

Branch: `portfolio-revamp` · October 26, 2026

## 1. What changed, in short

- The homepage now leads with a one-paragraph positioning statement, four featured projects with real screenshots, grouped supporting work, a five-stage "How I work" section that links into the case studies, background, and contact.
- Five new case studies on one template (overview, problem, analysis, objectives, design decisions, process, solution, evaluation, status) plus the Student Educator Forum rebuilt on the same template.
- One shared stylesheet (`assets/portfolio.css`) replaces the homepage's inline styles. Homepage weight dropped from 252 KB (inline base64 images) to 20 KB plus lazy-loaded WebP screenshots.
- Every project carries a status label: Professional project, Independent work sample, Interactive prototype, In revision, or Pre-final draft.
- Learning modules were left alone except for one functional fix to the GEOL 1403 notebook (section 4).

## 2. Architecture

**Primary navigation:** Work · Approach · About · Contact (Resume slot ready, commented out until a PDF exists).

**Selected work** (each with a case study and a launch link)
1. Reviewing with the Co-Pilot: `case-studies/reviewing-with-the-copilot.html` → launches `reviewing-with-the-copilot/index.html#module`
2. Trust Services Criteria for GRC Staff: `case-studies/trust-services-criteria.html` → `tsc-grc-course.html#home`
3. Fall 2025 SI Program Launch: `case-studies/fall-2025-program-launch.html` → `si_onboarding_module.html`
4. GEOL 1403: Activate Your Core: `case-studies/geol-1403.html` → `geol1403-module.html`

**Additional work**
- Instructional design and learning experiences: Sharing Data, Protecting People (case study, in revision) · Activate Your Core Workbook (PDF, pre-final draft) · Pixel Solar System (prototype)
- Training and performance support: SI Leader Onboarding · Biology Cohort Hub
- Program management and implementation: Student Educator Forum (case study); Fall 2025 noted as belonging here

**Case-study template:** overview block with type, audience, role, status, problem, deliverables, tools → disclosure box for independent samples → sticky section nav → problem → analysis → objectives and alignment → design decisions (challenge, decision, rationale, implementation, evidence or limitation) → design and development, with "Selected design artifacts" → solution with screenshots → evaluation split into completed and proposed → status and lessons → related work.

**Where design artifacts live:** linked from each case study's "Selected design artifacts" list.
- Co-Pilot: design documentation and AI-assisted QA table (`reviewing-with-the-copilot/index.html`), job aid
- TSC: needs analysis, alignment matrix and sequencing map, learning design document, design system (all inside `tsc-grc-course.html`, hash routes)
- GEOL 1403: workbook PDF, notebook

**Redirects** (old URLs keep working): `case-study-001-sef.html`, `case-study-002-fall-2025-launch.html`, `si_program_launch_case_study.html` (older duplicate), `virtual-training.html` (placeholder), `Biology-Cohort-Dashboard.html` (duplicate of the hub).

## 3. Project selection rationale

| Project | Why it is featured | Capability it carries |
|---|---|---|
| Reviewing with the Co-Pilot | Most complete evidence of instructional judgment: two-part objective, separated scoring, a safety gate, documented revisions, and an honest evaluation plan | Scenario-based practice, assessment design, AI-assisted development with human review |
| Trust Services Criteria | The strongest formal analysis in the portfolio (12-section needs analysis, task ratings, alignment matrix) | Front-end analysis, technical content, course architecture |
| Fall 2025 SI Program Launch | The only featured project with real implementation at scale | Program management, stakeholder coordination, training redesign |
| GEOL 1403 | Real client work (iDesign for Dallas College) with clear competency alignment | Curriculum design, metacognitive structure, workbook-to-web translation |

**Supporting work** fills in breadth: SEF adds measured event results; Onboarding and the Biology Hub show tools in use; Pixel Solar System shows interaction prototyping; Sharing Data waits for its revision.

**Sharing Data, Protecting People: recommendation.** Once its technical and functional QA is done, swap it in for GEOL 1403 when applying to corporate, technical, privacy, or compliance roles (it pairs with TSC and Co-Pilot). Keep GEOL 1403 featured for higher-education and curriculum roles. A rotation per application is better than a fifth featured slot.

## 4. Case-study revisions

| Case study | Source material used | Still unavailable |
|---|---|---|
| Co-Pilot (new) | The module's own case-study landing page, screen config, job aid, QA table, revision table, evaluation plan | `QA_REPORT.md` and `POLICY_SOURCES.md` are cited by the module but are not in the repo |
| TSC (new) | Needs analysis, case study, learning design document, design system, alignment matrix inside the course | Pilot data; practitioner validation of task ratings |
| Fall 2025 (rebuilt from `case-study-002…`) | Original case study; onboarding module | Learner-level data (training feedback, observation results); interview notes |
| GEOL 1403 (new) | Workbook PDF, notebook source | Client requirements and review notes; student use data |
| Sharing Data (new) | The module itself (objectives, screens, rubric code) | QA documentation from the current revision |
| SEF (rebuilt from `case-study-001…`) | Original case study | Survey instrument and raw data |

**Corrections made while building these:**
- "Activate Your Core" was described as a Dallas College **biology** workbook. The PDF is byte-identical to `geol1403-workbook.pdf`: it is the GEOL 1403 workbook. It now sits under GEOL 1403, and both PDF URLs still work.
- The workbook draft develops the introduction and Modules 1–2 only; the copy now says so instead of implying all modules.
- Biology Cohort Hub copy claimed it "shortens prep time" and raises "consistency of session quality." No evidence supports either, so both were removed. The 118 strategy cards are credited as adapted from UMKC, DePaul, and Sanger sources, as the file itself notes.
- SEF said "late April"; the event was April 10. Student presenter names were removed from the public page.
- The onboarding module's welcome screen says work "auto-saves." The portfolio copy keeps state only while the tab is open; the case study notes this.
- Pixel Solar System was described as a capstone that teaches educational leaders. Nothing in the repo documents a program, so it is now labeled an interactive prototype.

**GEOL 1403 functional fix.** The notebook calls `window.storage`, which GitHub Pages does not provide, so no entry was ever saved and carry-forward questions never appeared. I added a 15-line adapter in `geol1403-module.html` that maps it to `localStorage`. Tested: an entry survives a reload on the fixed version and is lost on the original.

## 5. Editorial change log (examples)

**Positioning**
- Before: "I design learning systems that help people build skill, confidence, and consistency in complex roles… to turn training needs into usable materials, scalable workflows, and measurable program improvements."
- After: "I design training and the systems that support it, from analyzing performance needs and developing practical learning experiences to coordinating implementation and evaluating results. My work spans technical training, higher education, and large-scale program operations."

**Section banner**
- Before: "These projects combine evidence-based instructional design with AI-augmented workflows."
- After: removed. Each project now says what it is and how it was built.

**Biology Cohort Hub**
- Before: "The dashboard collapses what used to be ad-hoc, leader-by-leader prep into a shared, scaffolded process that shortens prep time, raising the consistency of session quality across leaders…"
- After: "A planning hub for the Spring 2026 Biology SI cohort: a step-by-step lesson-plan builder, a searchable library of 118 strategy cards adapted from UMKC, DePaul, and Sanger Learning Center sources, upcoming deadlines, and after-dark safety resources leaders can share with students."

**Pixel Solar System**
- Before: "educational leaders complete the program able to specify, prototype, and iterate on instructional tools without needing a developer in the loop."
- After: "built with Claude as a worked example of AI-assisted tool building for educators. Included to show interaction development."

**Card length:** featured descriptions went from 2 paragraphs (110–170 words) to 1–2 sentences, with details moved into metadata rows and the case studies.

## 6. Design system summary

- **Typography:** Inter (variable, 400–900) for everything; JetBrains Mono only for decision and stage numerals. Scale: 13 / 16 / 19 / 24 / 32 px, case-study titles `clamp(36–52px)`, name wordmark `clamp(52–104px)` in 900 uppercase. Body line-height 1.6, prose capped at 68ch.
- **Color:** canvas `#2F3130`, sheet `#F2EFE7`, recessed `#E8E3D6`, ink `#1A1A1A` / `#3F3F3F` / `#5A5A5A`, rule `#CFC7B4`, green `#4A6741` (links, primary buttons) / `#36502F` hover / `#DCE4D3` tint, amber tint for in-progress status, focus ring `#1F5FBF`. All text pairings pass WCAG AA; tertiary text is 6.1:1.
- **Spacing:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 72 px; sheet padding `clamp(22px, 4vw, 48px)`; page width 1180px with a 16–40px gutter.
- **Surfaces:** cream sheets on the charcoal canvas (kept from the original), 4px radius, one shared shadow.
- **Cards:** featured = 16:10 screenshot left, text right (stacked under 860px). Supporting = 16:10 thumbnail, status chip, title, 1–3 sentences, text links. Case-study decision blocks use a green top rule and a label/answer grid.
- **Navigation:** sticky top bar with wordmark and four links; sticky pill nav for case-study sections; "← All work" crumb on every case study.
- **Buttons:** primary (green fill) for the case study, secondary (outline) for launching the artifact. External launches open in a new tab and say so to screen readers.
- **Images:** real screenshots only, 1200×750 WebP, 1px ink border, top-left crop. Homepage thumbnails are decorative duplicates of the adjacent link (`aria-hidden`, `tabindex="-1"`); case-study figures have descriptive alt text.
- **Responsive:** breakpoints at 1024, 860, and 600px. Process grid goes 5 → 3 → 1 columns; tiles 3 → 2 → 1; tables scroll horizontally inside a focusable region.

## 7. Quality assurance summary

Tested locally with Playwright (Chromium) serving the repo over HTTP. CDNs and Google Fonts were blocked in my environment, so I served local copies of the same fonts and libraries during testing; I did not test against the live GitHub Pages site.

- **Pages:** homepage and all six case studies; launch targets for every project opened and screenshotted.
- **Viewports:** 375, 430, 768, 1024, 1440 px. No horizontal overflow on any page at any width; no broken images.
- **Links:** 77 unique link targets checked; all internal files and in-page anchors resolve. LinkedIn (external) not fetched.
- **Console:** no errors on any portfolio page.
- **Accessibility:** axe-core (WCAG 2.0/2.1/2.2 A and AA plus best practices) at 375 and 1440 px: zero violations after fixes (scrollable tables made focusable with unique labels). Keyboard: skip link, wordmark, and nav reach focus in order with a visible 3px ring. Reduced motion respected. This is automated testing plus a keyboard pass, not a full conformance audit or screen-reader test.
- **GEOL notebook:** save-and-reload test, before and after the fix.

**Known limitations in the modules (not changed):**
- Biology Cohort Hub tiles are `<a onclick>` elements without `href`; they take focus but Enter may not activate them.
- SI Onboarding portfolio copy does not persist progress.
- TSC course has no skip link (its own design system lists this as outstanding).
- Co-Pilot, onboarding, and TSC have no link back to the portfolio; every launch opens in a new tab so the portfolio stays open.
- GEOL notebook depends on three CDNs (Tailwind Play, esm.sh, unpkg Babel) at runtime.

## 8. Remaining recommendations

1. **Resume PDF.** The brief calls for resume access; add `resume.pdf` and uncomment the nav link.
2. **Fall 2025 learner evidence.** Any post-training survey, observation, or attendance data would turn the strongest real-world project into one with outcomes as well as outputs.
3. **Co-Pilot QA files.** Publish `QA_REPORT.md` and `POLICY_SOURCES.md` (or remove the references in the module).
4. **Sharing Data QA.** When the revision lands, add its QA notes to the case study and decide on the rotation in section 3.
5. **GEOL 1403 client context.** If iDesign allows, a line on the brief or reviewer feedback would strengthen the analysis section, which is currently retrospective.
6. **Hub keyboard fix.** Give the hub tiles an `href="#"` or make them `<button>`s.
7. **Self-host GEOL dependencies** to remove the runtime CDN risk.
8. **Live-site check.** After merging, click through on a phone and run the same axe pass against the published URL.
