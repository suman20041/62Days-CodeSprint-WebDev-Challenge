(() => {
  const NOTES = [
    { name: "C4", freq: 261.63, black: false, key: "a" },
    { name: "C#4", freq: 277.18, black: true, key: "w" },
    { name: "D4", freq: 293.66, black: false, key: "s" },
    { name: "D#4", freq: 311.13, black: true, key: "e" },
    { name: "E4", freq: 329.63, black: false, key: "d" },
    { name: "F4", freq: 349.23, black: false, key: "f" },
    { name: "F#4", freq: 369.99, black: true, key: "t" },
    { name: "G4", freq: 392.0, black: false, key: "g" },
    { name: "G#4", freq: 415.3, black: true, key: "y" },
    { name: "A4", freq: 440.0, black: false, key: "h" },
    { name: "A#4", freq: 466.16, black: true, key: "u" },
    { name: "B4", freq: 493.88, black: false, key: "j" },
    { name: "C5", freq: 523.25, black: false, key: "k" },
    { name: "C#5", freq: 554.37, black: true, key: "o" },
    { name: "D5", freq: 587.33, black: false, key: "l" },
    { name: "D#5", freq: 622.25, black: true, key: "p" },
    { name: "E5", freq: 659.25, black: false, key: ";" },
  ];

  const SEQ_NOTES = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
  const PATCH_KEY = "waveform-lab-patches-v1";

  let audioCtx = null;
  let masterGain = null;
  let filter = null;
  let analyser = null;
  const active = new Map();
  let seqSteps = Array(16).fill(false);
  let seqTimer = null;
  let seqIndex = 0;
  let seqPlaying = false;

  const $ = (id) => document.getElementById(id);
  const params = () => ({
    wave: $("waveType").value,
    detune: Number($("detune").value),
    attack: Number($("attack").value),
    decay: Number($("decay").value),
    sustain: Number($("sustain").value),
    release: Number($("release").value),
    filterType: $("filterType").value,
    cutoff: Number($("cutoff").value),
    filterQ: Number($("filterQ").value),
    volume: Number($("volume").value),
  });

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      filter = audioCtx.createBiquadFilter();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      filter.connect(masterGain);
      masterGain.connect(analyser);
      analyser.connect(audioCtx.destination);
      applyVoiceParams();
      drawViz();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    $("btnAudio").textContent = "Audio On";
    $("btnAudio").classList.add("active");
  }

  function applyVoiceParams() {
    if (!filter || !masterGain) return;
    const p = params();
    filter.type = p.filterType;
    filter.frequency.value = p.cutoff;
    filter.Q.value = p.filterQ;
    masterGain.gain.value = p.volume;
  }

  function noteOn(id, freq) {
    ensureAudio();
    if (active.has(id)) noteOff(id);
    const p = params();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = p.wave;
    osc.frequency.value = freq;
    osc.detune.value = p.detune;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(1, now + Math.max(0.005, p.attack));
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.0001, p.sustain),
      now + Math.max(0.005, p.attack) + Math.max(0.01, p.decay)
    );
    osc.connect(gain);
    gain.connect(filter);
    osc.start(now);
    active.set(id, { osc, gain });
    highlightKey(id, true);
  }

  function noteOff(id) {
    const voice = active.get(id);
    if (!voice || !audioCtx) return;
    const p = params();
    const now = audioCtx.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.01, p.release));
    voice.osc.stop(now + Math.max(0.01, p.release) + 0.02);
    active.delete(id);
    highlightKey(id, false);
  }

  function highlightKey(id, on) {
    const el = document.querySelector(`.key[data-id="${CSS.escape(String(id))}"]`);
    if (el) el.classList.toggle("active", on);
  }

  function buildPiano() {
    const piano = $("piano");
    piano.innerHTML = "";
    const whites = NOTES.filter((n) => !n.black);
    whites.forEach((n) => {
      const el = document.createElement("div");
      el.className = "key";
      el.dataset.id = n.name;
      el.title = n.name;
      bindKeyEl(el, n);
      piano.appendChild(el);
    });
    NOTES.filter((n) => n.black).forEach((n) => {
      const idx = NOTES.indexOf(n);
      const whiteBefore = NOTES.slice(0, idx).filter((x) => !x.black).length;
      const el = document.createElement("div");
      el.className = "key black";
      el.dataset.id = n.name;
      el.style.left = `calc(${(whiteBefore - 0.35) * (100 / whites.length)}%)`;
      bindKeyEl(el, n);
      piano.appendChild(el);
    });
  }

  function bindKeyEl(el, note) {
    const start = (e) => {
      e.preventDefault();
      noteOn(note.name, note.freq);
    };
    const end = () => noteOff(note.name);
    el.addEventListener("mousedown", start);
    el.addEventListener("mouseup", end);
    el.addEventListener("mouseleave", end);
    el.addEventListener("touchstart", start, { passive: false });
    el.addEventListener("touchend", end);
  }

  function buildSeq() {
    const grid = $("seqGrid");
    grid.innerHTML = "";
    seqSteps.forEach((on, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "step" + (on ? " on" : "");
      b.setAttribute("aria-label", `Step ${i + 1}`);
      b.addEventListener("click", () => {
        seqSteps[i] = !seqSteps[i];
        b.classList.toggle("on", seqSteps[i]);
      });
      grid.appendChild(b);
    });
  }

  function syncSeqUI() {
    [...$("seqGrid").children].forEach((el, i) => {
      el.classList.toggle("on", seqSteps[i]);
      el.classList.toggle("playhead", seqPlaying && i === seqIndex);
    });
  }

  function tickSeq() {
    if (seqSteps[seqIndex]) {
      const freq = SEQ_NOTES[seqIndex % SEQ_NOTES.length];
      const id = `seq-${seqIndex}-${Date.now()}`;
      noteOn(id, freq);
      setTimeout(() => noteOff(id), 120);
    }
    syncSeqUI();
    seqIndex = (seqIndex + 1) % 16;
  }

  function toggleSeq() {
    ensureAudio();
    if (seqPlaying) {
      clearInterval(seqTimer);
      seqPlaying = false;
      $("btnPlaySeq").textContent = "Play";
      $("btnPlaySeq").classList.remove("active");
      syncSeqUI();
      return;
    }
    seqPlaying = true;
    $("btnPlaySeq").textContent = "Stop";
    $("btnPlaySeq").classList.add("active");
    const bpm = Number($("tempo").value);
    seqTimer = setInterval(tickSeq, (60 / bpm) * 1000 / 2);
  }

  function drawViz() {
    if (!analyser) return;
    const canvas = $("viz");
    const ctx = canvas.getContext("2d");
    const data = new Uint8Array(analyser.frequencyBinCount);
    const render = () => {
      requestAnimationFrame(render);
      analyser.getByteTimeDomainData(data);
      ctx.fillStyle = "#061012";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#2ec4b6";
      ctx.beginPath();
      const slice = canvas.width / data.length;
      for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128;
        const y = (v * canvas.height) / 2;
        const x = i * slice;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = "rgba(240,162,2,0.45)";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    render();
  }

  function bindOutputs() {
    const map = [
      ["detune", "detuneOut", (v) => `${v}`],
      ["attack", "attackOut", (v) => `${Number(v).toFixed(3)}s`],
      ["decay", "decayOut", (v) => `${Number(v).toFixed(2)}s`],
      ["sustain", "sustainOut", (v) => Number(v).toFixed(2)],
      ["release", "releaseOut", (v) => `${Number(v).toFixed(2)}s`],
      ["cutoff", "cutoffOut", (v) => `${v} Hz`],
      ["filterQ", "filterQOut", (v) => Number(v).toFixed(1)],
      ["volume", "volumeOut", (v) => `${Math.round(v * 100)}%`],
      ["tempo", "tempoOut", (v) => `${v} BPM`],
    ];
    map.forEach(([id, out, fmt]) => {
      const el = $(id);
      const sync = () => {
        $(out).textContent = fmt(el.value);
        applyVoiceParams();
        if (id === "tempo" && seqPlaying) {
          clearInterval(seqTimer);
          seqTimer = setInterval(tickSeq, (60 / Number(el.value)) * 1000 / 2);
        }
      };
      el.addEventListener("input", sync);
      sync();
    });
    $("waveType").addEventListener("change", applyVoiceParams);
    $("filterType").addEventListener("change", applyVoiceParams);
  }

  function getPatches() {
    try {
      return JSON.parse(localStorage.getItem(PATCH_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function refreshPatchList() {
    const list = $("patchList");
    const patches = getPatches();
    list.innerHTML = "";
    Object.keys(patches).sort().forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      list.appendChild(opt);
    });
  }

  function savePatch() {
    const name = ($("patchName").value || "Untitled").trim();
    const patches = getPatches();
    patches[name] = { ...params(), seq: [...seqSteps] };
    localStorage.setItem(PATCH_KEY, JSON.stringify(patches));
    $("patchName").value = name;
    refreshPatchList();
  }

  function loadPatch() {
    const name = $("patchList").value || $("patchName").value.trim();
    const patch = getPatches()[name];
    if (!patch) return alert("Select a saved patch first.");
    $("waveType").value = patch.wave;
    $("detune").value = patch.detune;
    $("attack").value = patch.attack;
    $("decay").value = patch.decay;
    $("sustain").value = patch.sustain;
    $("release").value = patch.release;
    $("filterType").value = patch.filterType;
    $("cutoff").value = patch.cutoff;
    $("filterQ").value = patch.filterQ;
    $("volume").value = patch.volume;
    seqSteps = Array.isArray(patch.seq) ? patch.seq.slice(0, 16) : Array(16).fill(false);
    while (seqSteps.length < 16) seqSteps.push(false);
    bindOutputs();
    buildSeq();
    applyVoiceParams();
    $("patchName").value = name;
  }

  function deletePatch() {
    const name = $("patchList").value;
    if (!name) return;
    const patches = getPatches();
    delete patches[name];
    localStorage.setItem(PATCH_KEY, JSON.stringify(patches));
    refreshPatchList();
  }

  function setupMidi() {
    const status = $("midiStatus");
    if (!navigator.requestMIDIAccess) {
      status.textContent = "MIDI: not supported";
      status.classList.add("warn");
      return;
    }
    navigator.requestMIDIAccess().then((access) => {
      const inputs = [...access.inputs.values()];
      if (!inputs.length) {
        status.textContent = "MIDI: no device";
        status.classList.add("warn");
      } else {
        status.textContent = `MIDI: ${inputs[0].name}`;
        status.classList.add("ok");
      }
      const onMessage = (e) => {
        const [cmd, note, vel] = e.data;
        const type = cmd & 0xf0;
        const freq = 440 * Math.pow(2, (note - 69) / 12);
        const id = `midi-${note}`;
        if (type === 0x90 && vel > 0) noteOn(id, freq);
        if (type === 0x80 || (type === 0x90 && vel === 0)) noteOff(id);
      };
      access.inputs.forEach((input) => {
        input.onmidimessage = onMessage;
      });
      access.onstatechange = () => setupMidi();
    }).catch(() => {
      status.textContent = "MIDI: permission denied";
      status.classList.add("warn");
    });
  }

  const keyMap = Object.fromEntries(NOTES.map((n) => [n.key, n]));
  const held = new Set();

  window.addEventListener("keydown", (e) => {
    if (e.repeat || e.target.matches("input,select,textarea")) return;
    const note = keyMap[e.key.toLowerCase()];
    if (!note || held.has(note.name)) return;
    held.add(note.name);
    noteOn(note.name, note.freq);
  });
  window.addEventListener("keyup", (e) => {
    const note = keyMap[e.key.toLowerCase()];
    if (!note) return;
    held.delete(note.name);
    noteOff(note.name);
  });

  $("btnAudio").addEventListener("click", ensureAudio);
  $("btnPlaySeq").addEventListener("click", toggleSeq);
  $("btnClearSeq").addEventListener("click", () => {
    seqSteps = Array(16).fill(false);
    buildSeq();
  });
  $("btnSave").addEventListener("click", savePatch);
  $("btnLoad").addEventListener("click", loadPatch);
  $("btnDelete").addEventListener("click", deletePatch);

  buildPiano();
  buildSeq();
  bindOutputs();
  refreshPatchList();
  setupMidi();
})();
