import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <h2 className="text-4xl md:text-6xl font-medium font-nura tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              About Me
            </h2>
            
            <div className="space-y-6 text-gray-300 text-base md:text-lg leading-relaxed relative z-10 text-justify font-geist">
              <p>
                I am a Full-Stack Developer with hands-on Machine Learning and Deep Learning experience. My philosophy centers on bridging clean, maintainable backend architectures with breathtaking, pixel-perfect user interfaces, while integrating predictive intelligence layers.
              </p>
              <p>
                Currently pursuing a B.Tech in Computer Science, my academic and professional journeys intersect where modern web development meets AI. I have published research on AI-driven cost estimation, proving my ability to own a feature end-to-end—from model and API design to a working UI.
              </p>
              <p>
                Whether orchestrating a PostgreSQL schema via Prisma, deploying CNNs for image classification, or building real-time dashboards in Next.js, I thrive on translating technical tradeoffs into simple language for stakeholders and deepening my applied Generative AI skills in production systems.
              </p>
            </div>
          </motion.div>

          {/* Right Side: Minimal Developer Terminal & Highlights */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Minimal Terminal Block */}
            <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl overflow-hidden font-mono shadow-xl text-left">
              <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <span className="text-xs text-gray-400 font-sans font-medium">developer.config.ts</span>
                <div className="w-12" />
              </div>

              <div className="p-6 text-gray-300 leading-relaxed font-mono text-xs sm:text-sm overflow-x-auto space-y-1.5">
                <div><span className="text-blue-400">const</span> <span className="text-yellow-300">developer</span> = &#123;</div>
                <div className="pl-4"><span className="text-gray-400">name:</span> <span className="text-green-400">"Saksham Makhija"</span>,</div>
                <div className="pl-4"><span className="text-gray-400">role:</span> <span className="text-green-400">"Full-Stack Developer & AI Specialist"</span>,</div>
                <div className="pl-4"><span className="text-gray-400">education:</span> <span className="text-green-400">"B.Tech CSE (AI Specialization)"</span>,</div>
                <div className="pl-4"><span className="text-gray-400">location:</span> <span className="text-green-400">"India"</span>,</div>
                <div className="pl-4"><span className="text-gray-400">research:</span> <span className="text-green-400">"Published Author @ ICSDS-2025"</span>,</div>
                <div className="pl-4"><span className="text-gray-400">coreStack:</span> [</div>
                <div className="pl-8 text-blue-300 font-sans text-xs flex flex-wrap gap-2 py-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-geist">Next.js</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-geist">React.js</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-geist">TypeScript</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-geist">Node.js</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-geist">Python</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-geist">PostgreSQL</span>
              
                </div>
                <div className="pl-4">]</div>
                <div>&#125;;</div>
              </div>
            </div>

            {/* Minimal Stat Calling Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl md:text-3xl font-bold font-nura text-blue-400 mb-1">04+</div>
                <p className="text-xs text-gray-400 font-geist">Years Engineering Experience</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl md:text-3xl font-bold font-nura text-blue-400 mb-1">15+</div>
                <p className="text-xs text-gray-400 font-geist">Production & AI Projects</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl md:text-3xl font-bold font-nura text-blue-400 mb-1">ICSDS</div>
                <p className="text-xs text-gray-400 font-geist">Published Research 2025</p>
              </div>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
