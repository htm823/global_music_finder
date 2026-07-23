# Global Music Finder

🇬🇧 English | [🇯🇵 Japanese](README.ja.md)  

A web application that makes it easier to discover music from around the world.  
Search for songs by language, copy song and artist names, and preview tracks.  
Built with HTML, SCSS, JavaScript, and the iTunes Search API.

## Live Demo

👉🏻 https://global-music-finder.vercel.app/

## Preview

https://github.com/user-attachments/assets/2e4a7bdc-1c9f-4aa2-925c-35cdb2a64355


## Background
I often wanted to listen to Korean and Chinese music, but without knowing the languages, it was difficult to type search queries accurately.  
To solve this problem, I created an application that allows users to discover music in unfamiliar languages more easily.

## Features

### Search by Language
Browse dedicated pages for each language, making it immediately clear which language you are currently searching in.

### Copy Song & Artist Names
Copy song titles or artist names with a single click, making it easy to search again without manually typing unfamiliar characters.  
This is useful not only within the application but also when searching on external websites.

### Song Preview
Listen to track previews instantly, allowing users to discover new music without searching for audio separately.

## Tech Stack
### Frontend
- HTML
- CSS (SCSS)
- JavaScript

### API
- iTunes Search API

### Deployment
- Vercel

## Technology Choices
I chose vanilla JavaScript because I wanted to focus on integrating with an external API rather than learning a new framework at the same time.  

The iTunes Search API was selected because it is free to use, requires no authentication, and provides access to a large international music catalogue, making it well suited for a multilingual music search application.

## System Design

### Final Design
The language navigation panel is fixed to the left side of the screen so that it remains visible while users scroll through search results.  
Each language is also assigned a consistent accent colour, allowing users to recognise the currently selected language at a glance.

### Initial Design
Originally, the language tabs were placed at the top of the page. However, once users scrolled through the search results, the navigation disappeared from view, making it inconvenient to switch languages.

## Implementation Highlights
To improve maintainability, I organised JavaScript functions and files by feature rather than placing everything in a single script.

This structure makes it easier to understand each file's responsibility and allows only the code required for each page to be loaded as the application grows.

Rather than creating each DOM element individually with `createElement()`, I used template literals to generate the search result markup. This approach kept the HTML structure easier to read and maintain.

For styling, I adopted the BEM methodology because it provides a clear component structure and works well with SCSS.

To support language-specific themes efficiently, I defined colour palettes in separate SCSS files and switched styles using SCSS variables and radio button states, keeping duplicated code to a minimum.

## Challenges & Solutions
The most challenging part of the project was implementing the song preview feature.

My initial approach used an individual `<audio>` element for every search result, but this caused performance issues when a large number of tracks were displayed.

I then experimented with an alternative button-based implementation, which improved the interface but failed to play audio correctly.

The current implementation successfully plays previews using the `<audio>` element. However, synchronising the play/pause icon with the playback state remains an unresolved issue that I plan to improve.

## Future Improvements
One planned improvement is to synchronise the preview button with the playback state so that users can immediately see whether a track is playing or paused.

Another improvement would be to keep the search bar fixed at the top of the page. At present, it scrolls out of view with the search results, making repeated searches less convenient.

## License & Usage

This repository is publicly available for portfolio purposes.

The source code is not open source and is provided solely to demonstrate my development work and technical skills.

## Explore More Projects

You can find more of my projects on my GitHub profile.

👉🏻 https://github.com/htm823