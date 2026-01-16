import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const HistorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-48 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920&q=80"
          alt="Historic hotel interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-teal-light mb-6">
            Since 1960
          </p>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8">
            A Legacy of <span className="italic">Excellence</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-12">
            For over six decades, Oasis Resort has set the standard for 
            luxury hospitality. From our first property to a global collection 
            spanning five continents, our commitment to exceptional service 
            and timeless elegance remains unwavering.
          </p>

          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-charcoal text-sm uppercase tracking-widest hover:bg-teal hover:text-white transition-all duration-300"
          >
            Our Story
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/20"
        >
          {[
            { value: "130+", label: "Properties Worldwide" },
            { value: "50+", label: "Countries" },
            { value: "65", label: "Years of Excellence" },
            { value: "5", label: "Star Service" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-4xl md:text-5xl text-white mb-2">
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-widest text-white/60">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
