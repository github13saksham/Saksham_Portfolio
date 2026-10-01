import { useState } from 'react';
import { motion } from 'framer-motion';
import { MailIcon, MapPinIcon, SendIcon, CheckCircleIcon } from 'lucide-react';
import { API_BASE } from '../config';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Heading, Detailed Description & Quick Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 text-left"
          >
            <h2 className="text-4xl md:text-6xl font-medium font-nura tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
              Let's Connect
            </h2>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 font-geist text-justify">
              Whether you have a project in mind, want to discuss technical architectures, explore collaboration opportunities, or just say hello, I'd love to hear from you. Send me a message and I'll respond as soon as possible.
            </p>

            <div className="space-y-4 font-geist">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-400 shrink-0">
                  <MailIcon size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Email Communication</p>
                  <p className="text-white text-sm font-medium">Direct Response Guaranteed</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-400 shrink-0">
                  <MapPinIcon size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Location & Availability</p>
                  <p className="text-white text-sm font-medium">India • Global Remote Collaboration</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form Container with Rich Blue Color Accent */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 bg-gradient-to-br from-[#0a1226] via-[#0f1b38] to-[#070e1e] p-8 sm:p-10 rounded-3xl border border-blue-500/30 shadow-[0_10px_40px_rgba(37,99,235,0.15)] relative overflow-hidden"
            onSubmit={handleSubmit}
          >
            {/* Ambient inner glow */}
            <div className="absolute -right-16 -top-16 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-52 h-52 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 font-geist">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#080d1a]/80 border border-blue-500/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all font-geist"
                  
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 font-geist">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#080d1a]/80 border border-blue-500/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all font-geist"
                  
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2 font-geist">Message</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#080d1a]/80 border border-blue-500/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50 transition-all resize-none font-geist"
                  
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2 font-geist cursor-pointer"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <SendIcon size={18} />
                  </>
                )}
              </button>

              {status === 'success' && (
                <div className="p-4 bg-blue-950/60 border border-blue-500/30 text-blue-200 rounded-xl text-sm text-center font-geist flex items-center justify-center gap-2">
                  <CheckCircleIcon size={18} className="text-blue-400" />
                  <span>Message sent successfully! I'll get back to you soon.</span>
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 bg-red-950/60 border border-red-500/30 text-red-200 rounded-xl text-sm text-center font-geist">
                  Failed to send message. Please try again later.
                </div>
              )}
            </div>
          </motion.form>

        </div>
      </div>
    </section>
  );
};

export default Contact;
