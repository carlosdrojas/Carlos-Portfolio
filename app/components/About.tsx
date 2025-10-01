'use client';

import { motion } from 'framer-motion';
import { User, Award, Target, Coffee } from 'lucide-react';
import Image from 'next/image';

const stats = [
  { icon: Award, label: 'Projects Completed', value: '20+' },
  { icon: Coffee, label: 'Energy Drinks', value: '500+' },
  { icon: Target, label: 'Years Coding', value: '5+' },
];

export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About Me
          </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            I&apos;m a passionate full-stack developer and aspiring software engineer focused on
             building scalable, user-centric applications and leveraging modern technologies to solve real-world problems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden">
                <Image
                  src="/profile.jpg" 
                  alt="Carlos Rojas"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                My Journey
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Growing up in Laredo, Texas, my passion for technology began through
                 high school robotics, where I learned to solve complex problems with limited resources and collaborate under pressure.
                  Those early experiences sparked a curiosity that led me to pursue Electrical and Computer Engineering at UT Austin,
                   where I&apos;ve spent the past several years building skills across full-stack development, embedded systems, and machine learning.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                My Approach
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I approach every project with a focus on clarity, scalability, and impact. 
                I believe great software is intuitive, maintainable, and built to last. I write 
                clean, modular code, design user-first interfaces, and continually learn new 
                technologies to create meaningful, high-performance experiences.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
