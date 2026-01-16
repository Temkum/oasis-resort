import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Utensils, Wine, Coffee } from "lucide-react";

const diningExperiences = [
  {
    id: 1,
    title: "Fine Dining",
    description: "Michelin-starred restaurants crafting extraordinary culinary journeys",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    icon: Utensils,
  },
  {
    id: 2,
    title: "Wine & Spirits",
    description: "World-class cellars and expert sommeliers",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
    icon: Wine,
  },
  {
    id: 3,
    title: "Café Culture",
    description: "Artisanal coffee and patisserie in elegant settings",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    icon: Coffee,
  },
];

export const DiningSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="dining" className="py-24 md:py-32 bg-charcoal text-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-teal-light mb-4">
            Culinary Excellence
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
            The Art of <span className="italic">Dining</span>
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            From intimate chef's tables to grand dining rooms, experience 
            cuisine that celebrates the world's finest ingredients and traditions.
          </p>
        </motion.div>

        {/* Dining Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {diningExperiences.map((experience, index) => (
            <motion.article
              key={experience.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + index * 0.15,
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="group"
            >
              <a href="#" className="block">
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden mb-6">
                  <img
                    src={experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  
                  {/* Icon */}
                  <div className="absolute top-6 left-6 w-12 h-12 border border-white/30 flex items-center justify-center backdrop-blur-sm">
                    <experience.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-serif text-2xl mb-3 group-hover:text-teal-light transition-colors">
                  {experience.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {experience.description}
                </p>
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-teal-light group-hover:gap-3 transition-all">
                  Explore
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="#"
            className="inline-flex items-center gap-3 px-8 py-4 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-charcoal transition-all duration-300"
          >
            View All Restaurants
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
