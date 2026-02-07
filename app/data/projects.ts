export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  hasDemo?: boolean;
}

export const projects: Project[] = [
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
    id: 5,
    title: "Space Invaders Clone",
    description: "A fully playable Space Invaders game implemented in C and Assembly on the MSPM0 microcontroller, featuring a custom PCB and state-driven game logic.",
    image: "/SpaceInv.jpg",
    tags: ["C", "Assembly"],
    // githubUrl: "https://github.com/username/task-manager",
    // liveUrl: s"https://fastweb-phi.vercel.app/"
  },
  {
    id: 6,
    title: "Portfolio Website",
    description: "A modern, animated portfolio built with Next.js, Tailwind CSS, and Framer Motion to highlight projects and skills with smooth UI/UX.",
    image: "/Port.jpg",
    tags: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript"],
    githubUrl: "https://github.com/carlosdrojas/Carlos-Portfolio",
    liveUrl: "https://carlos-portfolio-beta.vercel.app/"
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
