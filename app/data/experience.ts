export interface Experience {
  id: number;
  title: string;
  company: string;
  shortCompany?: string;
  location?: string;
  duration: string;
  description: string;
  technologies?: string[];
  achievements?: string[];
  type: 'work' | 'internship' | 'project' | 'education';
  logo?: string;
}

export const experiences: Experience[] = [
  {
    id: 4,
    title: "Software Engineer",
    company: "Debatable",
    duration: "October 2026 - Present",
    description: "Spearheaded Debatable 2.0, defining the spec and building the AWS platform to migrate a live product with 5,000+ users off Netlify.",
    technologies: ["AWS CDK", "AWS Fargate", "Application Load Balancer", "GitHub Actions", "OpenID Connect"],
    achievements: [
      "Built the AWS CDK stack on Fargate behind an internal Application Load Balancer, with 21 infrastructure tests running in CI on every pull request",
      "Migrated Debatable from Netlify to AWS, cutting monthly hosting costs from $340 to $120 (about 65%)",
      "Set up CI/CD with GitHub Actions OpenID Connect, a migration step on the new image, and a /v1/version verification gate, cutting deploy time from 12 to 4 minutes"
    ],
    type: "work"
  },
  {
    id: 3,
    title: "Software Development Engineer Intern",
    company: "Amazon",
    logo: "/AmazonLogo.png",
    location: "Seattle, WA",
    duration: "May 2026 - Present",
    description: "Working on the Devices team under Amazon Photos curation, building automated systems that serve millions of customers.",
    technologies: ["Java", "AWS Lambda", "Amazon S3", "AWS CDK", "DynamoDB"],
    achievements: [
      "Designed and implemented an automated greeting card generation system serving 20%+ of Amazon Photos customers who have labeled loved ones, replacing a manual process with a scalable, rules-based pipeline",
      "Built automated customer eligibility identification using face clusters, relationship labels, and household classification to determine greeting card recipients across 8+ occasion types (birthdays, holidays, anniversaries)"
    ],
    type: "internship"
  },
  {
    id: 2,
    title: "Cybersecurity Intern",
    company: "UT RSOC",
    logo: "/ISOEmblem--White.png",
    location: "Austin, TX",
    duration: "April 2025 - August 2025",
    description: "Supported real-time security operations for the UT Austin network.",
    technologies: ["Linux CLI", "Python", "Bash", "Network Protocols", "Splunk"],
    achievements: [
      "Reduced incident triage time by 90% by automating log parsing scripts",
      "Identified and escalated critical threats through Splunk searches and forensic analysis"
    ],
    type: "internship"
  },
  {
    id: 1,
    title: "Machine Learning Research Intern",
    company: "UTSA Unmanned Systems Lab",
    shortCompany: "UTSA",
    logo: "/utsa.png",
    location: "San Antonio, TX",
    duration: "January 2024 - August 2024",
    description: "Conducted reinforcement learning research to optimize autonomous agent navigation using MuJoCo physics environments and custom AI algorithms.",
    technologies: ["Python", "MuJoCo", "Matplotlib", "Numpy", "Tensorboard/Tensorflow"],
    achievements: [
      "Trained models across 4 different environments while running 50+ parallel experiments daily, leveraging Python, NumPy, and Matplotlib for data analysis.",
      "Collaborated with a team of 3 researchers to develop 5 novel algorithms in dynamic traffic simulations"
    ],
    type: "internship"
  },
];
