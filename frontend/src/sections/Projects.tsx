import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon, ExternalLinkIcon, StarIcon, GitForkIcon, PlusIcon, XIcon, Trash2Icon, FolderGit2Icon, LayoutGridIcon, ColumnsIcon } from 'lucide-react';
import { API_BASE } from '../config';

interface Repo {
  id: string; // Database uuid
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

// Language color mapping
const langColors: Record<string, string> = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Java: '#ED8B00',
  'C++': '#00599C',
  C: '#A8B9CC',
  PHP: '#777BB4',
  Ruby: '#CC342D',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Swift: '#FA7343',
  Kotlin: '#7F52FF',
  Dart: '#0175C2',
  Shell: '#89E051',
  Jupyter: '#F37626',
};

const Projects = () => {
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'featured'>('grid');
  
  // Admin controls
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Repo>>({});
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.warn("API error", data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!newItem.name || !newItem.html_url) return;
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
           name: newItem.name,
           description: newItem.description || "No description provided.",
           html_url: newItem.html_url,
           language: newItem.language || "Other",
           stargazers_count: newItem.stargazers_count || 0,
           forks_count: newItem.forks_count || 0
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setProjects(prev => [...prev, result]);
      }
    } catch (err) {
       console.error("Error saving project:", err);
    }
    setShowModal(false);
    setNewItem({});
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    setProjects(prev => prev.filter(p => p.id !== id));
    try {
      await fetch(`${API_BASE}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  // Get unique languages for filter tabs
  const languages = ['All', ...Array.from(new Set(projects.map(p => p.language).filter(Boolean)))];
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.language === filter);

  return (
    <section id="projects" className="py-20 md:py-28 relative overflow-hidden bg-black">
      {/* Background glow effects */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] rounded-full blur-[160px] opacity-15 pointer-events-none z-0 bg-primary-main"
      />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="mb-10 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-light text-xs font-semibold uppercase tracking-widest mb-4">
            <FolderGit2Icon size={14} className="text-primary-light" /> Open Source & Projects
          </div>

          <h2 className="text-4xl md:text-6xl font-medium font-nura tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            Featured Projects
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg mb-8">
            A showcase of open source repositories, tools, and applications I've created and contributed to.
          </p>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Language filter tabs */}
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setFilter(lang)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                    filter === lang 
                      ? 'bg-white text-black border-white shadow-lg shadow-white/10 font-semibold' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {lang !== 'All' && (
                    <span 
                      className="inline-block w-2 h-2 rounded-full mr-1.5"
                      style={{ backgroundColor: langColors[lang] || '#888' }}
                    />
                  )}
                  {lang}
                </button>
              ))}
            </div>

            {/* View Mode & Admin Button */}
            <div className="flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 rounded-full p-1 flex items-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                  title="Grid View"
                >
                  <LayoutGridIcon size={16} />
                </button>
                <button
                  onClick={() => setViewMode('featured')}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === 'featured' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                  title="Large Card View"
                >
                  <ColumnsIcon size={16} />
                </button>
              </div>

              {isAdmin && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide text-xs md:text-sm"
                >
                  <PlusIcon size={16} /> Add Project
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="w-full flex justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary-dark border-t-primary-light rounded-full animate-spin" />
              <p className="text-gray-400 font-mono text-sm animate-pulse">Loading repositories...</p>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-8"}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((repo, idx) => (
                <motion.div
                  key={repo.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group relative rounded-3xl bg-[#0c0c0c] border border-white/10 p-6 md:p-8 flex flex-col justify-between hover:border-primary-main/50 transition-all duration-500 hover:shadow-[0_15px_35px_rgba(230,0,0,0.12)] hover:-translate-y-1 overflow-hidden"
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-main/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Top Header Row */}
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-light group-hover:border-primary-main/40 group-hover:bg-primary-main/10 transition-colors">
                        <FolderGit2Icon size={22} />
                      </div>

                      <div className="flex items-center gap-2">
                        {repo.language && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1.5">
                            <span 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: langColors[repo.language] || '#888' }}
                            />
                            {repo.language}
                          </span>
                        )}

                        {isAdmin && (
                          <button
                            onClick={(e) => handleDelete(e, repo.id)}
                            className="p-1.5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                            title="Delete project"
                          >
                            <Trash2Icon size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Repository Title */}
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="group/title inline-block mb-3"
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover/title:text-primary-light transition-colors tracking-tight flex items-center gap-2">
                        {repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}
                        <ExternalLinkIcon size={16} className="opacity-0 group-hover/title:opacity-100 transition-opacity text-primary-light" />
                      </h3>
                    </a>

                    {/* Description */}
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed line-clamp-3 mb-6">
                      {repo.description || "High-performance repository built with precision."}
                    </p>
                  </div>

                  {/* Bottom Stats & Action Bar */}
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-xs md:text-sm font-medium text-gray-400">
                      <div className="flex items-center gap-1.5 hover:text-white transition-colors" title="Stars">
                        <StarIcon size={16} className="text-yellow-500/80" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-white transition-colors" title="Forks">
                        <GitForkIcon size={16} className="text-gray-400" />
                        <span>{repo.forks_count}</span>
                      </div>
                    </div>

                    <a 
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-white bg-white/10 hover:bg-white hover:text-black px-4 py-2 rounded-full border border-white/10 transition-all duration-300"
                    >
                      <GithubIcon size={15} />
                      Code
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* View all on GitHub */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12 md:mt-16"
        >
          <a 
            href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'github13saksham'}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-primary-main/30 transition-all duration-300 font-medium text-sm"
          >
            <GithubIcon size={20} className="group-hover:rotate-[360deg] transition-transform duration-700" />
            Explore All Repositories on GitHub
            <ExternalLinkIcon size={14} className="opacity-50 group-hover:opacity-100" />
          </a>
        </motion.div>
      </div>

      {/* Admin Add Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                <XIcon size={24} />
              </button>
              <h3 className="text-2xl font-bold text-white mb-6">Add New Project</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Project Name</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" onChange={e => setNewItem({...newItem, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">GitHub URL</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="https://github.com/..." onChange={e => setNewItem({...newItem, html_url: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Language</label>
                    <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. TypeScript" onChange={e => setNewItem({...newItem, language: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Stars</label>
                    <input type="number" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="0" onChange={e => setNewItem({...newItem, stargazers_count: parseInt(e.target.value) || 0})} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main h-24" onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                </div>
                
                <button onClick={handleSave} className="w-full py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-colors mt-4">
                  Save Project
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
