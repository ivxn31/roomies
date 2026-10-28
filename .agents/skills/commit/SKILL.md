---
name: commit
description: Analyze git changes and generate bilingual GitFlow / Conventional Commit messages
---

Act as a Git and GitFlow expert and run the following commands in my Git repository, analyzing the full output of each one:

- git status
- git diff
- git diff --staged
- git log --oneline -5

Your task is to analyze the information and do the following:

1. Interpret the current state of the repository: which files are modified, which are staged, which are untracked, and which branch I am on.

2. Identify any conflicts, errors, or anomalous situations (detached HEAD, uncommitted changes before a merge, etc.) and warn me about them.

3. Based on the analysis, determine what type of commit I should make according to GitFlow conventions. Classify the change as:

    - feature: if I am developing a new feature

    - bugfix: if I am fixing a bug in a feature or develop branch

    - hotfix: if it is an urgent fix for production

    - release: if I am preparing a version

    - docs: if I only changed documentation

    - chore: if it is a maintenance or configuration task

4. Generate TWO commit messages, one in Spanish and one in English, each on a single line, following the Conventional Commits format and compatible with GitFlow.
    - Do not include a blank line between the type/scope and the description.

    - Do not split the description onto another line.

    - The entire message must be a single continuous line.

    - The detailed description must come immediately after `: ` (colon and space).

    - The Spanish description must be in past tense (pretérito perfecto compuesto or recent past).

    - The English description must be in past tense (present perfect or simple past).

    - The type and scope are the same in both languages; only the description changes.

The EXACT format must be:

```
mx tipo(ámbito): descripción detallada en español, en tiempo pasado, sin saltos de línea y en una sola línea.
eu tipo(scope): detailed description in English, in past tense, no line breaks, single line.
```


5. If there are unstaged or untracked files, tell me exactly which commands I should run before committing (e.g.: git add, git rm, git restore, etc.).

6. If there are already staged changes, assume those are the ones I plan to commit and analyze their content specifically.

Correct format example:

```
mx docs(ios): Se ha actualizado el índice de la documentación de iOS y eliminado la guía de ambientes obsoleta.
eu docs(ios): Updated the iOS documentation index and removed the outdated environments guide.
```

Incorrect format example (DO NOT USE):

```
docs(ios): actualiza índice y elimina guía de ambientes

Se ha actualizado el índice de la documentación de iOS y eliminado la guía de ambientes obsoleta.
```

7. Finally, present a summary of the repository state and the changes made, first in Spanish and then in English.