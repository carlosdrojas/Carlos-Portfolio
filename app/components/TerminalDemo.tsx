'use client';

import React, { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';

interface FileSystem {
  [key: string]: string | FileSystem;
}

interface Job {
  id: number;
  cmd: string;
  state: 'Running' | 'Stopped' | 'Done';
}

const SIMULATED_FS: FileSystem = {
  'home': {
    'carlos': {
      'projects': {
        'yash': {
          'yash.c': '/* yash - Yet Another Shell */\n#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\n...',
          'Makefile': 'yash : yash.c\n\tgcc yash.c -o yash -lreadline\n\nclean :\n\trm yash',
          'README.md': '# Yash - Yet Another Shell\nA custom Unix shell with pipes, redirection, and job control.',
        },
        'portfolio': {
          'package.json': '{ "name": "carlos-portfolio", "version": "1.0.0" }',
          'README.md': '# Carlos Portfolio\nBuilt with Next.js and Tailwind CSS.',
        },
      },
      'notes.txt': 'Remember to push yash updates.\nAlso fix the pipe edge case.',
      '.bashrc': 'export PATH=$PATH:/usr/local/bin\nalias ll="ls -la"',
    },
  },
};

function resolvePath(cwd: string, target: string): string {
  if (target.startsWith('/')) {
    const parts = target.split('/').filter(Boolean);
    return '/' + parts.join('/');
  }
  const cwdParts = cwd.split('/').filter(Boolean);
  const targetParts = target.split('/').filter(Boolean);
  for (const part of targetParts) {
    if (part === '..') {
      cwdParts.pop();
    } else if (part !== '.') {
      cwdParts.push(part);
    }
  }
  return '/' + cwdParts.join('/');
}

function getNode(path: string): string | FileSystem | null {
  const parts = path.split('/').filter(Boolean);
  let current: string | FileSystem = SIMULATED_FS;
  for (const part of parts) {
    if (typeof current === 'string') return null;
    if (!(part in current)) return null;
    current = current[part];
  }
  return current;
}

function isDir(path: string): boolean {
  const node = getNode(path);
  return node !== null && typeof node !== 'string';
}

export default function TerminalDemo() {
  const [lines, setLines] = useState<string[]>([
    'yash - Yet Another Shell v1.0',
    'Type "help" for available commands.',
    '',
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/home/carlos/projects/yash');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [nextJobId, setNextJobId] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getPrompt = () => {
    const home = '/home/carlos';
    const display = cwd.startsWith(home) ? '~' + cwd.slice(home.length) : cwd;
    return `carlos@yash:${display}$ `;
  };

  const processCommand = (rawInput: string) => {
    const trimmed = rawInput.trim();
    const newLines = [...lines, getPrompt() + trimmed];

    if (!trimmed) {
      setLines(newLines);
      return;
    }

    setHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);

    // Handle pipes
    if (trimmed.includes('|')) {
      const parts = trimmed.split('|').map(s => s.trim());
      const leftResult = executeCmd(parts[0], cwd);
      if (parts.length === 2) {
        const rightResult = executePipedCmd(parts[1], leftResult);
        setLines([...newLines, ...rightResult]);
      } else {
        setLines([...newLines, ...leftResult]);
      }
      return;
    }

    // Handle background
    const isBg = trimmed.endsWith('&');
    const cmd = isBg ? trimmed.slice(0, -1).trim() : trimmed;

    if (isBg) {
      const jobId = nextJobId;
      setNextJobId(prev => prev + 1);
      setJobs(prev => [...prev, { id: jobId, cmd: cmd, state: 'Running' }]);
      setLines([...newLines, `[${jobId}] Running\t\t\t${cmd} &`]);
      return;
    }

    // Handle redirects
    const redirectMatch = cmd.match(/^(.+?)\s*>\s*(\S+)$/);
    if (redirectMatch) {
      const file = redirectMatch[2];
      setLines([...newLines, `(output redirected to ${file})`]);
      return;
    }

    const result = executeCmd(cmd, cwd);
    setLines([...newLines, ...result]);
  };

  const executeCmd = (cmd: string, currentCwd: string): string[] => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        return [
          'Available commands:',
          '  help              Show this help message',
          '  ls [path]         List directory contents',
          '  cd <path>         Change directory',
          '  cat <file>        Display file contents',
          '  echo <text>       Print text to stdout',
          '  pwd               Print working directory',
          '  whoami            Print current user',
          '  date              Print current date',
          '  jobs              List background jobs',
          '  fg                Bring job to foreground',
          '  bg                Resume stopped job in background',
          '  clear             Clear the terminal',
          '',
          'Supported features:',
          '  cmd1 | cmd2       Pipe output between commands',
          '  cmd > file        Redirect output to file',
          '  cmd < file        Redirect input from file',
          '  cmd &             Run command in background',
        ];

      case 'ls': {
        const target = args[0] ? resolvePath(currentCwd, args[0]) : currentCwd;
        const node = getNode(target);
        if (!node) return [`ls: cannot access '${args[0] || target}': No such file or directory`];
        if (typeof node === 'string') return [args[0] || target.split('/').pop() || ''];
        const entries = Object.keys(node);
        const formatted = entries.map(e => {
          const isDirectory = typeof node[e] !== 'string';
          return isDirectory ? `\x1b[1;34m${e}/\x1b[0m` : e;
        });
        return [formatted.join('  ')];
      }

      case 'cd': {
        if (!args[0] || args[0] === '~') {
          setCwd('/home/carlos');
          return [];
        }
        const target = resolvePath(currentCwd, args[0]);
        if (!isDir(target)) return [`cd: ${args[0]}: No such file or directory`];
        setCwd(target);
        return [];
      }

      case 'cat': {
        if (!args[0]) return ['cat: missing operand'];
        const target = resolvePath(currentCwd, args[0]);
        const node = getNode(target);
        if (!node) return [`cat: ${args[0]}: No such file or directory`];
        if (typeof node !== 'string') return [`cat: ${args[0]}: Is a directory`];
        return node.split('\n');
      }

      case 'echo':
        return [args.join(' ')];

      case 'pwd':
        return [currentCwd];

      case 'whoami':
        return ['carlos'];

      case 'date':
        return [new Date().toString()];

      case 'jobs': {
        if (jobs.length === 0) return [];
        return jobs.map(j => `[${j.id}]${j.id === jobs[jobs.length - 1].id ? '+' : '-'} ${j.state}\t\t\t${j.cmd}`);
      }

      case 'fg': {
        if (jobs.length === 0) return ['fg: no current job'];
        const latest = jobs[jobs.length - 1];
        setJobs(prev => prev.filter(j => j.id !== latest.id));
        return [latest.cmd, `(${latest.cmd} brought to foreground and completed)`];
      }

      case 'bg': {
        const stopped = jobs.filter(j => j.state === 'Stopped');
        if (stopped.length === 0) return ['bg: no stopped job'];
        const latest = stopped[stopped.length - 1];
        setJobs(prev => prev.map(j => j.id === latest.id ? { ...j, state: 'Running' } : j));
        return [`[${latest.id}]+ Running\t\t\t${latest.cmd} &`];
      }

      case 'clear':
        setLines([]);
        return [];

      case 'man':
        return [`No manual entry for ${args[0] || 'unknown'}`, 'Try "help" for available commands.'];

      case 'mkdir':
        return [`mkdir: simulated filesystem is read-only`];

      case 'touch':
        return [`touch: simulated filesystem is read-only`];

      case 'rm':
        return [`rm: simulated filesystem is read-only`];

      case 'grep': {
        if (args.length < 2) return ['grep: missing arguments. Usage: grep <pattern> <file>'];
        const pattern = args[0];
        const filePath = resolvePath(currentCwd, args[1]);
        const fileNode = getNode(filePath);
        if (!fileNode || typeof fileNode !== 'string') return [`grep: ${args[1]}: No such file`];
        const matching = fileNode.split('\n').filter(line => line.includes(pattern));
        return matching.length > 0 ? matching : [];
      }

      case 'wc': {
        if (!args[0]) return ['wc: missing operand'];
        const filePath = resolvePath(currentCwd, args[0]);
        const fileNode = getNode(filePath);
        if (!fileNode || typeof fileNode !== 'string') return [`wc: ${args[0]}: No such file`];
        const lineCount = fileNode.split('\n').length;
        const wordCount = fileNode.split(/\s+/).filter(Boolean).length;
        const charCount = fileNode.length;
        return [`  ${lineCount}  ${wordCount}  ${charCount} ${args[0]}`];
      }

      case 'head': {
        if (!args[0]) return ['head: missing operand'];
        const filePath = resolvePath(currentCwd, args[0]);
        const fileNode = getNode(filePath);
        if (!fileNode || typeof fileNode !== 'string') return [`head: ${args[0]}: No such file`];
        return fileNode.split('\n').slice(0, 10);
      }

      default:
        return [`yash: ${command}: command not found`];
    }
  };

  const executePipedCmd = (cmd: string, inputLines: string[]): string[] => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);
    const inputText = inputLines.join('\n');

    switch (command) {
      case 'grep': {
        if (!args[0]) return ['grep: missing pattern'];
        const pattern = args[0];
        return inputLines.filter(line => line.includes(pattern));
      }

      case 'wc': {
        const lineCount = inputLines.length;
        const wordCount = inputText.split(/\s+/).filter(Boolean).length;
        const charCount = inputText.length;
        if (args[0] === '-l') return [`${lineCount}`];
        if (args[0] === '-w') return [`${wordCount}`];
        return [`  ${lineCount}  ${wordCount}  ${charCount}`];
      }

      case 'head': {
        const n = args[0] === '-n' && args[1] ? parseInt(args[1]) : 10;
        return inputLines.slice(0, n);
      }

      case 'sort':
        return [...inputLines].sort();

      case 'cat':
        return inputLines;

      default:
        return [`yash: ${command}: command not found`];
    }
  };

  const renderLine = (line: string) => {
    // Handle ANSI-like color codes for directory display
    const parts: (string | React.ReactElement)[] = [];
    const regex = /\x1b\[1;34m(.*?)\x1b\[0m/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(
        <span key={match.index} className="text-blue-400 font-bold">{match[1]}</span>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    return parts.length > 0 ? parts : line;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(newIdx);
      setInput(history[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const newIdx = historyIdx + 1;
      if (newIdx >= history.length) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-[#1a1b26] text-[#a9b1d6] font-mono text-sm h-full overflow-y-auto p-4 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap leading-relaxed min-h-[1.4em]">
          {renderLine(line)}
        </div>
      ))}
      <div className="flex items-center">
        <span className="text-green-400 shrink-0">{getPrompt()}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none text-[#a9b1d6] flex-1 caret-green-400 ml-0"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
