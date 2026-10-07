import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AwardIcon, ExternalLinkIcon, PlusIcon, XIcon, Trash2Icon, EyeIcon, FileTextIcon, DownloadIcon } from 'lucide-react';
import { API_BASE } from '../config';

export interface CertificateItem {
  id: string;
  date: string;
  title: string;
  issuer: string;
  description: string;
  link?: string;
  logoUrl?: string;
  fileUrl?: string;
}

const defaultCertificates: CertificateItem[] = [
  {
    id: "cert-aws-1",
    date: "April 2023",
    title: "Deep Dive On AWS Fargate (30 hrs)",
    issuer: "Sharda University / AWS",
    description: "Successfully completed 30 hours Value Added Course on Deep Dive On AWS Fargate, organized by Sharda School of Engineering & Technology.",
    link: "/certificates/aws_fargate_certificate.pdf",
    fileUrl: "/certificates/aws_fargate_certificate.png",
    logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
  },
  {
    id: "cert-major-1",
    date: "Dec 2025",
    title: "Major Project Research – ICSDS-2025",
    issuer: "ICSDS-2025 (Hooghly Eng. & Tech College)",
    description: "Presented research paper titled 'LEVERAGING AI FOR PRECISE COST ESTIMATION FOR SOFTWARE PROJECTS' in the International Conference ICSDS-2025.",
    link: "/certificates/major_project_icsds2025.pdf",
    fileUrl: "/certificates/major_project_icsds2025.png",
    logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
  },
  {
    id: "cert-udemy-1",
    date: "Oct 2023",
    title: "100 Days of Code: Complete Python Pro Bootcamp",
    issuer: "Udemy (Dr. Angela Yu)",
    description: "Mastered Python programming, object-oriented software development, data science, and web applications through 58 hours of intensive coding.",
    link: "/certificates/udemy_python_bootcamp.pdf",
    fileUrl: "/certificates/udemy_python_bootcamp.png",
    logoUrl: "https://www.vectorlogo.zone/logos/udemy/udemy-icon.svg"
  },
  {
    id: "cert-mern-1",
    date: "Summer 2023",
    title: "Summer Bootcamp on MERN Stack",
    issuer: "EZ Trainings & Sharda University",
    description: "Awarded Certificate of Completion for intensive hands-on summer bootcamp in full-stack web development using MongoDB, Express, React, and Node.js.",
    link: "/certificates/mern_summer_bootcamp.pdf",
    fileUrl: "/certificates/mern_summer_bootcamp.png",
    logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
  },
  {
    id: "cert-ibm-1",
    date: "Completed",
    title: "Generative AI: Introduction & Applications",
    issuer: "IBM",
    description: "Deep dive into foundational Generative AI models, prompt engineering, and real-world business applications.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
  },
  {
    id: "cert-gfg-1",
    date: "In Progress",
    title: "Generative AI Engineering",
    issuer: "GeeksforGeeks",
    description: "Exploring advanced AI topics including LLMs, RAG pipelines, vector databases, and autonomous agents.",
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
  if (searchStr.includes('react') || searchStr.includes('mern')) {
    return 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg';
  }

  return null;
};

const Certificates = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activePreviewItem, setActivePreviewItem] = useState<CertificateItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<CertificateItem>>({});
  const isAdmin = typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false;

  useEffect(() => {
    fetch(`${API_BASE}/certificates`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
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
      logoUrl: newItem.logoUrl || '',
      fileUrl: newItem.fileUrl || ''
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
              Verified technical credentials, course certifications, and academic research presentations.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-bold tracking-wide text-sm font-geist cursor-pointer"
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
              const hasFile = item.fileUrl && item.fileUrl.trim() !== '';

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 100 }}
                  className="bg-[#0c0c0c] rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 relative overflow-hidden group shadow-2xl flex flex-col justify-between h-full"
                >
                  {/* Top accent glow line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent group-hover:via-blue-500 opacity-60 transition-all duration-500 z-10" />

                  {/* Top Image Preview Box */}
                  <div className="relative w-full h-48 bg-[#141419] overflow-hidden border-b border-white/10 group-hover:border-blue-500/30 transition-colors">
                    {hasFile ? (
                      <div className="relative w-full h-full cursor-pointer" onClick={() => setActivePreviewItem(item)}>
                        <img
                          src={item.fileUrl}
                          alt={`${item.title} Preview`}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-xs font-geist shadow-lg">
                            <EyeIcon size={14} /> Quick Preview
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-blue-950/30 via-[#101014] to-black">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">Verified Credential</span>
                          <AwardIcon size={20} className="text-blue-500/60" />
                        </div>
                        <div className="my-auto">
                          <h4 className="text-sm font-bold text-gray-300 font-geist line-clamp-2">{item.title}</h4>
                          <p className="text-xs text-gray-500 font-geist mt-1">{item.issuer}</p>
                        </div>
                      </div>
                    )}

                    {/* Status badge floating */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-gray-200 text-[10px] font-bold tracking-wider uppercase rounded-full border border-white/15 font-geist shadow-md">
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 md:p-7 flex flex-col flex-grow justify-between relative z-10">
                    <div>
                      {/* Logo & Admin Actions Row */}
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-shrink-0 items-center justify-center p-2.5 group-hover:border-blue-500/40 group-hover:bg-blue-600/10 transition-all duration-300">
                          {logo ? (
                            <img
                              src={logo}
                              alt={item.issuer}
                              className="w-full h-full object-contain drop-shadow-md"
                              loading="lazy"
                            />
                          ) : (
                            <AwardIcon size={22} className="text-blue-400" />
                          )}
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                            title="Delete Certificate"
                          >
                            <Trash2Icon size={14} />
                          </button>
                        )}
                      </div>

                      {/* Title & Issuer */}
                      <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors font-geist leading-snug">
                        {item.title}
                      </h3>
                      <h4 className="text-xs md:text-sm text-blue-400/90 font-medium mb-3 font-geist">{item.issuer}</h4>

                      {/* Description */}
                      <p className="text-gray-300 leading-relaxed text-xs md:text-sm font-geist text-justify mb-6 line-clamp-4">
                        {item.description}
                      </p>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                      {/* View / Preview Certificate Button */}
                      {(item.fileUrl || item.link) && (
                        <button
                          onClick={() => setActivePreviewItem(item)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white text-xs font-bold transition-all duration-300 font-geist cursor-pointer shadow-md shadow-blue-600/20"
                        >
                          <EyeIcon size={14} /> View Certificate
                        </button>
                      )}

                      {/* Direct External PDF / Credential Link */}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all duration-300 font-geist"
                          title="Open Full File / Credential"
                        >
                          {item.link.endsWith('.pdf') ? <FileTextIcon size={14} /> : <ExternalLinkIcon size={14} />}
                          <span>{item.link.endsWith('.pdf') ? 'PDF Document' : 'Credential'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox / Preview Modal for Viewing Certificate */}
      <AnimatePresence>
        {activePreviewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActivePreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#121217] border border-white/15 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
            >
              {/* Modal Top Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#17171f]">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white font-geist leading-tight">
                    {activePreviewItem.title}
                  </h3>
                  <p className="text-xs text-blue-400 font-geist mt-0.5">{activePreviewItem.issuer} • {activePreviewItem.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  {activePreviewItem.link && (
                    <a
                      href={activePreviewItem.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-geist transition-all"
                    >
                      <DownloadIcon size={14} /> Open Full File
                    </a>
                  )}
                  <button
                    onClick={() => setActivePreviewItem(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <XIcon size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="p-4 md:p-6 overflow-y-auto flex-grow flex items-center justify-center bg-black/60 min-h-[300px]">
                {activePreviewItem.fileUrl ? (
                  <img
                    src={activePreviewItem.fileUrl}
                    alt={activePreviewItem.title}
                    className="max-h-[65vh] w-auto max-w-full rounded-2xl border border-white/10 object-contain shadow-2xl"
                  />
                ) : activePreviewItem.link && activePreviewItem.link.endsWith('.pdf') ? (
                  <iframe
                    src={activePreviewItem.link}
                    title={activePreviewItem.title}
                    className="w-full h-[65vh] rounded-2xl border border-white/10"
                  />
                ) : (
                  <div className="text-center py-12 px-6">
                    <AwardIcon size={48} className="text-blue-500 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-white font-geist mb-2">{activePreviewItem.title}</h4>
                    <p className="text-sm text-gray-400 font-geist max-w-md mx-auto">{activePreviewItem.description}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Add / Edit Certificate Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-lg relative max-h-[90vh] flex flex-col shadow-2xl"
            >
              {/* Fixed Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
                <h3 className="text-xl md:text-2xl font-bold text-white font-geist">Add New Certificate</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white cursor-pointer p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <XIcon size={20} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 space-y-4 font-geist overflow-y-auto flex-grow">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Certificate Title</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. AWS Certified Solutions Architect"
                    value={newItem.title || ''}
                    onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Issuer / Institution</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Amazon Web Services, Udemy, Sharda University"
                    value={newItem.issuer || ''}
                    onChange={e => setNewItem({ ...newItem, issuer: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date / Status</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. April 2023 or Completed"
                    value={newItem.date || ''}
                    onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Certificate Image / Preview URL</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. /certificates/my_cert.png or https://..."
                    value={newItem.fileUrl || ''}
                    onChange={e => setNewItem({ ...newItem, fileUrl: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-500 mt-1">URL or path to image/preview of the certificate.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Certificate PDF / Credential Link</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. /certificates/my_cert.pdf or https://..."
                    value={newItem.link || ''}
                    onChange={e => setNewItem({ ...newItem, link: e.target.value })}
                  />
                  <p className="text-[11px] text-gray-500 mt-1">Direct PDF link or external verification URL.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Logo URL (Optional)</label>
                  <input
                    type="text"
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="https://... (auto-detected if blank)"
                    value={newItem.logoUrl || ''}
                    onChange={e => setNewItem({ ...newItem, logoUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 h-24"
                    placeholder="Brief details about the certificate..."
                    value={newItem.description || ''}
                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                  ></textarea>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors mt-4 cursor-pointer shadow-lg shadow-blue-600/30"
                >
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
