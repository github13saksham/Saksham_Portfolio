import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from 'framer-motion';
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
    date: "May 2026 – Present",
    title: "Full Stack Developer Intern",
    subtitle: "Primus Partners Solution Pvt Ltd | India",
    description: "Built the PrimusOne website end-to-end in Next.js, including responsive pages, a CMS admin portal for live content preview, and a local PostgreSQL backend with database seeding. Developed responsive UI pages for the Choice (Parivar Pehchan Patra, Uttarakhand) and MPIDC projects, focusing on reusable components and cross-device compatibility."
  },
  {
    id: "job-2",
    type: "job",
    date: "Aug 2025 – Jan 2026",
    title: "Full Stack Developer Intern",
    subtitle: "DOT Defence | India",
    description: "Delivered full-stack features using React.js, Node.js, and MongoDB from spec to deployment. Partnered with the team to debug and optimize production issues."
  },
  {
    id: "job-3",
    type: "job",
    date: "May 2025 – Jul 2025",
    title: "Frontend Developer Intern",
    subtitle: "Primus Partners Solution Pvt Ltd | India",
    description: "Built the login flow and multilingual family dashboard for a government portal using React.js, Tailwind CSS, and i18next. Coordinated with backend engineers on API integration and accessibility fixes."
  },
  {
    id: "edu-1",
    type: "education",
    date: "2022 – 2026",
    title: "B.Tech, Computer Science Engineering",
    subtitle: "Sharda University",
    description: "Focusing on full-stack development, AI, and scalable backend architectures. Deepened skills in Machine Learning and Deep Learning."
  }
];

// Sub-component for Timeline Node Logo that glows when the active line reaches it
const TimelineNodeIcon = ({
  index,
  total,
  type,
  scrollYProgress
}: {
  index: number;
  total: number;
  type: ExperienceType;
  scrollYProgress: MotionValue<number>;
}) => {
  const Icon = type === 'education' ? GraduationCapIcon : BriefcaseIcon;
  const nodeProgress = total > 1 ? index / (total - 1) : 0;
  const isLit = useTransform(scrollYProgress, (v: number) => v >= (index === 0 ? 0.01 : nodeProgress - 0.06));
  const [lit, setLit] = useState(false);

  useEffect(() => {
    return isLit.on("change", (val) => setLit(val));
  }, [isLit]);

  return (
    <div className="absolute left-6 md:left-1/2 top-1 md:top-2 -translate-x-1/2 z-20 pointer-events-none">
      <motion.div
        animate={{
          scale: lit ? 1.25 : 0.95,
          borderColor: lit ? '#60a5fa' : 'rgba(255, 255, 255, 0.2)',
          backgroundColor: lit ? '#2563eb' : '#111111',
          boxShadow: lit ? '0 0 35px 12px rgba(59, 130, 246, 0.95)' : '0 0 0px rgba(0,0,0,0)'
        }}
        transition={{ duration: 0.3 }}
        className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-2xl"
      >
        <Icon className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${lit ? 'text-white' : 'text-gray-400'}`} />
      </motion.div>
    </div>
  );
};

const Experience = () => {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<TimelineItem>>({ type: 'job' });
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 60%", "end 60%"]
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

    const finalItem: TimelineItem = {
      id: "exp-" + Date.now(),
      type: newItem.type || 'job',
      title: newItem.title,
      subtitle: newItem.subtitle,
      date: newItem.date,
      description: newItem.description || ''
    };
    setTimelineData(prev => [finalItem, ...prev]);

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
        setTimelineData(prev => prev.map(item => item.id === finalItem.id ? result : item));
      }
    } catch (err) {
      console.error('Error saving experience to database:', err);
    }

    setShowModal(false);
    setNewItem({ type: 'job' });
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
    <section id="experience" className="py-20 md:py-28 relative overflow-hidden bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left mb-16 md:mb-24 relative"
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-medium font-nura tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
            My Journey
          </h2>
          <p className="text-gray-400 max-w-2xl text-sm sm:text-base md:text-lg mb-8 font-geist">
            A chronological timeline of my professional internships, full-stack systems engineering, and academic background.
          </p>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold text-xs sm:text-sm tracking-wide"
            >
              <PlusIcon size={18} /> Add New Experience
            </button>
          )}
        </motion.div>

        <div ref={containerRef} className="relative mt-6 md:mt-16 pb-12 md:pb-20">
          {/* Main vertical line track: left-6 on mobile, center on md+ */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 transform -translate-x-1/2 z-0" />

          {/* Animated active scroll line: sharp 2px width, minimal glow, with sharp pointed tip */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-6 md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400 transform -translate-x-1/2 origin-top shadow-[0_0_6px_rgba(59,130,246,0.35)] z-10"
          >
            {/* Sharp pointed tip at the bottom edge */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[4px] border-r-[4px] border-t-[8px] border-l-transparent border-r-transparent border-t-blue-400" />
          </motion.div>

          {timelineData.map((item, index) => (
            <div key={item.id} className="relative mb-16 md:mb-24 w-full">
              
              {/* Timeline Logo Icon on Line with Glow trigger */}
              <TimelineNodeIcon
                index={index}
                total={timelineData.length}
                type={item.type}
                scrollYProgress={scrollYProgress}
              />

              {/* Layout: Dates big on left, Title & Details on right (Card Removed) */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-start w-full relative">
                
                {/* Left Side: Big Date */}
                <motion.div
                  initial={{ opacity: 0, x: -25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="pl-16 sm:pl-20 md:pl-0 md:col-span-5 md:text-right pr-0 md:pr-12 mb-2 md:mb-0"
                >
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold font-nura tracking-tight text-blue-400 uppercase leading-tight">
                    {item.date}
                  </div>
                </motion.div>

                {/* Center spacing column on desktop */}
                <div className="hidden md:block md:col-span-2" />

                {/* Right Side: Title, Subtitle, Description (No card container) */}
                <motion.div
                  initial={{ opacity: 0, x: 25 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="pl-16 sm:pl-20 md:pl-12 md:col-span-5 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-nura tracking-tight leading-tight mb-1">
                      {item.title}
                    </h3>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/30 transition-all shrink-0"
                        title="Delete"
                      >
                        <Trash2Icon size={14} />
                      </button>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm md:text-base text-gray-400 font-medium font-geist mb-3 tracking-wide">
                    {item.subtitle}
                  </h4>
                  <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base font-geist text-justify">
                    {item.description}
                  </p>
                </motion.div>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Admin Add Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-lg relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                <XIcon size={24} />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">Add New Journey Item</h3>

              <div className="space-y-4 text-left font-geist">
                <div className="flex gap-4 mb-2">
                  <button onClick={() => setNewItem({ ...newItem, type: 'job' })} className={`flex-1 py-2 rounded-xl border text-xs sm:text-sm font-bold ${newItem.type === 'job' ? 'border-white bg-white/20 text-white' : 'border-white/10 text-gray-400'}`}>Job Experience</button>
                  <button onClick={() => setNewItem({ ...newItem, type: 'education' })} className={`flex-1 py-2 rounded-xl border text-xs sm:text-sm font-bold ${newItem.type === 'education' ? 'border-white bg-white/20 text-white' : 'border-white/10 text-gray-400'}`}>Education</button>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-sm" placeholder="e.g. Senior Backend Engineer" onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Company / Institution</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-sm" placeholder="e.g. Google" onChange={e => setNewItem({ ...newItem, subtitle: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date Range</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 text-sm" placeholder="e.g. Jan 2024 - Present" onChange={e => setNewItem({ ...newItem, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 h-24 text-sm" placeholder="Brief details about the role..." onChange={e => setNewItem({ ...newItem, description: e.target.value })}></textarea>
                </div>
                <button onClick={handleSave} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors mt-4 text-sm">
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
