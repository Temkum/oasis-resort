import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";

const properties = [
  {
    id: 1,
    name: "Oasis Maldives at Landaa Giraavaru",
    location: "Baa Atoll, Maldives",
    rating: 5,
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
    tag: "Private Island",
  },
  {
    id: 2,
    name: "Oasis Paris – George V",
    location: "Paris, France",
    rating: 5,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    tag: "City Icon",
  },
  {
    id: 3,
    name: "Oasis Bora Bora",
    location: "French Polynesia",
    rating: 5,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    tag: "Overwater Villas",
  },
  {
    id: 4,
    name: "Oasis Safari Lodge Serengeti",
    location: "Tanzania",
    rating: 5,
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&q=80",
    tag: "Safari Experience",
  },
  {
    id: 5,
    name: "Oasis Kyoto",
    location: "Kyoto, Japan",
    rating: 5,
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    tag: "Cultural Retreat",
  },
  {
    id: 6,
    name: "Oasis Costa Rica at Peninsula Papagayo",
    location: "Guanacaste, Costa Rica",
    rating: 5,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    tag: "Rainforest Escape",
  },
];

export const FeaturedPropertiesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const itemsPerView = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  const maxIndex = Math.max(0, properties.length - itemsPerView);

  const next = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Featured
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
              Iconic <span className="italic">Properties</span>
            </h2>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-12 h-12 border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="w-12 h-12 border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-6"
            style={{ width: `${(properties.length / itemsPerView) * 100}%` }}
          >
            {properties.map((property, index) => (
              <motion.article
                key={property.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="group flex-shrink-0"
                style={{ width: `calc(${100 / properties.length * itemsPerView}% - 1rem)` }}
              >
                <a href="#" className="block">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden mb-5">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Tag */}
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs uppercase tracking-wider">
                      {property.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(property.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>

                    <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {property.name}
                    </h3>

                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {property.location}
                    </p>
                  </div>
                </a>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {[...Array(maxIndex + 1)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
