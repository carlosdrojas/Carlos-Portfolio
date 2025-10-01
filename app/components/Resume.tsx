'use client';

import { motion } from 'framer-motion';
import { Download, Eye, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function Resume() {
  const [isViewing, setIsViewing] = useState(true);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/resume.pdf';
    link.download = 'Andre_Silva_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    setIsViewing(!isViewing);
  };

  return (
    <section id="resume" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Resume
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Download or view my resume to learn more about my experience and qualifications
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Resume Actions */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start mb-3">
                  <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Carlos Rojas - Resume
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Electrical and Computer Engineering • The University of Texas at Austin
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleView}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  {isViewing ? 'Hide' : 'View'} Resume
                </button>
                
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
                
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>

          {/* Resume Viewer */}
          {isViewing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 bg-gray-100 dark:bg-gray-700 border-b">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Resume Preview
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click -Download PDF- for the full version
                </p>
              </div>
              
              <div className="relative w-full" style={{ height: '800px' }}>
                <iframe
                  src="/resume.pdf"
                  className="w-full h-full border-0"
                  title="Resume Preview"
                />
              </div>
            </motion.div>
          )}

          
        </motion.div>
      </div>
    </section>
  );
}