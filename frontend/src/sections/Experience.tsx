import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { BriefcaseIcon, GraduationCapIcon, PlusIcon, XIcon, Trash2Icon } from 'lucide-react';
import { API_BASE } from '../config';

export type ExperienceType = 'job' | 'education';

export interface TimelineItem {
  id: string;
  type: ExperienceType;
  date: string;
  title: string;
  subtitle: string;
  description: string;
}

const defaultTimelineData: TimelineItem[] = [
  {
    id: "job-1",
    type: "job",
    date: "May 2025 – July 2025",
    title: "Frontend Developer Intern",
    subtitle: "Primus Partners Solution Pvt Ltd",
    description: "Worked on the Parivar Pehchan Patra Government portal. Developed secure login systems and scalable family dashboards utilizing React, TailwindCSS, and optimized API integrations. Contributed to improving web vitals and overall UI smoothness."
  },
  {
    id: "edu-1",
    type: "education",
    date: "2023 - Present",
    title: "B.Tech - Computer Science",
    subtitle: "University Institute / College",
    description: "Focusing on full-stack development, AI, and scalable backend architectures. I've been active in programming clubs, open-source organization contributions, and collaborative academic research logic."
  }
];

const Experience = () => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<TimelineItem>>({ type: 'job' });
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    fetch(`${API_BASE}/experience`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setTimelineData(data);
        } else {
          setTimelineData(defaultTimelineData);
        }
      })
      .catch(err => {
        console.error('Error fetching experiences:', err);
        setTimelineData(defaultTimelineData);
      });
  }, []);

  const handleSave = async () => {
    if (!newItem.title || !newItem.subtitle || !newItem.date) return;
    
    // Optimistic offline update
    const finalItem: TimelineItem = {
      id: "exp-" + Date.now(),
      type: newItem.type || 'job',
      title: newItem.title,
      subtitle: newItem.subtitle,
      date: newItem.date,
      description: newItem.description || ''
    };
    setTimelineData(prev => [...prev, finalItem]);

    try {
      const response = await fetch(`${API_BASE}/experience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(finalItem),
      });
      if (response.ok) {
        const result = await response.json();
        // Replace optimistic item with true DB item
        setTimelineData(prev => prev.map(item => item.id === finalItem.id ? result : item));
      }
    } catch (err) {
      console.error('Error saving experience to database:', err);
    }

    setShowModal(false);
    setNewItem({ type: 'job' }); // reset
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setTimelineData(prev => prev.filter(item => item.id !== id));
    try {
      await fetch(`${API_BASE}/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
    } catch (err) {
      console.error('Error deleting experience:', err);
    }
  };

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-white/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16 relative"
        >
          <h2 className="text-4xl md:text-6xl font-medium font-nura tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            My Journey
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
            A timeline of my professional setup ranging from backend systems to frontline internships.
          </p>
          
          {isAdmin && (
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide"
            >
              <PlusIcon size={18} /> Add New Experience
            </button>
          )}
        </motion.div>

        <div ref={containerRef} className="relative mt-8 md:mt-16 pb-20">
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/5 transform -translate-x-1/2 z-0"></div>
          
          {/* Animated active scroll line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-1/2 top-0 w-[4px] bg-gradient-to-b from-[#6b0000] via-primary-main to-primary-light transform -translate-x-1/2 origin-top shadow-[0_0_20px_10px_rgba(230,0,0,0.3)] z-10" 
          />
          
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;
            
            // Dynamic styling based on the type of timeline item
            let Icon = BriefcaseIcon;
            let iconColorClasses = "border-white/20 group-hover:bg-white/10 shadow-white/10";
            let glowClasses = "bg-white/5 group-hover:bg-white/10";
            let titleHoverClass = "group-hover:text-white";
            let borderClasses = "border-white/10 hover:border-white/30 hover:bg-white/5";

            if (item.type === 'education') {
               Icon = GraduationCapIcon;
            }

            return (
              <div key={item.id} className="relative mb-16 md:mb-32 w-full flex justify-center">
                
                {/* Timeline Icon Node - Centered on the line, always visible but unlit initially */}
                <motion.div 
                  initial={{ filter: "grayscale(100%) brightness(0.5)", scale: 0.8, boxShadow: "0px 0px 0px transparent", x: "-50%" }}
                  whileInView={{ filter: "grayscale(0%) brightness(1)", scale: 1, boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.1)", x: "-50%" }}
                  viewport={{ once: true, margin: "-50% 0px -50% 0px" }} // Lights up EXACTLY when line hits center
                  transition={{ duration: 0.4 }}
                  className={`absolute top-0 md:top-4 left-1/2 w-[32px] h-[32px] md:w-[48px] md:h-[48px] bg-[#111] border-4 transition-colors duration-500 rounded-full flex justify-center items-center z-30 ${iconColorClasses}`}
                >
                    <Icon className="text-white w-[14px] h-[14px] md:w-[20px] md:h-[20px]" />
                </motion.div>
                
                {/* Card Container - Slides in from the side */}
                <div className={`w-1/2 flex ${isLeft ? 'pr-8 md:pr-16 justify-end mr-auto' : 'pl-8 md:pl-16 justify-start ml-auto'}`}>
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    viewport={{ once: true, margin: "-50% 0px -50% 0px" }} // Triggers sequentially EXACTLY when passing center
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
                    className={`glass p-6 md:p-8 rounded-xl md:rounded-2xl border hover:bg-white/5 transition-all duration-300 relative overflow-hidden shadow-2xl w-full text-left ${isLeft ? 'text-right' : ''} ${borderClasses} group cursor-pointer`}
                  >
                    <div className={`absolute top-0 w-32 h-32 rounded-full blur-2xl transition-all duration-500 ${isLeft ? 'right-0' : 'left-0'} ${glowClasses}`} />
                      <div className="relative z-10">
                        <div className={`flex items-start mb-2 md:mb-3 ${isLeft ? 'justify-end md:justify-between' : 'justify-between'} ${isLeft ? 'flex-row-reverse md:flex-row' : ''}`}>
                          <span className={`inline-block px-2 py-1 md:px-3 md:py-1 bg-white/5 text-gray-400 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-full border border-white/10 w-max`}>
                            {item.date}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all opacity-0 group-hover:opacity-100"
                              title="Delete"
                            >
                              <Trash2Icon size={14} />
                            </button>
                          )}
                        </div>
                        <h3 className={`text-lg md:text-2xl font-bold text-white mb-1 transition-colors leading-tight ${titleHoverClass}`}>
                          {item.title}
                        </h3>
                        <h4 className="text-sm md:text-base text-gray-400 font-medium mb-3 md:mb-4 tracking-wide">{item.subtitle}</h4>
                        <p className="text-gray-300 leading-relaxed text-xs md:text-base">
                          {item.description}
                        </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showModal && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                    className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg relative"
                >
                    <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                        <XIcon size={24} />
                    </button>
                    <h3 className="text-2xl font-bold text-white mb-6">Add New Journey Item</h3>
                    
                    <div className="space-y-4 text-left">
                        <div className="flex gap-4 mb-2">
                           <button onClick={() => setNewItem({...newItem, type: 'job'})} className={`flex-1 py-2 rounded-xl border text-sm font-bold ${newItem.type === 'job' ? 'border-white bg-white/20 text-white' : 'border-white/10 text-gray-400'}`}>Job Experience</button>
                           <button onClick={() => setNewItem({...newItem, type: 'education'})} className={`flex-1 py-2 rounded-xl border text-sm font-bold ${newItem.type === 'education' ? 'border-white bg-white/20 text-white' : 'border-white/10 text-gray-400'}`}>Education</button>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. Senior Backend Engineer" onChange={e => setNewItem({...newItem, title: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company / Institution</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. Google" onChange={e => setNewItem({...newItem, subtitle: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date Range</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main" placeholder="e.g. Jan 2024 - Present" onChange={e => setNewItem({...newItem, date: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                            <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary-main h-24" placeholder="Brief details about the role..." onChange={e => setNewItem({...newItem, description: e.target.value})}></textarea>
                        </div>
                        <button onClick={handleSave} className="w-full py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-colors mt-4">
                            Save Item
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Experience;
