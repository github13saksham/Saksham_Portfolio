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

const defaultSkills: Skill[] = [
  { id: 's1', category: 'Languages', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: '#3776AB' },
  { id: 's2', category: 'Languages', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: '#F7DF1E' },
  { id: 's3', category: 'Languages', name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', color: '#A8B9CC' },
  { id: 's4', category: 'Languages', name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', color: '#4479A1' },
  
  { id: 's5', category: 'ML / AI', name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', color: '#FF6F00' },
  { id: 's6', category: 'ML / AI', name: 'Keras', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg', color: '#3b82f6' },
  { id: 's7', category: 'ML / AI', name: 'scikit-learn', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg', color: '#F7931E' },
  { id: 's8', category: 'ML / AI', name: 'OpenCV', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg', color: '#5C3EE8' },
  { id: 's9', category: 'ML / AI', name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', color: '#150458' },
  { id: 's10a1', category: 'Frontend', name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', color: '#E34F26' },
  { id: 's10a2', category: 'Frontend', name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', color: '#1572B6' },
  { id: 's11', category: 'Frontend', name: 'React.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', color: '#61DAFB' },
  { id: 's12', category: 'Frontend', name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', color: '#FFFFFF' },

  { id: 's13', category: 'Backend', name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', color: '#339933' },
  { id: 's14', category: 'Backend', name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', color: '#FFFFFF' },

  { id: 's15', category: 'Databases', name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', color: '#47A248' },
  { id: 's16', category: 'Databases', name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', color: '#4169E1' },
  { id: 's17', category: 'Databases', name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', color: '#4479A1' },
  { id: 's18', category: 'Databases', name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg', color: '#FFCA28' },

  { id: 's19', category: 'Tools & DevOps', name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', color: '#F05032' },
  { id: 's20', category: 'Tools & DevOps', name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', color: '#FFFFFF' },
  { id: 's21', category: 'Tools & DevOps', name: 'Postman', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg', color: '#FF6C37' },
  { id: 's22', category: 'Tools & DevOps', name: 'Jupyter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg', color: '#F37626' }
];

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
  const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 130 : 220;

  const x = useTransform(rotation, (rot) => Math.sin(baseAngle + rot * (Math.PI / 180)) * radius);
  const z = useTransform(rotation, (rot) => Math.cos(baseAngle + rot * (Math.PI / 180)) * radius);

  const scale = useTransform(z, [-radius, radius], [0.6, 1.25]);
  const opacity = useTransform(z, [-radius, radius], [0.25, 1]);
  const zIndex = useTransform(z, [-radius, radius], [0, 50], { clamp: true });
  const zIndexInt = useTransform(zIndex, v => Math.round(v));

  return (
    <motion.div
      style={{
        x,
        y: 0,
        scale,
        opacity,
        zIndex: zIndexInt,
        position: 'absolute'
      }}
      className="flex flex-col items-center justify-center w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-[#111111]/90 backdrop-blur-md border border-white/20 group shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/60 hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] transition-colors pointer-events-auto cursor-pointer"
    >
      {skill.icon ? (
        <img
          src={skill.icon}
          alt={skill.name}
          className={`w-6 h-6 lg:w-8 lg:h-8 drop-shadow-md pointer-events-none select-none ${
            ['express', 'github'].some(k => skill.name.toLowerCase().includes(k)) ? 'brightness-0 invert' : ''
          }`}
          loading="lazy"
        />
      ) : (
        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg pointer-events-none select-none" style={{ background: skill.color || '#3b82f6' }} />
      )}

      {/* Tooltip for skill name on hover */}
      <span className="absolute -top-8 bg-black/90 text-white text-[10px] font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 shadow-lg">
        {skill.name}
      </span>

      {isAdmin && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(skill.id); }}
          className="absolute -top-2 -right-2 p-1.5 bg-blue-500/80 hover:bg-blue-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50 pointer-events-auto"
          title="Delete Skill"
        >
          <Trash2Icon size={14} />
        </button>
      )}
    </motion.div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<Skill>>({ category: "Languages", color: "#61DAFB" });
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  const rotation = useMotionValue(0);
  const isDragging = useRef(false);

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
      });
  }, []);

  useAnimationFrame((_time, delta) => {
    if (!isDragging.current) {
      rotation.set(rotation.get() - delta * 0.025);
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
    <section id="skills-3d" className="py-20 md:py-28 relative overflow-hidden bg-black">
      <div className="absolute top-1/3 left-0 w-[50vw] h-[50vw] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10 w-full flex flex-col items-start min-h-[600px]">

        {/* Section Header ABOVE Hand: Single Line Title with Proper Word Spacing & Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-30 pointer-events-auto w-full text-left mb-6 md:mb-10"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-nura font-medium mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 leading-tight drop-shadow-2xl whitespace-nowrap flex flex-wrap items-center gap-x-3 sm:gap-x-4">
            <span>DESIGNING</span>
            <span>WITH</span>
            <span>CLARITY</span>
          </h2>
          <p className="text-gray-400 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed font-geist">
            My technical arsenal mapped out in a 3D cybernetic space. Drag the tech stack to explore the tools I use to turn ideas into reality.
          </p>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide shadow-lg backdrop-blur-md text-sm font-geist"
            >
              <PlusIcon size={18} /> Add New Skill
            </button>
          )}
        </motion.div>

        {/* Interactive Cybernetic Hand & 3D Revolving Tech Stack Container */}
        <div className="relative w-full min-h-[450px] md:min-h-[500px] flex items-center justify-center">

          {/* Cybernetic Hand Image Background (Restored Original Position) */}
          <motion.img
            src="/hand.png"
            alt="Cybernetic Hand"
            className="absolute bottom-[-5%] md:bottom-[-67%] left-[-20%] md:left-[-10%] lg:left-[-10%] w-[140%] md:w-[100%] lg:w-[105%] max-w-[85%] drop-shadow-[0_-20px_50px_rgba(255,255,255,0.05)] pointer-events-none select-none z-0 opacity-100"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* 3D Carousel Drag Area */}
          <motion.div
            className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing flex items-end md:items-center justify-center touch-none pb-32 md:pb-0"
            onPanStart={() => (isDragging.current = true)}
            onPanEnd={() => (isDragging.current = false)}
            onPan={(_e, info) => {
              rotation.set(rotation.get() + info.delta.x * 0.5);
            }}
          >
            {/* Carousel Container */}
            <div className="relative w-full h-[200px] md:h-full flex items-center justify-center lg:ml-[25%]">
              {skills.map((skill, i) => (
                <TechIcon
                  key={skill.id || `sk-${i}`}
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

        </div>

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
                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
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
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. Next.js" onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Icon URL (Devicon CDN)</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="https://cdn.jsdelivr.net/..." onChange={e => setNewItem({ ...newItem, icon: e.target.value })} />
                  <p className="text-[10px] text-gray-500 mt-1">Leave blank for colored pill fallback.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Color (Hex)</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. #61DAFB" value={newItem.color} onChange={e => setNewItem({ ...newItem, color: e.target.value })} />
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
