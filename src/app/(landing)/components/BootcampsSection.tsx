import { FiCheck, FiClock, FiVideo, FiCalendar, FiMapPin } from "react-icons/fi";

export default function BootcampsSection() {
  const features = [
    {
      icon: FiClock,
      text: "100 à 300 heures"
    },
    {
      icon: FiVideo,
      text: "Cours en direct"
    },
    {
      icon: FiCalendar,
      text: "2 à 4 mois flexibles"
    },
    {
      icon: FiMapPin,
      text: "En ligne ou à Conakry"
    }
  ];

  return (
    <section id="homeBootcamps" className="relative py-20 bg-gradient-to-b from-gray-50/50 to-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-secondary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-8">
            <FiCheck className="w-4 h-4" />
            <span className="font-semibold text-sm uppercase tracking-wide">
              Nos Bootcamps
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Transformez votre{" "}
            <span className="text-secondary">carrière</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Des formations intensives conçues pour vous préparer aux métiers 
            tech les plus demandés en Guinée et au-delà.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-secondary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/15 transition-colors duration-300">
                    <IconComponent className="w-7 h-7 text-secondary" />
                  </div>
                  
                  {/* Text */}
                  <p className="font-semibold text-gray-900 group-hover:text-secondary/90 transition-colors duration-300">
                    {feature.text}
                  </p>
                </div>
                
                {/* Check Icon */}
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center">
                    <FiCheck className="w-3 h-3 text-secondary" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 opacity-10">
        <div className="w-20 h-20 border-2 border-secondary/20 rounded-2xl rotate-45 animate-pulse"></div>
      </div>
      <div className="absolute bottom-20 left-20 opacity-10">
        <div className="w-12 h-12 bg-secondary/10 rounded-full animate-bounce"></div>
      </div>
    </section>
  );
}