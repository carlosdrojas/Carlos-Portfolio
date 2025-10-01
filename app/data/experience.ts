export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  technologies?: string[];
  achievements?: string[];
  type: 'work' | 'internship' | 'project' | 'education';
}

export const experiences: Experience[] = [
  {
    id: 1,
    title: "Machine Learning Research Intern",
    company: "UTSA Unmanned Systems Lab",
    location: "San Antonio, TX",
    duration: "January 2024 - August 2024",
    description: "Conducted reinforcement learning research to optimize autonomous agent navigation using MuJoCo physics environments and custom AI algorithms.",
    technologies: ["Python", "MuJoCo", "Matplotlib", "Numpy", "Numpy", "Tensorboard/Tensorflow"],
    achievements: [
      "Trained models across 4 different environments while running 50+ parallel experiments daily, leveraging Python, NumPy, and Matplotlib for data analysis.",
      "Collaborated with a team of 3 researchers to develop 5 novel algorithms in dynamic traffic simulations"
    ],
    type: "research internship"
  },

  {
    id: 1,
    title: "Cybersecurity Intern",
    company: "UT RSOC",
    location: "Austin, TX",
    duration: "April 2025 - Present",
    description: "Supported real-time security operations for the UT Austin network.",
    technologies: ["Linux CLI", "Python", "Bash", "Network Protocols", "Splunk"],
    achievements: [
      "Reduced incident triage time by 90% by automating log parsing scripts",
      "Identified and escalated critical threats through Splunk searches and forensic analysis"
    ],
    type: "internship"
  }, 
  
];