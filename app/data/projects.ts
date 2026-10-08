export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  hasDemo?: boolean;
  // Ownership or code-policy context, shown under the description.
  note?: string;
}

export const projects: Project[] = [
  {
    id: 11,
    title: "ARCA",
    description: "Automatic root-cause response for a home-battery fleet, built in 48 hours by a team of three at the Base Power × AITX Talent Hackathon. I built the response engine: a deterministic policy gate in front of a Claude planner (with a playbook fallback), a verifier that re-reads each device after a fix, technician scheduling, and a simulated inverter fleet that refuses unsafe actions on its own. Graded against a hidden answer key, it matched 40 of 47 faulted units with zero wrong hardware pulls. It runs on a synthetic telemetry pack, not real Base data.",
    image: "/arca.jpg",
    tags: ["TypeScript", "Node.js", "Claude API", "Render"],
    note: "Team of 3. My part: the response engine and fleet simulator (src/response, src/sim).",
    githubUrl: "https://github.com/carlosdrojas/base-hackathon",
    liveUrl: "https://arca-demo.onrender.com",
  },
  {
    id: 12,
    title: "FleetFlight",
    description: "Pre-release verification for distributed battery firmware. A bounded model checker explores every allowed ordering of faults and messages across a BMS, hub, and inverter, returns the shortest failing sequence for each violated safety invariant, replays it deterministically, and generates a pytest regression. A full check covers 1.29 million states in about 36 seconds. Includes a CLI, a React dashboard, a CI gate, and a three.js 3D replay of each counterexample.",
    image: "/fleetflight.jpg",
    tags: ["Python", "React", "TypeScript", "three.js"],
    note: "Solo. The hosted site shows a snapshot of a real check run; replays run live.",
    githubUrl: "https://github.com/carlosdrojas/fleetflight",
    liveUrl: "https://fleetflight.vercel.app",
  },
  {
    id: 16,
    title: "Fantasy GM",
    description: "A general manager for ESPN fantasy football leagues. It syncs leagues through ESPN's API into a history store behind FastAPI, and a Next.js dashboard shows power rankings with all-play records and luck, an exact lineup optimizer (solved as an assignment problem, so FLEX slots fill correctly), waiver pickups, a trade finder that searches every 1-for-1 to 2-for-2 deal, and playoff odds from 5,000 simulated seasons that re-run for any trade you're weighing. Includes multi-user sign-in, encrypted ESPN cookies, and a Claude assistant with read-only tools. It never changes your team.",
    image: "/fantasy-gm.jpg",
    tags: ["Python", "FastAPI", "Next.js", "TypeScript"],
    note: "Solo. The live demo is a made-up league built from real NFL players and weekly points.",
    githubUrl: "https://github.com/carlosdrojas/fantasy-gm",
    liveUrl: "https://fantasy-gm-sepia.vercel.app",
  },
  {
    id: 1,
    title: "FormCoach",
    description: "A real-time AI-powered vertical jump form analyzer that runs entirely in the browser. Uses MediaPipe Pose estimation to detect body landmarks, automatically segment jump phases via a state machine, compute biomechanical metrics (knee/hip angles, trunk lean, valgus deviation, arm swing timing, jump height), and deliver personalized coaching feedback with actionable drills. Supports standing and approach vertical jumps, includes skeleton-overlay replay with phase markers, and persists rep history locally — all client-side with zero data leaving your device.",
    image: "/FormCoach.png",
    tags: ["Next.js", "TypeScript", "MediaPipe", "React"],
    liveUrl: "https://form-coach.vercel.app/",
  },
  {
    id: 2,
    title: "Yash Shell",
    description: "A custom Unix shell built from scratch in C, featuring process creation with fork/exec, piping, I/O redirection, background process execution, and full job control with fg/bg and signal handling.",
    image: "/placeholder-project-1.png",
    tags: ["C", "Unix", "Systems Programming"],
    hasDemo: true,
  },
  {
    id: 13,
    title: "Buck Converter",
    description: "A synchronous buck converter on a custom 2-layer PCB, designed for 20 V in to about 5 V out: a TPS2832 synchronous gate driver, two power MOSFETs, a 100 µH inductor, and a 0.5 Ω sense resistor feeding an op-amp current-sense amplifier, with 16 test points for probing. We laid out the board in KiCad, ordered it from JLCPCB, assembled it, and brought it up in stages, confirming complementary gate drive at 50 kHz on the scope.",
    image: "/buck-converter.jpg",
    tags: ["KiCad", "PCB Design", "Power Electronics", "Analog"],
    note: "Team of 2 (ECE 302). The schematic came from the course; the layout, assembly, and bring-up were ours.",
  },
  {
    id: 10,
    title: "PathSong",
    description: "A first-person navigation simulator for visually impaired users that guides an agent through a room using only directional audio cues — a sub-bass bearing tone that pans left/right to indicate heading, and a proximity chirp that speeds up as the target approaches. Supports a full 24-trial participant study logging per-frame telemetry at ~60 Hz, testing 11 audio conditions across 1D and 8×8 m 2D environments. Extended with AI2-THOR 3D navigation and live YOLOv8 object detection. (ECE 460J — Spring 2026)",
    image: "/pathsong.png",
    tags: ["Python", "Pygame", "PyOpenAL", "YOLOv8", "AI2-THOR"],
    videoUrl: "https://youtu.be/jcd2gCReXcY",
  },
  {
    id: 14,
    title: "Embedded Alarm Clock",
    description: "A stand-alone alarm clock on a TI MSPM0G3507: an ST7735R LCD with analog and digital faces, a 20-key matrix keypad, a MOSFET-driven beep speaker, a DAC-to-amplifier path that plays song clips from flash, a thermistor temperature readout, and an IR sensor that silences the alarm with a wave. A 2 kHz timer interrupt handles timekeeping, keypad scanning, and the speaker, while all LCD work stays in the main loop. Measured 0.95 mV RMS noise on the 3.3 V rail and 22 ms LCD update latency, and added a gate resistor, diode, and capacitor to remove a ~4.4 V turn-off spike at the speaker driver.",
    image: "/alarm-clock.jpg",
    tags: ["C", "MSPM0", "KiCad", "Embedded"],
    note: "Team of 2 (ECE 445L). Code kept private per course policy.",
  },
  {
    id: 5,
    title: "Space Invaders Clone",
    description: "A fully playable Space Invaders game implemented in C and Assembly on the MSPM0 microcontroller, featuring a custom PCB and state-driven game logic.",
    image: "/SpaceInv.jpg",
    tags: ["C", "Assembly"],
    // githubUrl: "https://github.com/username/task-manager",
    // liveUrl: s"https://fastweb-phi.vercel.app/"
  },
  {
    id: 15,
    title: "PintOS Kernel",
    description: "User-program support for the PintOS teaching kernel on 32-bit x86: system calls with user-memory validation, argument passing on the user stack, semaphore-based parent/child process synchronization, and per-process file descriptor tables behind a global filesystem lock.",
    image: "/pintos.jpg",
    tags: ["C", "x86", "Operating Systems"],
    note: "ECE 461S course project. Code kept private per course policy.",
  },
  {
    id: 3,
    title: "MetadataEditor",
    description: "An Electron desktop app for batch-applying metadata to music files. Converts MP3, WAV, and FLAC to M4A, embeds cover art, and auto-numbers tracks via OCR or text input with fuzzy filename matching.",
    image: "/placeholder-project-2.png",
    tags: ["Electron", "Node.js", "JavaScript"],
    githubUrl: "https://github.com/carlosdrojas/MetaEditor",
  },
  {
    id: 4,
    title: "Algorithm Visualizer",
    description: "An interactive pathfinding visualizer built with Next.js and React, showcasing BFS and DFS algorithms in real time on a dynamic grid.",
    image: "/AlgoVis.jpg",
    tags: ["Next.js", "Node.js", "React", "CSS"],
    githubUrl: "https://github.com/carlosdrojas/AlgoVisualizer",
    liveUrl: "https://algo-visualizer-sand.vercel.app/",
  },
  {
    id: 6,
    title: "Portfolio Website",
    description: "A modern, animated portfolio built with Next.js, Tailwind CSS, and Framer Motion to highlight projects and skills with smooth UI/UX.",
    image: "/Port.jpg",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    githubUrl: "https://github.com/carlosdrojas/Carlos-Portfolio",
    liveUrl: "https://carlosrojas.me"
  },
  {
    id: 7,
    title: "Traffic Light FSM",
    description: "A real-time traffic light controller implemented as a finite state machine on an embedded system, demonstrating low-level programming and timing control.",
    image: "/TrafficFSM.jpg",
    tags: ["C", "Assembly"],
    // githubUrl: "https://github.com/username/ai-chatbot",
    // liveUrl: "https://chatbot-demo.vercel.app"
  },
  {
    id: 8,
    title: "Rowdy Park",
    description: "A 48-hour hackathon action-adventure RPG where players explore a dynamic map and battle enemies, built with Python and Pygame.",
    image: "/RowdyPark.jpg",
    tags: ["Python", "Pygame"],
    githubUrl: "https://github.com/emig23/dino-game",
    // liveUrl: "https://weather-dashboard-demo.vercel.app"
  },
  {
    id: 9,
    title: "Cyclone Database",
    description: "A lightweight Java command-line database system utilizing arrays and custom data structures to store, retrieve, and manage cyclone records efficiently.",
    image: "/Cyclone.jpg",
    tags: ["Java"],
    // githubUrl: "https://github.com/username/recipe-finder",
    // liveUrl: "https://recipe-finder-demo.vercel.app"
  },
];
