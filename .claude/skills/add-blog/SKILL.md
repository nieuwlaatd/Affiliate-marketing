---
name: add-blog
description: "Write and publish a new blog post for BestBikeForMe. Use this skill whenever the user wants to add a blog article, write content for the site, create a guide, or expand the blog section. Also triggers for: 'new blog post', 'write an article about', 'add content about', 'blog over', 'schrijf een blog', or any request to create written e-bike content for the website."
---

# Add Blog Post to BestBikeForMe

You are writing a blog post for bestbikeforme.com, an e-bike comparison and affiliate site. The blog drives organic search traffic and helps visitors make informed buying decisions.

## Input

The user provides a topic or keyword, for example:
- `/add-blog best electric bikes for tall riders`
- `/add-blog how to ride an e-bike in winter`
- `/add-blog folding vs full-size ebikes`

If no topic is given, ask the user what they want to write about.

## Step 1: Research and angle

Before writing, determine:

1. **Target keyword** based on the topic (think: what would someone type into Google?)
2. **Search intent** (informational, comparison, buying guide)
3. **Which internal pages to link to** (pick from the link targets below)
4. **Which existing blog posts to set as relatedSlugs**

Read `harkuhh/lib/blog-data.ts` to see all existing posts and their slugs. Avoid duplicating topics that already exist. If the topic overlaps with an existing post, find a distinct angle.

### Internal link targets (use at least 3 per post)

- `/e-bikes/quiz` - Find My E-Bike quiz (every post MUST link here)
- `/e-bikes/overzicht` - Browse all e-bikes (every post MUST link here)
- `/best/commuter-ebikes` - Best commuter e-bikes
- `/best/ebikes-under-1000` - Best e-bikes under $1,000
- `/best/ebikes-under-1500` - Best e-bikes under $1,500
- `/best/folding-ebikes` - Best folding e-bikes
- `/best/cargo-ebikes` - Best cargo e-bikes
- `/best/class-3-ebikes` - Best Class 3 e-bikes
- `/best/ebikes-for-seniors` - Best e-bikes for seniors
- `/e-bikes/vergelijk` - Compare tool

## Step 2: Write the post

### The voice

Write like someone who actually rides e-bikes and is explaining things to a friend over coffee. Direct, specific, opinionated when it helps. You have done the research so the reader doesn't have to.

Short paragraphs. Short sentences when they hit harder. Vary sentence length to keep rhythm natural.

### Banned patterns (these make text sound AI-generated)

**NEVER use em-dashes** anywhere in the content. Not in titles, not in descriptions, not in body text. The character `—` must not appear. Use commas, periods, colons, semicolons, parentheses, or break into two sentences instead.

Before finishing, always grep for `—` in blog-data.ts to catch any that slipped through.

Other banned patterns:
- "In today's world" / "In the world of"
- "It's important to note" / "It's worth noting"  
- "When it comes to"
- "Whether you're a beginner or an experienced rider" (or any X-or-Y variant)
- "Look no further"
- "Let's dive in" / "Let's explore"
- "At the end of the day"
- "Without further ado"
- "Game-changer" / "Game changer"
- Starting paragraphs with "So," or "Now,"
- "Navigating the world of"
- "The landscape of"
- Excessive hedging ("may", "might", "could potentially")

### Structure

Every post needs:
- A **specific, useful opening** (not a generic intro about how great e-bikes are)
- **`##` section headings** that work as a mini table of contents
- At least one **comparison table** (using markdown `| | |` syntax) when comparing options, specs, or features
- **Bold text** for key terms and takeaways
- **Internal links** woven naturally into the text (at minimum: the quiz, the overview page, and one /best/ category)
- A **closing section** that points the reader to a next step (quiz, browse, compare)

### Content quality checklist

- [ ] Does the opening sentence say something specific and useful?
- [ ] Would a real person actually search for this topic?
- [ ] Does every section give the reader actionable information?
- [ ] Are there concrete numbers, specs, or examples (not just vague advice)?
- [ ] Does the article link to at least the quiz, the overview page, and one /best/ page?
- [ ] Is there a comparison table where it makes sense?
- [ ] Zero em-dashes in the entire post?
- [ ] No filler phrases from the banned list?

## Step 3: Add the post to blog-data.ts

Open `harkuhh/lib/blog-data.ts` and add a new entry to the `POSTS` array (before the closing `];`).

### BlogPost fields

```typescript
{
  slug: string,        // kebab-case, SEO-friendly, no stop words
  title: string,       // Include the current year where relevant. No em-dashes.
  description: string, // 150-160 characters. Compelling meta description for Google. No em-dashes.
  category: string,    // One of: 'Guides' | 'Buying Advice' | 'Tips' | 'Comparisons'
  publishedAt: string, // Today's date in YYYY-MM-DD format
  readingTime: number, // Estimate: count the words in content, divide by 200, round to nearest integer
  coverAlt: string,    // Descriptive alt text for a future cover image
  content: string,     // The markdown body (use backtick template literal)
  relatedSlugs: string[], // 2-3 slugs of existing blog posts that relate to this topic
}
```

### How to calculate readingTime

Count the words in the `content` field (excluding markdown syntax). Divide by 200. Round to the nearest whole number. A 1,600-word article = 8 min read.

### Escaping rules for the content template literal

Since content is inside a backtick template literal in TypeScript:
- Escape backticks with `\``
- Escape `${` with `\${`
- Single quotes in text are fine (no escaping needed inside backticks)
- Use `'` not `\'` for apostrophes in the content body

## Step 4: Verify and publish

1. **Grep for em-dashes:** Search `harkuhh/lib/blog-data.ts` for the character `—`. If any are found, fix them immediately.
2. **Run the build:** Execute `npx next build` in the `harkuhh/` directory. Fix any TypeScript or build errors.
3. **Confirm the new route:** Check that the build output includes `/blog/<your-slug>` in the generated pages.
4. **Commit and push to GitHub:** Stage the changed files, create a commit with message `feat: add blog post "<post title>"`, and push to the current branch. This deploys the post automatically.

## Example post structure

Here is a condensed example showing the expected format and tone (not a real article, just the skeleton):

```
Your e-bike battery will last 3 to 5 years if you treat it right, and less than 2 if you don't. Here's what actually determines battery lifespan and what you can do about it.

## How long do e-bike batteries really last?

Most e-bike batteries are rated for 500 to 1,000 charge cycles...

## The three things that kill batteries early

### 1. Storing at full charge
Lithium cells degrade fastest when held at 100%. If you charge to full every night but only ride twice a week, you're cutting the battery's life short.

### 2. Extreme temperatures
...

## Battery types compared

| Battery type | Typical lifespan | Cost to replace | Weight |
|---|---|---|---|
| Lithium-ion (standard) | 500-800 cycles | $300-$500 | 6-8 lbs |
| Lithium-ion (name brand) | 800-1,200 cycles | $500-$800 | 5-7 lbs |

## When to replace your battery

...

## Bottom line

Take care of your battery and it takes care of you. If you're shopping for a new e-bike and range matters, check our [battery range guide](/blog/ebike-battery-range-guide) or take the [Find My E-Bike quiz](/e-bikes/quiz) to find bikes with the range you need.
```

Notice: no em-dashes, no filler intros, specific numbers, table where it helps, natural internal links, direct tone.
