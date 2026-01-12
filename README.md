# Global Music Finder

A music search app to find and copy song titles and artist names from around the world.


## Live Demo

👉 **Live URL:** https://global-music-finder.vercel.app/  


## Overview

This project is a personal portfolio piece created to demonstrate my approach to UI design, problem-solving, adn clean implementation. 
It focuses on clarity, maintainability, and real-world usability rather than excessive complexity.


## Motivation – Why I Built This

I started this project because:

- I wanted to create a music app that allows users to explore songs and artists from around the world.
- I noticed that many existing services do not provide an easy way to copy track titles and artist names.
- I wanted to design something that not only helps users discover music, but also makes it easier to reuse track titles and artist names. This is especially helpful when exploring music in languages that users cannot read or write.

This project reflects how I think as a developer and the kind of products I aim to build in a professional environment.


## Design & Thought Process – How I Approached It

When designing this project, I focused on the following principles:

- **Visual grouping:** Content from the same category is placed close together to improve scannability and reduce cognitive load.
- **Context-aware styling:** The CSS style changes depending on the selected country, making it immediately clear which country’s music is currently being explored.
- **Visual clarity:** Colour, spacing, and typography were chosen to clearly indicate context and hierarchy.
- **User orientation:** The interface is designed so users always understand where they are and what they are browsing.
- **Iterative design process:** I started with hand-drawn sketches to explore layout and flow, then created rough drafts in Figma to evaluate colour balance and spacing.
- **Accessibility and readability:** Font sizes and colour contrasts were selected with readability as the top priority.


### Key Decisions

- I chose this architecture to make each feature’s JavaScript easier to understand, maintain, and extend over time.
- I selected SCSS because it works well with the BEM methodology, allowing styles to remain structured and predictable as the project grows.
- I built the project from scratch without using frameworks in order to deepen my understanding of core web technologies and have full control over the implementation.
- I used the iTunes API because it does not require user registration and provides access to a wide variety of tracks and artists, making it suitable for quick exploration and prototyping.


## Features

- **Country-based music search:** Search for songs and artists by country to explore regional music scenes.
- **Copy track and artist names:** Easily copy track titles and artist names for reuse across platforms and languages.
- **Track preview:** Listen to short previews to quickly discover new music.


## Planned Features (Future Improvements)

- [ ] **Responsive design:** Improve usability across mobile, tablet, and desktop devices.
- [ ] **Visual refinement:** Further enhance the design by refining colour choices and spacing for a more polished experience.

This list reflects how I think about **iteration and long-term improvement**.

## Tech Stack

- **Languages:** HTML, SCSS (CSS), JavaScript  
- **Tooling & Infrastructure:** Google Analytics (usage insights), Vercel (simple and fast deployment)

## Setup & Installation

```bash
git clone https://github.com/htm823/global_music_finder.git
```