# Waveform Lab — Web Audio Visual Synth + MIDI Keyboard

A browser synthesizer built with the **Web Audio API**, an on-screen piano, ADSR/filter controls, a step sequencer, optional **WebMIDI** input, and local patch save/load.

## Features

- Web Audio oscillators (sine, square, sawtooth, triangle)
- ADSR envelope + filter (lowpass / highpass / bandpass)
- On-screen piano + computer keyboard mapping
- 16-step sequencer with tempo control
- WebMIDI device support (graceful fallback)
- Patch save / load / delete via `localStorage`
- Live waveform visualizer
- Responsive layout

## How to Run

Open `index.html` in Chrome, Edge, or Firefox.

```bash
npx serve .
```

Click **Enable Audio** before playing (browser autoplay policy).

## Structure

```text
Web Audio Visual Synth/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Tech Stack

HTML · CSS · JavaScript · Web Audio API · WebMIDI
