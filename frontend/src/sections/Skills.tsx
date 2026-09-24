import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { PlusIcon, XIcon, Trash2Icon } from 'lucide-react';
import { API_BASE } from '../config';

interface Skill {
  id: string;
  category: string;
  name: string;
  icon: string; // devicon CDN URL
  color: string; // accent color for hover glow
}

const TechIcon = ({ 
  skill, 
  index, 
  total, 
  rotation, 
  isAdmin, 
  onDelete 
}: { 
  skill: Skill, 
  index: number, 
  total: number, 
  rotation: MotionValue<number>,
  isAdmin: boolean,
  onDelete: (id: string) => void
}) => {
  const baseAngle = (index / total) * Math.PI * 2;
  const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 120 : 200; 

  const x = useTransform(rotation, (rot) => Math.sin(baseAngle + rot * (Math.PI / 180)) * radius);
  const z = useTransform(rotation, (rot) => Math.cos(baseAngle + rot * (Math.PI / 180)) * radius);
  
  const scale = useTransform(z, [-radius, radius], [0.5, 1.2]);
  const opacity = useTransform(z, [-radius, radius], [0.15, 1]);
  const zIndex = useTransform(z, [-radius, radius], [0, 50], { clamp: true });
  const zIndexInt = useTransform(zIndex, v => Math.round(v));

  return (
    <motion.div
      style={{
        x,
        y: 0, // Perfectly equal in line
        scale,
        opacity,
        zIndex: zIndexInt,
        position: 'absolute'
      }}
      className="flex flex-col items-center justify-center w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-[#111111]/80 backdrop-blur-md border border-white/10 group shadow-[0_0_30px_rgba(230,0,0,0.1)] hover:border-primary-main/50 hover:shadow-[0_0_30px_rgba(230,0,0,0.4)] transition-colors pointer-events-auto cursor-pointer"
    >
      {skill.icon ? (
        <img src={skill.icon} alt={skill.name} className="w-6 h-6 lg:w-8 lg:h-8 drop-shadow-md pointer-events-none select-none" loading="lazy" />
      ) : (
        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg pointer-events-none select-none" style={{ background: skill.color }} />
      )}
      
      {/* Tooltip for skill name on hover to keep it clean */}
      <span className="absolute -top-8 bg-black/90 text-white text-[10px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
        {skill.name}
      </span>

      {isAdmin && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(skill.id); }}
            className="absolute -top-2 -right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50 pointer-events-auto"
            title="Delete Skill"
          >
            <Trash2Icon size={14} />
          </button>
      )}
    </motion.div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Skill>>({ category: "Languages", color: "#61DAFB" });
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  const rotation = useMotionValue(0);
  const isDragging = useRef(false);

  useEffect(() => {
    fetch(`${API_BASE}/skills`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch(err => console.error("Error fetching skills:", err));
  }, []);

  useAnimationFrame((_time, delta) => {
    if (!isDragging.current) {
      rotation.set(rotation.get() - delta * 0.02); // Slow continuous rotation
    }
  });

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

  const handleDelete = async (id: string) => {
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

  return (
    <section id="skills-3d" className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-[50vw] h-[50vw] bg-white/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10 flex items-center min-h-[400px] md:min-h-[500px] w-full">
        
        {/* Cybernetic Hand Image Background (Positioned behind text) */}
        <motion.img 
          src="/hand.png" 
          alt="Cybernetic Hand"
          className="absolute bottom-[-10%] md:bottom-[-67%] left-[-10%] md:left-[-10%] lg:left-[-10%] w-[120%] md:w-[100%] lg:w-[105%] max-w-[80%] drop-shadow-[0_-20px_50px_rgba(255,255,255,0.05)] pointer-events-none select-none z-0 opacity-100"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* 3D Carousel Drag Area (Full Screen Overlay) */}
        <motion.div 
          className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing flex items-center justify-center touch-none"
          onPanStart={() => (isDragging.current = true)}
          onPanEnd={() => (isDragging.current = false)}
          onPan={(_e, info) => {
            rotation.set(rotation.get() + info.delta.x * 0.5);
          }}
        >
          {/* Carousel Container */}
          <div className="relative w-full h-full flex items-center justify-center mt-10 lg:ml-[25%]">
            {skills.map((skill, i) => (
                <TechIcon 
                  key={skill.id} 
                  skill={skill} 
                  index={i} 
                  total={skills.length} 
                  rotation={rotation} 
                  isAdmin={isAdmin} 
                  onDelete={handleDelete} 
                />
            ))}
          </div>
        </motion.div>

        {/* Left Section: Title (Positioned Above Hand) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative z-30 pointer-events-auto w-full max-w-xl text-left"
        >
          <h2 className="text-5xl md:text-7xl font-nura font-medium mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tighter leading-tight drop-shadow-2xl">
            DESIGNING <br /> WITH <br /> CLARITY
          </h2>
          <p className="text-gray-300 max-w-sm text-base md:text-lg mb-8 leading-relaxed font-medium bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            My technical arsenal mapped out in a 3D cybernetic space. Drag the tech stack to explore the tools I use to turn ideas into reality.
          </p>

          {isAdmin && (
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide shadow-lg backdrop-blur-md"
            >
              <PlusIcon size={18} /> Add New Skill
            </button>
          )}
        </motion.div>

      </div>

      {/* Admin Modal */}
      <AnimatePresence>
        {showModal && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg relative"
                >
                    <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                        <XIcon size={24} />
                    </button>
                    <h3 className="text-2xl font-bold text-white mb-6">Add New Skill</h3>
                    
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
                            <p className="text-[10px] text-gray-500 mt-1">Leave blank for no icon.</p>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Color (Hex)</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. #61DAFB" value={newItem.color} onChange={e => setNewItem({...newItem, color: e.target.value})} />
                        </div>
                        
                        <button onClick={handleSave} className="w-full py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-colors mt-4">
                            Save Skill
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;
