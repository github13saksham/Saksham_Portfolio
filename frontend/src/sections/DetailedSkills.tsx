import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE } from '../config';
import { Code2Icon, LayoutIcon, ServerIcon, DatabaseIcon, WrenchIcon, SparklesIcon, PlusIcon, XIcon, Trash2Icon } from 'lucide-react';

interface Skill {
  id: string;
  category: string;
  name: string;
  icon: string;
  color: string;
}

const categoryIcons: Record<string, any> = {
  'Languages': Code2Icon,
  'Frontend': LayoutIcon,
  'Backend': ServerIcon,
  'Databases': DatabaseIcon,
  'Tools & DevOps': WrenchIcon,
  'Soft Skills': SparklesIcon,
};

const DetailedSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Skill>>({ category: "Languages", color: "#61DAFB" });
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  useEffect(() => {
    fetch(`${API_BASE}/skills`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch(err => console.error("Error fetching skills:", err))
      .finally(() => setLoading(false));
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
          color: newItem.color || '#888888'
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

  // Group skills by category
  const categoriesOrder = ['Languages', 'Frontend', 'Backend', 'Databases', 'Tools & DevOps', 'Soft Skills'];
  
  const categoriesPresent = Array.from(new Set(skills.map(s => s.category)));
  const sortedCategories = [
    ...categoriesOrder.filter(c => categoriesPresent.includes(c)),
    ...categoriesPresent.filter(c => !categoriesOrder.includes(c))
  ];

  const filteredCategories = activeCategory === 'All' 
    ? sortedCategories 
    : sortedCategories.filter(c => c === activeCategory);

  return (
    <section id="skills" className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-black via-[#080808] to-black">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-primary-main/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-light text-xs font-semibold uppercase tracking-widest mb-4">
              <SparklesIcon size={14} className="text-primary-light" /> Comprehensive Tech Stack
            </div>
            <h2 className="text-4xl md:text-6xl font-medium font-nura tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
              Technical Expertise
            </h2>
            <p className="text-gray-400 max-w-xl text-base md:text-lg mt-3">
              A structured breakdown of technologies, frameworks, databases, and tools I leverage to build robust digital solutions.
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

        {/* Category Filter Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2.5 mb-12"
        >
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
              activeCategory === 'All'
                ? 'bg-white text-black border-white shadow-lg shadow-white/10 font-semibold'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Categories ({skills.length})
          </button>
          {sortedCategories.map(cat => {
            const count = skills.filter(s => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-white text-black border-white shadow-lg shadow-white/10 font-semibold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </motion.div>

        {/* Skills Cards Grid */}
        {loading ? (
          <div className="w-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary-dark border-t-primary-light rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat, catIdx) => {
              const CategoryIcon = categoryIcons[cat] || Code2Icon;
              const catSkills = skills.filter(s => s.category === cat);

              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                  className="rounded-3xl bg-[#0c0c0c] border border-white/10 p-6 md:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-500 shadow-xl group relative overflow-hidden"
                >
                  {/* Subtle top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-main/40 to-transparent group-hover:via-primary-main opacity-60 transition-all duration-500" />
                  
                  <div>
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:border-primary-main/40 group-hover:bg-primary-main/10 transition-colors">
                          <CategoryIcon size={20} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white tracking-tight">{cat}</h3>
                          <span className="text-xs text-gray-400 font-mono">{catSkills.length} Technologies</span>
                        </div>
                      </div>
                    </div>

                    {/* Skill Pills Grid */}
                    <div className="flex flex-wrap gap-2.5">
                      {catSkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          whileHover={{ scale: 1.04, y: -2 }}
                          className="relative group/item flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300"
                        >
                          {skill.icon ? (
                            <img src={skill.icon} alt={skill.name} className="w-5 h-5 object-contain flex-shrink-0" loading="lazy" />
                          ) : (
                            <span 
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: skill.color || '#e60000' }}
                            />
                          )}
                          <span className="text-sm font-medium text-gray-200 group-hover/item:text-white">
                            {skill.name}
                          </span>

                          {isAdmin && (
                            <button
                              onClick={(e) => handleDelete(e, skill.id)}
                              className="ml-1 text-gray-500 hover:text-red-400 transition-colors"
                              title="Delete skill"
                            >
                              <Trash2Icon size={12} />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" 
                  value={newItem.category} 
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  <option value="Languages">Languages</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Databases">Databases</option>
                  <option value="Tools & DevOps">Tools & DevOps</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Skill Name</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. Next.js" onChange={e => setNewItem({...newItem, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Icon URL (Devicon CDN)</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="https://cdn.jsdelivr.net/..." onChange={e => setNewItem({...newItem, icon: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Color (Hex)</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="#61DAFB" value={newItem.color} onChange={e => setNewItem({...newItem, color: e.target.value})} />
              </div>
              
              <button onClick={handleSave} className="w-full py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-colors mt-4">
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
