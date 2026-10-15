import React, { useState } from 'react';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Layers,
  FileCheck,
  Cpu,
  Terminal,
  LayoutGrid,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Code2,
  Radio,
} from 'lucide-react';
import { SHEIKH_PROJECTS } from '../data/mockData';
import { SheikhProject } from '../types';

interface ProjectHubProps {
  onSelectProjectTab?: (tabName: string) => void;
}

export const ProjectHub: React.FC<ProjectHubProps> = ({ onSelectProjectTab }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredProjects =
    activeFilter === 'All'
      ? SHEIKH_PROJECTS
      : SHEIKH_PROJECTS.filter((p) => p.status === activeFilter);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return Layers;
      case 'FileCheck':
        return FileCheck;
      case 'Cpu':
        return Cpu;
      case 'Terminal':
        return Terminal;
      case 'Radio':
        return Radio;
      default:
        return LayoutGrid;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Title & Filter Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-purple-500/40 bg-slate-950 p-0.5 shadow-lg shadow-purple-950/40 overflow-hidden">
              <img
                src="/src/assets/images/sheikh_farid_logo_1792083190919.jpg"
                alt="Sheikh Farid AI Studio Official Logo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl flex items-center gap-2">
                শেখ ফরিদ প্রজেক্ট হাব
                <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/30">
                  SF Studio Hub
                </span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                প্রধান সফটওয়্যার স্থপতি মোহাম্মদ শেখ ফরিদ উদ্ভাবিত হাই-পারফরম্যান্স গভটেক, এআই মডেল ও মিনি মাইক্রোসফট পিডব্লিউএ স্যুট।
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1">
          {['All', 'Production', 'Beta', 'Active'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter === 'All' ? 'সকল প্রজেক্ট' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project: SheikhProject) => {
          const Icon = getIcon(project.iconName);
          return (
            <div
              key={project.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:border-purple-500/40 hover:bg-slate-900 hover:shadow-2xl hover:shadow-purple-950/20"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-purple-500/30 bg-purple-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300">
                      {project.badge}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        project.status === 'Production'
                          ? 'bg-emerald-400'
                          : project.status === 'Beta'
                          ? 'bg-cyan-400'
                          : 'bg-amber-400'
                      }`}
                    ></span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400">
                    {project.tagline}
                  </p>
                </div>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Highlights */}
                <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
                  {project.highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                      <CheckCircle className="h-3 w-3 text-purple-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack & Action bottom */}
              <div className="mt-6 border-t border-slate-800/80 pt-4">
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>গিটহাব কোড</span>
                  </a>

                  {onSelectProjectTab && (
                    <button
                      onClick={() => {
                        if (project.id === 'citizendesk-bd') onSelectProjectTab('citizendesk');
                        else if (project.id === 'noorai-edge') onSelectProjectTab('ai-lab');
                        else if (project.id === 'code-exchange') onSelectProjectTab('vpn-studio');
                        else if (project.id === 'live-broadcast-studio') onSelectProjectTab('live-studio');
                        else if (project.id === 'audio-engine-30s') onSelectProjectTab('30s-audio-engine');
                        else onSelectProjectTab('zero-cost-video-creator');
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300 group-hover:translate-x-1 transition-all cursor-pointer"
                    >
                      <span>অ্যাপে দেখুন</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
