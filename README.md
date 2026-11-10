# Whole Person Check-In

A weekly whole-person wellness check-in for Foluke Arthurton's fitness class, built with Jekyll and published on GitHub Pages.

## Add a new week

Copy `_weeks/2.md` to `_weeks/3.md` and change the text. Each week holds:

- `week`, `date`, `title`, `subtitle`
- `nugget`: the health nugget box
- `pre_prompts`: the before-class body, mind, and emotions questions
- `ratings`: the 1 to 5 areas (keep the same `key` across weeks so My Journey can compare them)
- `movement`, `post_prompts`, `faith_prompt` (optional), `challenge`, `closing`, `disclaimer`

Save the file and the week shows up on the home page automatically.

## Preview on your computer

```bash
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000.

## Privacy

Participants' answers are saved only in their own browser (localStorage). They can copy, print, or email their answers, or send them to the instructor through the optional Google Form set in `_config.yml`.
