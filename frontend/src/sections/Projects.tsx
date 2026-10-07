import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon, ExternalLinkIcon, PlusIcon, XIcon, Trash2Icon, FolderGit2Icon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { API_BASE } from '../config';

interface Repo {
  id: string; // Database uuid
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  tablet_image?: string;
  mobile_image?: string;
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

const defaultProjects: Repo[] = [
  {
    id: "proj-1",
    name: "Leveraging AI for Precise Cost Estimation",
    description: "Built a model to predict software project costs with higher accuracy than traditional methods. Added a predictive analytics dashboard. Published Research, ICSDS-2025.",
    html_url: "#",
    language: "Python",
    stargazers_count: 12,
    forks_count: 3
  },
  {
    id: "proj-2",
    name: "The Futbol Store",
    description: "Independently designed and shipped a live e-commerce platform for premium and retro football jerseys, covering storefront, cart, and checkout with Cashfree integration.",
    html_url: "https://thefutbolstore.in",
    language: "TypeScript",
    stargazers_count: 18,
    forks_count: 4,
    tablet_image: "/previews/futbolstore_tablet.png",
    mobile_image: "/previews/futbolstore_mobile.png"
  },
  {
    id: "proj-3",
    name: "Facial Recognition System",
    description: "Trained a face recognition model integrating machine learning and deep learning algorithms. Built a MySQL-backed pipeline with Tkinter UI.",
    html_url: "#",
    language: "Python",
    stargazers_count: 24,
    forks_count: 5
  },
  {
    id: "proj-4",
    name: "Emotion Detection from Facial Images",
    description: "Built and evaluated a CNN for emotion classification from facial images. Covered data preprocessing, train/validation/test splitting, and evaluation.",
    html_url: "#",
    language: "Jupyter",
    stargazers_count: 15,
    forks_count: 2
  }
];

const Projects = () => {
  const [projects, setProjects] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [activeFrame, setActiveFrame] = useState<'tablet' | 'mobile'>('tablet');

  // Admin controls
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Repo>>({});
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  useEffect(() => {
    fetch(`${API_BASE}/projects`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(defaultProjects);
        }
      })
      .catch(err => {
        console.error(err);
        setProjects(defaultProjects);
      })
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
    if (activeIdx >= projects.length - 1 && activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
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

  const activeProject = filteredProjects[activeIdx] || filteredProjects[0] || defaultProjects[0];

  const hasValidUrl = activeProject.html_url && activeProject.html_url !== '#' && activeProject.html_url.startsWith('http');

  return (
    <section id="projects" className="py-20 md:py-28 relative overflow-hidden bg-black">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[800px] h-[80vw] max-h-[800px] rounded-full blur-[160px] opacity-10 pointer-events-none z-0 bg-blue-600" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-14 text-left"
        >
          <h2 className="text-4xl md:text-6xl font-medium font-nura tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            Featured Projects
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg mb-8 font-geist">
            A showcase of open source repositories, full-stack web platforms, and machine learning models I've engineered.
          </p>

          <div className="flex flex-wrap justify-between items-center gap-4">
            {/* Language filter tabs */}
            <div className="flex flex-wrap gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => { setFilter(lang); setActiveIdx(0); }}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border font-geist cursor-pointer ${
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

            {isAdmin && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide text-xs md:text-sm font-geist cursor-pointer"
              >
                <PlusIcon size={16} /> Add Project
              </button>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className="w-full flex justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-blue-400 rounded-full animate-spin" />
              <p className="text-gray-400 font-mono text-sm animate-pulse">Loading repositories...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-geist">No projects found for this category.</div>
        ) : (
          <div className="flex flex-col items-center w-full">

            {/* 1. TOP DISPLAY: Tablet & Phone Device Mockups Kept Together */}
            <div className="relative w-full max-w-5xl mx-auto mb-10 flex items-center justify-center pt-4 pb-2 px-2 sm:px-4">
              <div className="relative flex items-end justify-center w-full max-w-5xl">

                {/* Latest iPad Pro (M4) Device Frame */}
                <motion.div
                  key={`tab-${activeProject.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setActiveFrame('tablet')}
                  className={`relative w-[90%] sm:w-full max-w-3xl bg-[#0f0f13] rounded-[28px] sm:rounded-[36px] p-2.5 sm:p-3 border-2 border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden cursor-pointer transition-all duration-300 ${activeFrame === 'tablet' ? 'z-30 scale-[1.02] shadow-blue-500/20' : 'z-10 scale-[0.98] opacity-80'}`}
                >
                  {/* iPad Screen Glass View - Clean Preview Screenshot Image or Project Mockup */}
                  <div className="relative h-[250px] sm:h-[400px] md:h-[480px] w-full bg-black rounded-[20px] sm:rounded-[28px] overflow-hidden border border-white/10 shadow-inner">
                    {activeProject.tablet_image || hasValidUrl ? (
                      <img
                        src={activeProject.tablet_image || `https://image.thum.io/get/width/1200/crop/800/${activeProject.html_url}`}
                        alt={`${activeProject.name} iPad Pro Preview`}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="relative w-full h-full p-6 sm:p-10 flex flex-col justify-between bg-[#09090c]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-black to-black opacity-90" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div className="flex justify-between items-start">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 border border-blue-400/30 text-blue-300 font-geist">
                              {activeProject.language || "TypeScript"}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400 font-mono uppercase tracking-wider">iPad Pro</span>
                          </div>

                          <div className="my-auto max-w-md text-left">
                            <h4 className="text-xl sm:text-3xl font-bold text-white mb-2 font-nura tracking-tight leading-tight">
                              {activeProject.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 font-geist">
                              {activeProject.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <div className="h-2 w-24 bg-blue-500/60 rounded-full animate-pulse" />
                            <div className="h-2 w-14 bg-white/20 rounded-full" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Latest iPhone 15 Pro Device Frame - Overlapping Bottom Right */}
                <motion.div
                  key={`phone-${activeProject.id}`}
                  initial={{ opacity: 0, x: 25, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  onClick={() => setActiveFrame('mobile')}
                  className={`absolute right-0 sm:right-[-20px] md:right-[-30px] bottom-[-15px] sm:bottom-[-25px] w-36 sm:w-52 md:w-60 bg-[#0f0f13] rounded-[36px] sm:rounded-[50px] p-2 sm:p-2.5 border-2 border-white/30 shadow-[0_35px_100px_rgba(0,0,0,0.95)] overflow-hidden ring-1 ring-white/10 cursor-pointer transition-all duration-300 ${activeFrame === 'mobile' ? 'z-40 scale-105 shadow-blue-500/30' : 'z-20 scale-95 opacity-90'}`}
                >
                  {/* iPhone Screen Glass View - Clean Preview Screenshot Image or Project Mockup */}
                  <div className="relative h-[280px] sm:h-[420px] md:h-[480px] w-full bg-black rounded-[28px] sm:rounded-[42px] overflow-hidden border border-white/10 shadow-inner">
                    
                    {/* iPhone 15 Pro Dynamic Island */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 sm:w-20 h-3.5 sm:h-4 bg-black rounded-full border border-white/15 z-30 pointer-events-none flex items-center justify-between px-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-ping" />
                      <span className="w-1.5 h-1.5 rounded-full bg-black border border-white/20" />
                    </div>

                    {activeProject.mobile_image || hasValidUrl ? (
                      <img
                        src={activeProject.mobile_image || `https://image.thum.io/get/width/400/crop/800/iphoneX/${activeProject.html_url}`}
                        alt={`${activeProject.name} iPhone 15 Pro Preview`}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="relative w-full h-full p-4 pt-10 flex flex-col justify-between bg-[#09090c]">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/30 via-black to-black opacity-95" />
                        <div className="relative z-10 flex flex-col h-full justify-between">
                          <div className="flex justify-between items-center text-[8px] sm:text-[9px] text-gray-400 font-mono">
                            <span>iPhone 15</span>
                            <span className="text-blue-400 font-bold">5G</span>
                          </div>

                          <div className="my-auto text-center px-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 border border-blue-400/40 mx-auto mb-2.5 flex items-center justify-center text-blue-400 shadow-lg">
                              <FolderGit2Icon size={16} />
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
                              {activeProject.name}
                            </p>
                            <p className="text-[8px] sm:text-[9px] text-gray-400 mt-1 uppercase tracking-wider font-mono">iPhone 15 Pro</p>
                          </div>

                          <div className="w-full bg-blue-600/80 py-1.5 rounded-xl text-[9px] sm:text-[10px] font-bold text-white text-center shadow-md font-geist">
                            Project Preview
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

              </div>
            </div>

            {/* 2. MIDDLE DISPLAY: Small Carousel of Projects */}
            <div className="w-full max-w-4xl mx-auto mb-8 relative px-2">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-geist">
                  Select Project ({activeIdx + 1} of {filteredProjects.length})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newIdx = (activeIdx - 1 + filteredProjects.length) % filteredProjects.length;
                      setActiveIdx(newIdx);
                    }}
                    className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                    title="Previous Project"
                  >
                    <ChevronLeftIcon size={16} />
                  </button>
                  <button
                    onClick={() => {
                      const newIdx = (activeIdx + 1) % filteredProjects.length;
                      setActiveIdx(newIdx);
                    }}
                    className="p-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                    title="Next Project"
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
              </div>

              {/* Project Selector Tabs Strip - Clean Grid Layout without Scrollbars or Cut-offs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full py-2 px-1 overflow-x-auto sm:overflow-visible [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {filteredProjects.map((proj, idx) => {
                  const isSelected = activeIdx === idx;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => setActiveIdx(idx)}
                      className={`w-full px-3.5 sm:px-4 py-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer min-w-0 font-geist ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-[1.02]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400">0{idx + 1}</span>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: langColors[proj.language] || '#3b82f6' }} />
                      </div>
                      <h5 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                        {proj.name}
                      </h5>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. BOTTOM DISPLAY: Project Name & Description Under It */}
            <motion.div
              key={`details-${activeProject.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl mx-auto text-left pt-2 pb-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-nura text-white tracking-tight leading-tight mb-2">
                    {activeProject.name}
                  </h3>
                  {activeProject.language && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/15 text-blue-400 font-geist">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langColors[activeProject.language] || '#3b82f6' }} />
                      {activeProject.language}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {activeProject.html_url !== '#' && (
                    <a
                      href={activeProject.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] font-geist"
                    >
                      <ExternalLinkIcon size={16} />
                      <span>Live App / Demo</span>
                    </a>
                  )}
                  <a
                    href={activeProject.html_url !== '#' ? activeProject.html_url : `https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'github13saksham'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs sm:text-sm font-medium transition-all font-geist"
                  >
                    <GithubIcon size={16} />
                    <span>Code Repo</span>
                  </a>
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDelete(e, activeProject.id)}
                      className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Project"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Description under Project Name */}
              <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed font-geist text-justify mt-4">
                {activeProject.description}
              </p>
            </motion.div>

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
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-300 font-bold text-sm font-geist shadow-lg border-2 border-transparent hover:border-blue-500"
          >
            <GithubIcon size={20} />
            Explore All Repositories on GitHub
            <ExternalLinkIcon size={14} className="opacity-70 group-hover:opacity-100" />
          </a>
        </motion.div>

      </div>

      {/* Admin Add Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg relative text-left font-geist">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                <XIcon size={24} />
              </button>
              <h3 className="text-2xl font-bold text-white mb-6">Add New Project</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Project Name</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. My Next.js App" onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 h-24" placeholder="Brief project summary..." onChange={e => setNewItem({ ...newItem, description: e.target.value })}></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">GitHub / Demo URL</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="https://github.com/..." onChange={e => setNewItem({ ...newItem, html_url: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Language / Stack</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. TypeScript" onChange={e => setNewItem({ ...newItem, language: e.target.value })} />
                </div>

                <button onClick={handleSave} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors mt-4">
                  Save Project
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
