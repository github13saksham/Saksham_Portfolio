import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../config';
import { SparklesIcon, PlusIcon, XIcon, Trash2Icon, FilterIcon, ChevronDownIcon } from 'lucide-react';

interface Skill {
  id: string;
  category: string;
  name: string;
  icon: string;
  color: string;
}

const defaultSkills: Skill[] = [
  { id: 's1', category: 'Languages', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#3776AB' },
  { id: 's2', category: 'Languages', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: '#F7DF1E' },
  { id: 's3', category: 'Languages', name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', color: '#4479A1' },
  { id: 's4', category: 'Languages', name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', color: '#A8B9CC' },

  { id: 's5', category: 'ML / AI', name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', color: '#FF6F00' },
  { id: 's6', category: 'ML / AI', name: 'Keras', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg', color: '#3b82f6' },
  { id: 's7', category: 'ML / AI', name: 'scikit-learn', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg', color: '#F7931E' },
  { id: 's8', category: 'ML / AI', name: 'OpenCV', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg', color: '#5C3EE8' },
  { id: 's9', category: 'ML / AI', name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', color: '#150458' },
  { id: 's10', category: 'ML / AI', name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg', color: '#013243' },
  { id: 's11', category: 'ML / AI', name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', color: '#EE4C2C' },

  { id: 's12a1', category: 'Frontend', name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', color: '#E34F26' },
  { id: 's12a2', category: 'Frontend', name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', color: '#1572B6' },
  { id: 's12', category: 'Frontend', name: 'React.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
  { id: 's12b', category: 'Frontend', name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', color: '#FFFFFF' },

  { id: 's13', category: 'Backend', name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
  { id: 's14', category: 'Backend', name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', color: '#FFFFFF' },
  { id: 's15', category: 'Backend', name: 'REST APIs', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', color: '#0096D6' },

  { id: 's16', category: 'Databases', name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: '#47A248' },
  { id: 's17', category: 'Databases', name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', color: '#FFCA28' },
  { id: 's18', category: 'Databases', name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', color: '#4169E1' },
  { id: 's19', category: 'Databases', name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', color: '#4479A1' },

  { id: 's20', category: 'Tools & DevOps', name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', color: '#F05032' },
  { id: 's21', category: 'Tools & DevOps', name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', color: '#FFFFFF' },
  { id: 's22', category: 'Tools & DevOps', name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg', color: '#FF6C37' },
  { id: 's23', category: 'Tools & DevOps', name: 'Jupyter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg', color: '#F37626' },
  { id: 's24', category: 'Tools & DevOps', name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', color: '#FF9900' },
  { id: 's25', category: 'Tools & DevOps', name: 'Cashfree', icon: '', color: '#2563EB' }
];

const DetailedSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Skill>>({ category: "Languages", color: "#61DAFB" });
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_BASE}/skills`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
        } else {
          setSkills(defaultSkills);
        }
      })
      .catch(err => {
        console.error("Error fetching skills:", err);
        setSkills(defaultSkills);
      })
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = async () => {
    if (!newItem.name || !newItem.category) return;
    try {
      const response = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          category: newItem.category,
          name: newItem.name,
          icon: newItem.icon || '',
          color: newItem.color || '#3b82f6'
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setSkills(prev => [...prev, result]);
      }
    } catch (err) {
      console.error("Error saving skill:", err);
    }
    setShowModal(false);
    setNewItem({ category: "Languages", color: "#61DAFB" });
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this skill?')) return;
    setSkills(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`${API_BASE}/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
    } catch (err) {
      console.error('Error deleting skill:', err);
    }
  };

  // Categories ordering
  const categoriesOrder = ['Languages', 'ML / AI', 'Frontend', 'Backend', 'Databases', 'Tools & DevOps', 'Soft Skills'];
  const categoriesPresent = Array.from(new Set(skills.map(s => s.category)));
  const sortedCategories = [
    ...categoriesOrder.filter(c => categoriesPresent.includes(c)),
    ...categoriesPresent.filter(c => !categoriesOrder.includes(c))
  ];

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="py-20 md:py-28 relative overflow-hidden bg-black">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-medium font-nura tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
              Technical Expertise
            </h2>
            <p className="text-gray-400 max-w-xl text-base md:text-lg mt-3 font-geist">
              Hover over any icon to explore technologies, frameworks, databases, and tools.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold text-sm"
            >
              <PlusIcon size={16} /> Add Skill
            </button>
          )}
        </motion.div>

        {/* "All Categories" Dropdown Filter Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 relative z-30"
          ref={dropdownRef}
        >
          <div className="relative inline-block text-left">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white font-medium text-sm hover:bg-white/20 hover:border-blue-400/50 transition-all backdrop-blur-md shadow-xl font-geist"
            >
              <FilterIcon size={16} className="text-blue-400" />
              <span>
                Filter: <strong className="text-blue-400 font-semibold">{activeCategory === 'All' ? 'All Categories' : activeCategory}</strong>
              </span>
              <ChevronDownIcon size={16} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180 text-blue-400' : 'text-gray-400'}`} />
            </button>

            {/* Dropdown Options List */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-64 rounded-2xl bg-[#121212]/95 border border-white/15 shadow-2xl backdrop-blur-xl py-2 z-50 overflow-hidden font-geist"
                >
                  <button
                    onClick={() => { setActiveCategory('All'); setDropdownOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${activeCategory === 'All'
                        ? 'bg-blue-600/20 text-blue-400 font-semibold border-l-2 border-blue-500'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <span>All Categories</span>
                    <span className="text-xs text-gray-400 font-mono">({skills.length})</span>
                  </button>

                  <div className="h-[1px] bg-white/10 my-1" />

                  {sortedCategories.map(cat => {
                    const count = skills.filter(s => s.category === cat).length;
                    const isSelected = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setDropdownOpen(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${isSelected
                            ? 'bg-blue-600/20 text-blue-400 font-semibold border-l-2 border-blue-500'
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                      >
                        <span>{cat}</span>
                        <span className="text-xs text-gray-400 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Clean 3D Floating Icons Grid (No Card Boxes, Names on Hover Tooltip) */}
        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-700 border-t-blue-400 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div layout className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8 md:gap-10 py-6 min-h-[200px]">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, idx) => (
                <motion.div
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25, delay: idx * 0.015 }}
                  whileHover={{ y: -8, scale: 1.25 }}
                  className="group relative flex items-center justify-center p-3 cursor-pointer select-none"
                >
                  {/* Hover Tooltip displaying Tech Name */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-black/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-white/15 shadow-2xl z-40 font-geist">
                    {skill.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90" />
                  </div>

                  {/* Clean 3D Floating Icon (No card boxes) */}
                  {skill.icon ? (
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.75)] transition-all duration-300 ${['express', 'github'].some(k => skill.name.toLowerCase().includes(k)) ? 'brightness-0 invert' : ''
                        }`}
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-xl group-hover:shadow-[0_0_25px_rgba(59,130,246,0.75)] transition-all duration-300 border border-white/20"
                      style={{ backgroundColor: skill.color || '#3b82f6' }}
                    >
                      {skill.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  {/* Admin Delete button on hover */}
                  {isAdmin && (
                    <button
                      onClick={(e) => handleDelete(e, skill.id)}
                      className="absolute -top-2 -right-2 p-1.5 rounded-full bg-blue-600 text-white shadow-md hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100 z-50"
                      title="Delete skill"
                    >
                      <Trash2Icon size={12} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Admin Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
              <XIcon size={24} />
            </button>
            <h3 className="text-2xl font-bold text-white mb-6">Add Skill to Stack</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                  value={newItem.category}
                  onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                >
                  <option value="Languages">Languages</option>
                  <option value="ML / AI">ML / AI</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Databases">Databases</option>
                  <option value="Tools & DevOps">Tools & DevOps</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Skill Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Next.js" onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Icon URL (Devicon CDN)</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="https://cdn.jsdelivr.net/..." onChange={e => setNewItem({ ...newItem, icon: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Color (Hex)</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="#61DAFB" value={newItem.color} onChange={e => setNewItem({ ...newItem, color: e.target.value })} />
              </div>

              <button onClick={handleSave} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-4">
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DetailedSkills;
