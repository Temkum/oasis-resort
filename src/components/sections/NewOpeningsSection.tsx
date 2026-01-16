import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const newOpenings = [
  {
    id: 1,
    name: "Oasis Athens",
    location: "Athens, Greece",
    openingDate: "Summer 2025",
    image: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80",
    description: "A landmark property in the heart of the ancient city, blending classical heritage with contemporary luxury.",
  },
  {
    id: 2,
    name: "Oasis Napa Valley",
    location: "California, USA",
    openingDate: "Fall 2025",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    description: "An intimate wine country retreat nestled among rolling vineyards and Michelin-starred dining.",
  },
];

export const NewOpeningsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Coming Soon
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            New <span className="italic">Horizons</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Anticipate the extraordinary with our upcoming destinations, 
            each designed to redefine luxury hospitality.
          </p>
        </motion.div>

        {/* Openings Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {newOpenings.map((opening, index) => (
            <motion.article
              key={opening.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + index * 0.15,
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="group bg-background"
            >
              <a href="#" className="block md:flex">
                {/* Image */}
                <div className="relative md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden">
                  <img
                    src={opening.image}
                    alt={opening.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Opening Badge */}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {opening.openingDate}
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    {opening.location}
                  </p>
                  
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4 group-hover:text-primary transition-colors">
                    {opening.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {opening.description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary group-hover:gap-3 transition-all">
                    Register Interest
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
