# Tonja Ryan · Portfolio

Static site served by GitHub Pages from the repository root. No build step.

## Structure

```
index.html                     Homepage: intro, selected work, additional work, approach, background, contact
assets/portfolio.css           Shared design system for index.html and case-studies/*.html
assets/img/                    Project screenshots (WebP, 1200×750) and the headshot
case-studies/                  One page per case study, all on the same template
reviewing-with-the-copilot/    Co-Pilot module (index.html#module), its design documentation, job aid, audio
tsc-grc-course.html            Trust Services Criteria course and its documents (#needs-analysis, #learning-design, …)
Data_Training.html             Sharing Data, Protecting People (in revision; edit separately)
geol1403-module.html / .jsx    GEOL 1403 interactive notebook (html loads the React source in the browser)
activate-your-core-workbook.pdf, geol1403-workbook.pdf   Same workbook, two URLs kept for old links
si_onboarding_module.html, biology-cohort-hub.html, Pixel-solar-system2.html   Supporting projects
case-study-001-sef.html, case-study-002-fall-2025-launch.html, si_program_launch_case_study.html,
virtual-training.html, Biology-Cohort-Dashboard.html   Redirects to the current pages (originals are in git history)
```

Learning modules keep their own styling. `assets/portfolio.css` is used only by the portfolio pages.

## Common edits

- **Add a resume:** put `resume.pdf` in the root and uncomment the Resume link in the nav of `index.html`.
- **Promote Sharing Data to Selected Work:** copy one `<article class="sheet feature">` block in `index.html`, point it at `case-studies/sharing-data-protecting-people.html`, and move the GEOL 1403 block down to Additional Work (or swap them per application).
- **New screenshot:** 1280×800 viewport at 1.5× scale, resized to 1200×750, saved as WebP (quality 80).
- **New case study:** copy any file in `case-studies/`; keep the section ids (`overview`, `problem`, `analysis`, `objectives`, `decisions`, `process`, `solution`, `evaluation`, `results`) so homepage links keep working.

## Evidence labels used in case studies

`tag-done` (completed or documented), `tag-assumed` (assumption made for a work sample), `tag-planned` (proposed, not carried out). Use them whenever a sentence could be read as a claim about results.
