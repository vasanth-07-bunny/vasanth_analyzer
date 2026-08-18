<div align="center">

# THE ALGORITHM KNOWS YOU TOO WELL

### AI-Powered Short-Form Content Intelligence

**What if an algorithm didn't just know what you watched,
but understood what you actually care about?**

<br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-black?style=for-the-badge)](YOUR_WEBSITE_LINK)
[![AI Powered](https://img.shields.io/badge/AI-Powered-blueviolet?style=for-the-badge)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](#)

</div>

---
## DEMO1
https://vasanthanalyzerforstudents.netlify.app/
## DEMO2
https://vasanthrgmhackathon.netlify.app/
## The Problem

Students spend a huge amount of time consuming short-form content.

But recommendation algorithms often optimize for:

> **"What will make you keep watching?"**

instead of:

> **"What are you actually interested in?"**

Imagine a student watches:

```text
Java Meme
        |
Coding Joke
        |
Software Engineer Lifestyle
        |
Coding Interview
        |
Laptop Comparison
```

A shallow recommendation engine might conclude:

> **"This user likes Java."**

And recommend another Java meme.

But our AI asks:

> **"What connects all of these?"**

And discovers:

# SOFTWARE ENGINEERING

---

## What We Built

**The Algorithm Knows You Too Well** is an AI-powered recommendation agent that analyzes short-form content interactions and infers the user's **underlying interests**.

It doesn't rely on simple keyword matching.

Instead, it combines:

* Semantic understanding
* Watch behavior
* Likes
* Replays
* Saves
* Skips
* Cross-topic relationships
* Interest scoring
* Hype detection
* Recommendation ranking
* Explainable AI

The goal isn't to stop scrolling.

# The goal is to make existing scrolling more useful.

---

## How It Works

```text
              SHORT-FORM CONTENT
                       |
                       v
             +------------------+
             |  USER BEHAVIOR   |
             | Watch | Like     |
             | Save  | Replay   |
             +--------+---------+
                      |
                      v
             +------------------+
             | SEMANTIC AI      |
             | Understands      |
             | Topic + Context  |
             +--------+---------+
                      |
                      v
             +------------------+
             | INTEREST GRAPH   |
             | Connect concepts |
             +--------+---------+
                      |
                      v
             +------------------+
             | LATENT INTEREST  |
             | INFERENCE        |
             +--------+---------+
                      |
                      v
             +------------------+
             | QUALITY FILTER   |
             | Value + Hype     |
             +--------+---------+
                      |
                      v
             +------------------+
             | RECOMMENDATION   |
             | + EXPLANATION    |
             +------------------+
```

---

## The Core Innovation

Traditional recommendation:

```text
You watch Java
       |
       v
Recommend Java
```

Our approach:

```text
Java
  +
Coding Interview
  +
Developer Lifestyle
  +
Laptop
  +
DSA
  |
  v
AI finds relationships
  |
  v
SOFTWARE ENGINEERING
  |
  v
Useful Technology Recommendation
```

### We don't just match content.

### We infer intent.

---

## The "Aha!" Moment

The heart of the demo is:

> **YOU DON'T JUST LIKE JAVA.**

### YOU LIKE SOFTWARE ENGINEERING.

The system identifies that individual Reels are only signals.

The real objective is to discover the broader interest behind those signals.

---

## Interest Graph

The AI builds an interconnected interest map.

```text
                         USER
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
   SOFTWARE          PROGRAMMING      HARDWARE
   ENGINEERING           |               |
       |                 +-- Java        +-- GPU
       |                 +-- Python      +-- CPU
       |                 +-- C++         +-- Laptops
       |
       +-- DSA
       +-- Backend
       +-- System Design
       +-- Developer Career
```

This allows the system to understand that:

**Java is not the entire interest.**

Java may simply be one node inside a much larger technology interest.

---

## Recommendation Example

### CURRENT REEL

> "Things I wish I knew before coding interviews"

### INTEREST DETECTED

**Software Engineering + Problem Solving**

### WHY?

The user:

* Completed the Reel
* Liked it
* Saved it
* Replayed it
* Previously interacted with programming content

### RECOMMENDED TECH REEL

> **"Why Backend Engineers Need Data Structures"**

**Category:** DSA / Career

**Difficulty:** Intermediate

**Interest Match:** 92%

**Technology Relevance:** 96%

**Hype Risk:** Low

**Confidence:** High

---

## Fighting Tech Hype

Not every technology Reel is useful.

For example:

> **"10 AI TOOLS THAT WILL GUARANTEE YOU A JOB"**

The system doesn't blindly recommend it just because:

```text
AI -> AI
```

Instead, it checks for:

* Unrealistic promises
* Guaranteed outcomes
* Buzzwords
* Engagement bait
* Exaggerated claims
* Career misinformation

The system produces a:

### HYPE RISK

alongside the recommendation.

Because:

> **Engaging does not always mean useful.**

---

## Explainable Recommendations

We don't want users asking:

> "Why did I get this?"

Every recommendation explains itself.

Example:

```text
WHY THIS RECOMMENDATION?

High completion on coding content
Saved interview-preparation Reel
Replayed DSA explanation
Repeated software-engineering signals
Low engagement with AI hype content
```

The recommendation becomes understandable instead of being a black box.

---

## Feedback Loop

The system learns from user feedback.

```text
                RECOMMENDATION
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
   MORE LIKE       TOO EASY       NOT INTERESTED
        |              |              |
        v              v              v
   Increase        Adjust          Reduce
   topic signal    difficulty      topic weight
        |              |              |
        +--------------+--------------+
                       |
                       v
                UPDATED PROFILE
```

The agent continuously moves through:

# Observe -> Understand -> Recommend -> Learn

---

## Demo Flow

The application is designed around a fast hackathon demonstration.

### 01 — Load Reel History

Show the student's fictional/anonymized interactions.

### 02 — Run AI Analysis

The system analyzes:

* Content
* Behavior
* Context
* Topic relationships

### 03 — Build Interest Graph

The AI connects apparently unrelated signals.

### 04 — Reveal Hidden Interest

> **YOU DON'T JUST LIKE JAVA.**

> **YOU LIKE SOFTWARE ENGINEERING.**

### 05 — Generate Recommendation

The system recommends a relevant, useful technology topic.

### 06 — Explain Why

The AI provides evidence behind its recommendation.

### 07 — Apply Feedback

The user can refine future recommendations.

---

## Tech Stack

| Technology               | Purpose                             |
| ------------------------ | ----------------------------------- |
| React                    | Frontend                            |
| TypeScript               | Type safety                         |
| Vite                     | Development and build               |
| Tailwind CSS             | UI styling                          |
| Gemini / AI              | Semantic reasoning                  |
| Framer Motion / Anime.js | Animations                          |
| Firebase                 | Data and application infrastructure |
| Lucide React             | Icons                               |

---

## Architecture

```text
+-------------------------------------+
|              FRONTEND               |
|       React + TypeScript            |
+----------------+--------------------+
                 |
                 v
+-------------------------------------+
|       RECOMMENDATION AGENT          |
+-------------------------------------+
| Behavior Analysis                   |
| Semantic Understanding              |
| Interest Inference                  |
| Interest Graph                      |
| Hype Detection                      |
| Recommendation Ranking              |
| Explanation Generation              |
+----------------+--------------------+
                 |
                 v
+-------------------------------------+
|          USER INTEREST PROFILE      |
+----------------+--------------------+
                 |
                 v
+-------------------------------------+
|       PERSONALIZED TECH FEED        |
+-------------------------------------+
```

---

## Privacy

This hackathon prototype uses **fictional and anonymized interaction data**.

It does not require:

* Instagram credentials
* Private social-media access
* Social-media scraping

The prototype demonstrates the recommendation intelligence independently from private social-media platforms.

---

## Why This Is Different

Most recommendation systems ask:

> **"What did you watch?"**

We ask:

> **"What does your behavior tell us about what you care about?"**

Most systems optimize for:

**Engagement**

We additionally optimize for:

**Relevance + Technology Value + Quality + Learning Potential**

Most systems give you:

> **"Recommended for you."**

We give you:

> **"Recommended for you — and here's why."**

---

## Future Vision

The same intelligence could eventually power:

### Personalized Learning Feeds

Turn entertainment behavior into learning opportunities.

### Career Discovery

Infer technical career interests from content behavior.

### Developer Feeds

Create personalized feeds for programmers and engineers.

### Adaptive Education

Continuously adjust learning content based on behavior.

### Responsible Recommendation

Move recommendation systems beyond pure engagement optimization.

---

## Run Locally

```bash
git clone YOUR_REPOSITORY_URL

cd YOUR_PROJECT_NAME

npm install

npm run dev
```

Then open the local development URL shown in your terminal.

---

## Project Structure

```text
src/
|
+-- components/
|   +-- Dashboard/
|   +-- ReelCard/
|   +-- InterestGraph/
|   +-- RecommendationCard/
|   +-- AnalysisAnimation/
|
+-- services/
|   +-- ai/
|   +-- recommendation/
|   +-- analytics/
|
+-- agents/
|   +-- interestAgent/
|   +-- hypeDetector/
|   +-- recommendationAgent/
|
+-- data/
|   +-- reels.ts
|
+-- types/
|   +-- recommendation.ts
|
+-- utils/
    +-- scoring.ts
    +-- ranking.ts
```

---

## Example

### INPUT

```text
Java Meme
Coding Interview
Developer Lifestyle
Laptop Comparison
DSA Explanation
```

### AI INFERENCE

```text
Software Engineering     89%
Programming              76%
DSA / Problem Solving    68%
Hardware                 51%
AI                        34%
Java                      31%
```

### OUTPUT

```text
Recommended:

Why Backend Engineers Need Data Structures

Category:
DSA / Career

Difficulty:
Intermediate

Confidence:
High

Interest Match:
92%

Hype Risk:
Low
```

---

## The Philosophy

We aren't trying to tell people:

> **"Stop scrolling."**

We're asking:

> **"What if the scrolling you're already doing could teach you something?"**

---

<div align="center">

# THE ALGORITHM KNOWS YOU TOO WELL

### The algorithm knows what you watch.

### We built one that tries to understand why.

<br/>

**Built with curiosity, AI, and a little bit of obsession.**

</div>
