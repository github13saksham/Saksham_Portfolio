import { useRef, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, useTransform, useSpring } from 'framer-motion';
import { ArrowRightIcon, GithubIcon, LinkedinIcon, MailIcon } from 'lucide-react';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const frameCount = 144;

  // Staggered text animations - appearing one by one and STAYING visible
  // Group 1: Headline
  const g1Opacity = useTransform(smoothProgress, [0, 0.1], [0, 1]);
  const g1Y = useTransform(smoothProgress, [0, 0.1], [20, 0]);

  // Group 2: Bio & Dates
  const g2Opacity = useTransform(smoothProgress, [0.15, 0.3], [0, 1]);
  const g2Y = useTransform(smoothProgress, [0.15, 0.3], [20, 0]);

  // Group 3: Name & Role
  const g3Opacity = useTransform(smoothProgress, [0.35, 0.5], [0, 1]);
  const g3Y = useTransform(smoothProgress, [0.35, 0.5], [20, 0]);

  // Group 4: CTA, Location, Socials
  const g4Opacity = useTransform(smoothProgress, [0.55, 0.7], [0, 1]);
  const g4Y = useTransform(smoothProgress, [0.55, 0.7], [20, 0]);

  // Giant Watermark
  const watermarkOpacity = useTransform(smoothProgress, [0, 0.1], [0, 1]);
  const textScale = useTransform(smoothProgress, [0, 1], [1, 0.9]);

  useEffect(() => {
    // Preload images
    const loadImages = () => {
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = `/frames/frame_${i.toString().padStart(5, '0')}.png`;
        imagesRef.current.push(img);
      }
    };
    loadImages();
  }, []);

  const renderFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = imagesRef.current[index];
    if (img.complete && img.naturalWidth > 0) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale + 120; // Shift down by 120px to avoid navbar
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the frame
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // If there's a gap at the top, fill it with a black color to submerge it
      if (y > 0) {
        ctx.fillStyle = '#000000'; // Black background
        ctx.fillRect(0, 0, canvas.width, y + 2); // +2 for overlap to avoid seam
        
        // Add a gradient blend
        const grad = ctx.createLinearGradient(0, y, 0, y + 120);
        grad.addColorStop(0, '#000000');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, y, canvas.width, 120);
      }
    } else {
      img.onload = () => {
        const currentIndex = Math.floor(smoothProgress.get() * (frameCount - 1));
        if (currentIndex === index) {
          renderFrame(index);
        }
      };
    }
  };

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const frameIndex = Math.floor(latest * (frameCount - 1));
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  useEffect(() => {
    renderFrame(0);
    const handleResize = () => renderFrame(Math.floor(smoothProgress.get() * (frameCount - 1)));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [smoothProgress]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-black font-geist h-[400vh]"
      id="hero"
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Giant "SAKSHAM" Watermark (Placed BEHIND the canvas (z-0) so it's behind the face) */}
        <motion.div 
          style={{ opacity: watermarkOpacity, scale: textScale }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-20 mt-[10vh]"
        >
          <motion.span 
            className="text-[22vw] font-black tracking-tighter text-white/[0.05] uppercase leading-[0.8] text-center font-nura mix-blend-overlay"
          >
            SAKSHAM
          </motion.span>
        </motion.div>

        {/* Canvas Background (z-10) */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-10 w-full h-full object-cover pointer-events-none" 
        />
        
        {/* Main Container */}
        <div className="relative z-30 w-full h-full max-w-screen-2xl mx-auto flex flex-col justify-between pointer-events-none">
          
          {/* Top Area */}
          <div className="flex flex-col md:flex-row justify-between items-start pt-24 lg:pt-28 w-full px-6 lg:px-16">
            {/* Top Left: Main Headline */}
            <motion.div 
              style={{ opacity: g1Opacity, y: g1Y }}
              className="max-w-[85vw] lg:max-w-2xl pointer-events-auto"
            >
              <h1 className="text-5xl md:text-7xl lg:text-[4.5rem] font-medium tracking-tighter font-nura drop-shadow-2xl">
                <span className="text-white">The future of</span><br/>
                <span className="text-white/70">digital web</span><br/>
                <span className="text-white/40">experiences</span>
              </h1>
            </motion.div>
            
            {/* Top Right: Bio Paragraph */}
            <motion.div 
              style={{ opacity: g2Opacity, y: g2Y }}
              className="hidden md:block max-w-[280px] text-left pointer-events-auto mt-6 md:mt-0"
            >
              <p className="text-gray-300 text-base lg:text-lg leading-snug drop-shadow-lg tracking-tight font-geist">
                Redefines what a web app can be—transforming passive browsing into an immersive, interactive experience.
              </p>
            </motion.div>
          </div>

          {/* Scattered Metadata Tags (Absolute relative to screen) */}
          {/* Mid Right Tag */}
          <motion.div 
            style={{ opacity: g2Opacity, y: g2Y }}
            className="hidden lg:flex flex-col absolute top-[40%] right-16 -translate-y-1/2 text-right z-30"
          >
            <span className="text-[10px] text-gray-500 font-semibold tracking-wide mb-0.5">Jun 24</span>
            <span className="text-xs text-white tracking-tight font-medium">2026</span>
          </motion.div>

          <motion.div 
            style={{ opacity: g3Opacity, y: g3Y }}
            className="absolute top-[65%] left-0 w-full flex justify-between px-12 md:px-24 lg:px-32 pointer-events-auto">
                <span className="text-sm md:text-base text-white font-medium tracking-wide font-geist">Saksham Makhija</span>
                <span className="text-sm md:text-base text-white/70 font-medium tracking-wide font-geist">Full Stack Developer</span>
          </motion.div>
          
          {/* Bottom Area */}
          <div className="flex flex-col md:flex-row justify-between items-end pb-12 w-full px-6 lg:px-16">
            {/* Bottom Left: Visit Site / Explore Button */}
            <motion.div 
              style={{ opacity: g4Opacity, y: g4Y }}
              className="pointer-events-auto mb-8 md:mb-0"
            >
              <a href="#projects" className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-lg text-white font-medium hover:bg-white hover:text-black transition-all duration-300 shadow-2xl">
                <ArrowRightIcon size={20} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                <span className="text-sm tracking-wide font-geist">Explore Projects</span>
              </a>
            </motion.div>

            {/* Bottom Right: Location & Links */}
            <motion.div 
              style={{ opacity: g4Opacity, y: g4Y }}
              className="flex items-end gap-12 pointer-events-auto"
            >
              <div className="hidden lg:flex flex-col text-left mb-4">
                 <span className="text-[10px] text-gray-400 tracking-wide mb-0.5">Location:</span>
                 <span className="text-xs text-white font-medium">New Delhi, India</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Social Radial Menu */}
        <motion.div 
          style={{ opacity: g4Opacity, y: g4Y }}
          className="absolute right-0 top-[50%] -translate-y-1/2 z-50 pointer-events-auto"
        >
          <motion.div 
            className="relative flex items-center justify-end w-[150px] h-[200px] cursor-pointer group pr-2"
            whileHover="hover"
            initial="initial"
          >
            {/* GitHub */}
            <motion.a 
              href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME || 'github13saksham'}/`}
              target="_blank" rel="noreferrer"
              variants={{
                hover: { x: -60, y: -60, opacity: 1, scale: 1 },
                initial: { x: 20, y: -48, opacity: 0.6, scale: 0.8 }
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="absolute right-2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-lg"
              title="GitHub"
            >
              <GithubIcon size={20} />
            </motion.a>
            {/* LinkedIn */}
            <motion.a 
              href="https://linkedin.com/in/saksham-makhija13/"
              target="_blank" rel="noreferrer"
              variants={{
                hover: { x: -85, y: 0, opacity: 1, scale: 1 },
                initial: { x: 0, y: 0, opacity: 0.6, scale: 0.8 }
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.05 }}
              className="absolute right-2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-lg"
              title="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </motion.a>
            {/* Gmail */}
            <motion.a 
              href="mailto:smakhija140@gmail.com"
              target="_blank" rel="noreferrer"
              variants={{
                hover: { x: -60, y: 60, opacity: 1, scale: 1 },
                initial: { x: 20, y: 48, opacity: 0.6, scale: 0.8 }
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="absolute right-2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-lg"
              title="Gmail"
            >
              <MailIcon size={20} />
            </motion.a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
