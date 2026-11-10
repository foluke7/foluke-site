# Foluke Arthurton

Foluke Arthurton's website, built with Jekyll and published on GitHub Pages. It has two parts:

- **Home page** (`index.html`): about, journey timeline, projects, services, story, shows and events, gallery, shop, and contact. Photos are in `assets/images/`.
- **Whole Person Check-In** (`/checkin/`): the weekly wellness check-in for the fitness class.

## Edit the home page

Open `index.html` and change the text. To add a show or event, copy one `<li>` block inside `<ul class="events">`. To add a journey step, copy one `<li>` inside `<ol class="timeline">`. The contact email comes from `contact_email` in `_config.yml`.

## Add a new check-in week

Copy `_weeks/2.md` to `_weeks/3.md` and change the text. Each week holds:

- `week`, `date`, `title`, `subtitle`
- `nugget`: the health nugget box
- `pre_prompts`: the before-class body, mind, and emotions questions
- `ratings`: the 1 to 5 areas (keep the same `key` across weeks so My Journey can compare them)
- `movement`, `post_prompts`, `faith_prompt` (optional), `challenge`, `closing`, `disclaimer`

Save the file and the week shows up on the check-in page automatically.

## Preview on your computer

```bash
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000.

## Privacy

Participants' answers are saved only in their own browser (localStorage). They can copy, print, or email their answers, or send them to the instructor through the optional Google Form set in `_config.yml`.
