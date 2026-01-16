import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Star, ArrowRight } from "lucide-react";

const destinations = [
  {
    id: 1,
    title: "Tropical Paradise",
    subtitle: "Island Escapes",
    description: "Discover pristine beaches and turquoise waters",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
    locations: ["Maldives", "Bora Bora", "Seychelles"],
  },
  {
    id: 2,
    title: "Mountain Retreats",
    subtitle: "Alpine Luxury",
    description: "Experience serenity at breathtaking altitudes",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    locations: ["Swiss Alps", "Aspen", "Niseko"],
  },
  {
    id: 3,
    title: "Urban Sophistication",
    subtitle: "City Icons",
    description: "Where culture meets contemporary elegance",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    locations: ["Paris", "Tokyo", "New York"],
  },
  {
    id: 4,
    title: "Desert Oasis",
    subtitle: "Arabian Nights",
    description: "Timeless luxury under starlit skies",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    locations: ["Dubai", "Marrakech", "Abu Dhabi"],
  },
];

export const DiscoverSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
            Destinations
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Discover <span className="italic">Your Journey</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From sun-kissed shores to snow-capped peaks, explore our curated 
            collection of the world's most exceptional destinations.
          </p>
        </motion.div>

        {/* Destination Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {destinations.map((destination, index) => (
            <motion.article
              key={destination.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: 0.2 + index * 0.1,
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="group relative overflow-hidden bg-background"
            >
              <a href="#" className="block">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="text-xs uppercase tracking-widest text-white/80 mb-2">
                      {destination.subtitle}
                    </p>
                    <h3 className="font-serif text-2xl md:text-3xl text-white mb-3">
                      {destination.title}
                    </h3>
                    <p className="text-sm text-white/80 mb-4">
                      {destination.description}
                    </p>
                    
                    {/* Locations */}
                    <div className="flex flex-wrap gap-3">
                      {destination.locations.map((location) => (
                        <span
                          key={location}
                          className="flex items-center gap-1 text-xs text-white/70"
                        >
                          <MapPin className="w-3 h-3" />
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover Arrow */}
                  <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </a>
            </motion.article>
          ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary hover:text-teal-light transition-colors group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
