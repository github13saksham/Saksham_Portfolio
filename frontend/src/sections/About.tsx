import { motion } from 'framer-motion';
import { MapPinIcon, GraduationCapIcon, TerminalIcon, CpuIcon, SparklesIcon } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-light text-sm font-medium mb-6">
              <SparklesIcon size={14} /> Get to know me
            </div>
            
            <h2 className="text-4xl md:text-6xl font-medium font-nura tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              About Me
            </h2>
            
            <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed relative z-10">
              <p>
                As a visionary Full Stack Engineer, I architect high-performance, scalable web systems from the ground up. My philosophy centers on bridging clean, maintainable backend architecture with breathtaking, pixel-perfect user interfaces that captivate users.
              </p>
              <p>
                Currently pursuing a B.Tech in Computer Science with a coveted specialization in Artificial Intelligence, my academic and professional journeys intersect where modern web development meets machine learning. I don't just write code—I engineer sophisticated digital solutions that solve complex real-world challenges fluidly.
              </p>
              <p>
                Whether orchestrating a complex PostgreSQL schema via Prisma, implementing rigorous security middlewares, or engineering complex Canvas/WebGL animations, I am relentlessly driven by the pursuit of technical excellence and constant innovation.
              </p>
            </div>
          </motion.div>

          {/* Right Side: Bento Grid Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 relative"
          >
            {/* Animated Grid Background for the Bento box - CSS Noise instead of external SVG */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-main/10 via-transparent to-transparent pointer-events-none blur-xl" />

            {/* Card 1: Education */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass p-6 md:p-8 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 transition-all duration-300 group shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
              <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 shadow-lg shadow-white/10 transition-transform border border-white/20">
                <GraduationCapIcon size={26} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10 font-geist">Academic Excellence</h3>
              <p className="text-sm text-gray-400 relative z-10 font-geist">
                Sharpening expertise with a rigorous B.Tech in CSE (<span className="text-white font-medium glow-text">AI Specialization</span>) at Sharda University.
              </p>
            </motion.div>

            {/* Card 2: Location */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass p-6 md:p-8 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 transition-all duration-300 group shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
              <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 shadow-lg shadow-white/10 transition-transform border border-white/20">
                <MapPinIcon size={26} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10 font-geist">Global Mindset</h3>
              <p className="text-sm text-gray-400 relative z-10 font-geist">
                Operating from <span className="text-white font-medium glow-text">India</span>, engineered to collaborate asynchronously across diverse, high-performing global teams.
              </p>
            </motion.div>

            {/* Card 3: Full Stack */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass p-6 md:p-8 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 transition-all duration-300 group shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
              <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 shadow-lg shadow-white/10 transition-transform border border-white/20">
                <TerminalIcon size={26} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10 font-geist">Full Stack Mastery</h3>
              <p className="text-sm text-gray-400 relative z-10 font-geist">
                Commanding modern MERN & PERN ecosystems to engineer resilient pipelines and flawless frontends.
              </p>
            </motion.div>

            {/* Card 4: AI & Future */}
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass p-6 md:p-8 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 transition-all duration-300 group shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
              <div className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 shadow-lg shadow-white/10 transition-transform border border-white/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-white/5 blur-xl group-hover:bg-white/10 transition-colors z-0" />
                <CpuIcon size={26} className="relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 relative z-10 font-geist">AI Integration</h3>
              <p className="text-sm text-gray-400 relative z-10 font-geist">
                Pioneering intelligence layers within scaleable apps, transforming static data into predictive insight.
              </p>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
