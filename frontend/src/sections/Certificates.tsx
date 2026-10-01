import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AwardIcon, ExternalLinkIcon, PlusIcon, XIcon, Trash2Icon } from 'lucide-react';
import { API_BASE } from '../config';

export interface CertificateItem {
  id: string;
  date: string;
  title: string;
  issuer: string;
  description: string;
  link?: string;
  logoUrl?: string;
}

const defaultCertificates: CertificateItem[] = [
  {
    id: "cert-1",
    date: "Completed",
    title: "AWS – Amazon Web Services (30 hrs)",
    issuer: "AWS",
    description: "Comprehensive training covering AWS core services, deployment, and cloud architecture.",
    logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
  },
  {
    id: "cert-2",
    date: "Completed",
    title: "Generative AI: Introduction & Applications",
    issuer: "IBM",
    description: "Deep dive into foundational Generative AI models, prompt engineering, and business applications.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
  },
  {
    id: "cert-3",
    date: "Completed",
    title: "Python Bootcamp",
    issuer: "Udemy",
    description: "Advanced Python programming encompassing data structures, algorithms, and full-stack integration.",
    logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
  },
  {
    id: "cert-4",
    date: "In Progress",
    title: "Generative AI",
    issuer: "GeeksforGeeks",
    description: "Exploring advanced AI topics including LLMs, RAG pipelines, and vector databases.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg"
  }
];

// Helper to resolve company / tech logos automatically
const getCertificateLogo = (title: string, issuer: string, customLogo?: string) => {
  if (customLogo && customLogo.trim() !== '') return customLogo;
  const searchStr = (title + " " + issuer).toLowerCase();

  if (searchStr.includes('aws') || searchStr.includes('amazon')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg';
  }
  if (searchStr.includes('ibm')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg';
  }
  if (searchStr.includes('python')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg';
  }
  if (searchStr.includes('geeksforgeeks') || searchStr.includes('gfg')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg';
  }
  if (searchStr.includes('udemy')) {
    return 'https://www.vectorlogo.zone/logos/udemy/udemy-icon.svg';
  }
  if (searchStr.includes('react')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg';
  }
  if (searchStr.includes('google')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg';
  }

  return null;
};

const Certificates = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<CertificateItem>>({});
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  useEffect(() => {
    fetch(`${API_BASE}/certificates`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCertificates(data);
        } else {
          setCertificates(defaultCertificates);
        }
      })
      .catch(err => {
        console.error('Error fetching certificates:', err);
        setCertificates(defaultCertificates);
      });
  }, []);

  const handleSave = async () => {
    if (!newItem.title || !newItem.issuer || !newItem.date) return;

    const finalItem: CertificateItem = {
      id: "cert-" + Date.now(),
      title: newItem.title,
      issuer: newItem.issuer,
      date: newItem.date,
      description: newItem.description || '',
      link: newItem.link || '',
      logoUrl: newItem.logoUrl || ''
    };
    setCertificates(prev => [...prev, finalItem]);

    try {
      const response = await fetch(`${API_BASE}/certificates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(finalItem),
      });
      if (response.ok) {
        const result = await response.json();
        setCertificates(prev => prev.map(item => item.id === finalItem.id ? result : item));
      }
    } catch (err) {
      console.error("Error saving certificate to DB:", err);
    }

    setShowModal(false);
    setNewItem({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    setCertificates(prev => prev.filter(item => item.id !== id));
    try {
      await fetch(`${API_BASE}/certificates/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
    } catch (err) {
      console.error('Error deleting certificate:', err);
    }
  };

  return (
    <section id="certificates" className="py-20 md:py-28 relative overflow-hidden bg-black">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-6 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-6xl font-medium font-nura tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
              Licenses & Certifications
            </h2>
            <p className="text-gray-400 max-w-2xl text-base md:text-lg mt-3 font-geist">
              A showcase of my verified technical certifications, courses, and official credentials.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide text-sm font-geist"
            >
              <PlusIcon size={18} /> Add Certificate
            </button>
          )}
        </motion.div>

        {certificates.length === 0 ? (
          <div className="text-center text-gray-500 italic py-16 border border-white/10 rounded-3xl bg-[#0c0c0c] font-geist">
            No certificates added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {certificates.map((item, index) => {
              const logo = getCertificateLogo(item.title, item.issuer, item.logoUrl);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  className="bg-[#0c0c0c] p-6 md:p-8 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden group shadow-2xl flex flex-col justify-between h-full"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent group-hover:via-blue-500 opacity-60 transition-all duration-500" />

                  {/* Ambient top right glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      {/* Logo and Status Row */}
                      <div className="flex justify-between items-start mb-6 gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-shrink-0 items-center justify-center p-3 group-hover:border-blue-500/40 group-hover:bg-blue-600/10 transition-all duration-300">
                          {logo ? (
                            <img
                              src={logo}
                              alt={item.issuer}
                              className="w-full h-full object-contain drop-shadow-md"
                              loading="lazy"
                            />
                          ) : (
                            <AwardIcon size={24} className="text-blue-400" />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="inline-block px-3 py-1 bg-white/5 text-gray-300 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-full border border-white/10 font-geist">
                            {item.date}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                              title="Delete"
                            >
                              <Trash2Icon size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Certificate Title */}
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2 group-hover:text-blue-400 transition-colors font-geist leading-tight">
                        {item.title}
                      </h3>

                      {/* Issuer */}
                      <h4 className="text-sm md:text-base text-gray-400 font-medium mb-4 font-geist">{item.issuer}</h4>

                      {/* Description */}
                      <p className="text-gray-300 leading-relaxed text-sm flex-grow mb-6 font-geist text-justify">
                        {item.description}
                      </p>
                    </div>

                    {/* View Credential Button */}
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 w-max font-geist uppercase tracking-wider"
                      >
                        View Credential <ExternalLinkIcon size={13} />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
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
              className="bg-[#111] border border-white/10 p-8 rounded-3xl w-full max-w-lg relative"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white">
                <XIcon size={24} />
              </button>
              <h3 className="text-2xl font-bold text-white mb-6">Add New Certificate</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. AWS Certified Developer" onChange={e => setNewItem({ ...newItem, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Issuer</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. AWS, IBM, Udemy, GeeksforGeeks" onChange={e => setNewItem({ ...newItem, issuer: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Logo URL (Optional)</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="https://... (auto-detected if left blank)" onChange={e => setNewItem({ ...newItem, logoUrl: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date / Status</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Completed" onChange={e => setNewItem({ ...newItem, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 h-24" placeholder="Brief details about the certificate..." onChange={e => setNewItem({ ...newItem, description: e.target.value })}></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Credential Link (Optional)</label>
                  <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="https://..." onChange={e => setNewItem({ ...newItem, link: e.target.value })} />
                </div>
                <button onClick={handleSave} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors mt-4">
                  Save Certificate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certificates;
