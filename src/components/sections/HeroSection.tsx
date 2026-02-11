import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronDown, Volume2, VolumeX } from 'lucide-react';

export const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
        >
          <source
            src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=164&oauth2_token_id=57447761"
            type="video/mp4"
          />
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center text-white px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xs md:text-sm uppercase tracking-[0.3em] mb-6 text-white/70 font-sans"
          >
            Experience Unparalleled Luxury
          </motion.p>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-8">
            <span className="block">Discover the Art of</span>
            <span className="block italic font-light mt-1">
              Extraordinary Living
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-sm md:text-base lg:text-lg text-white/80 max-w-xl leading-relaxed font-light"
          >
            From iconic hotels to private residences, hiking adventures to
            culinary journeys, every moment with Oasis Resort is crafted for
            those who seek the exceptional.
          </motion.p>
        </motion.div>

        {/* Video Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-32 left-6 md:left-12 flex items-center gap-4"
        >
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/80 hover:text-white transition-colors group"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 group-hover:scale-110 transition-transform" />
            ) : (
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/80 hover:text-white transition-colors group"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 group-hover:scale-110 transition-transform" />
            ) : (
              <Volume2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/80 hover:text-white transition-colors group"
        >
          <span className="text-xs uppercase tracking-widest">Explore</span>
          <ChevronDown className="w-5 h-5 scroll-indicator" />
        </motion.button>
      </div>
    </section>
  );
};
