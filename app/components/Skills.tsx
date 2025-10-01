'use client';

import { motion } from 'framer-motion';
import { Code, Database, GitBranch, CircuitBoard, MicVocal, Brain } from 'lucide-react';

const skills = [
  {
    category: 'Frontend',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion']
  },
  {
    category: 'Backend',
    icon: Database,
    color: 'from-green-500 to-emerald-500',
    technologies: ['Node.js', 'Express', 'Python', 'Serverless Function', 'Rest APIs']
  },
  {
    category: 'Embedded Systems',
    icon: CircuitBoard,
    color: 'from-purple-500 to-pink-500',
    technologies: ['C',
      'Assembly',
      'MSPM0 Microcontrollers',
      'Finite State Machines',
      'PCB Design (KiCad)',
      'Real-Time Systems',
      'UART / GPIO',]
  },
  {
    category: 'ML / AI',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    technologies: ['Python',
      'Pandas',
      'NumPy',
      'Matplotlib',
      'Stable-Baselines3',
      'MuJoCo',
      'Reinforcement Learning',
      'Algorithm Tuning (PPO, ETPPO)',]
  },
  {
    category: 'Tools',
    icon: GitBranch,
    color: 'from-pink-500 to-rose-500',
    technologies: [
      'Git',
      'GitHub',
      'VS Code',
      'Docker',
      'Vercel',
      'CI/CD',
      'Linux CLI',
      'Figma']
  },
  {
    category: 'Soft Skills',
    icon: MicVocal,
    color: 'from-pink-500 to-rose-500',
    technologies: [
      'Leadership',
      'Team Collaboration',
      'Public Speaking',
      'Project Management',
      'Problem Solving',
      'Adaptability',
      'Mentorship',
      'Strategic Thinking',
    ]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Technical Skills
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I work with a variety of modern technologies and tools to build high-quality applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${skill.color}`}>
                  <skill.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
                  {skill.category}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skill.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
