'use client';

import { motion } from 'framer-motion';
import { experiences } from '../data/experience';
import { Briefcase, MapPin, Calendar, Award } from 'lucide-react';

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Experience
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            My professional journey and key experiences
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline line */}
              {index < experiences.length - 1 && (
                <div className="absolute left-1/2 top-20 w-0.5 h-full bg-blue-200 dark:bg-blue-800 transform -translate-x-1/2" />
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-1/2 top-8 w-4 h-4 bg-blue-600 rounded-full transform -translate-x-1/2 z-10" />
              
              <div className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-3">
                      <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        experience.type === 'work' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        experience.type === 'internship' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        experience.type === 'project' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {experience.type}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {experience.title}
                    </h3>
                    <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      {experience.company}
                    </h4>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="mr-4">{experience.location}</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{experience.duration}</span>
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {experience.description}
                    </p>
                    
                    {experience.technologies && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Technologies:
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {experience.achievements && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                          <Award className="w-4 h-4 mr-1" />
                          Key Achievements:
                        </h5>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {experience.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-blue-600 mr-2">•</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}