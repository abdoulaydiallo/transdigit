import { ImpactStat } from "@/types/home";
import { FiTrendingUp, FiUsers, FiAward, FiTarget } from "react-icons/fi";

interface ImpactSectionProps {
  stats: ImpactStat[];
}

// Mapping des icônes par index ou titre (vous pouvez adapter selon vos besoins)
const getStatIcon = (index: number) => {
  const icons = [FiUsers, FiAward, FiTarget, FiTrendingUp];
  const IconComponent = icons[index % icons.length];
  return <IconComponent className="w-8 h-8 text-secondary" />;
};

export default function ImpactSection({ stats }: ImpactSectionProps) {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white to-gray-50/50">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6">
            <FiTrendingUp className="w-4 h-4" />
            <span className="font-semibold text-sm uppercase tracking-wide">
              Impact en Guinée
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
            Rejoignez la communauté{" "}
            <span className="text-secondary">tech guinéenne</span>{" "}
            en pleine croissance
          </h1>
          
          <div className="mt-6 flex items-center justify-center">
            <div className="h-1 w-20 bg-secondary rounded-full"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-secondary/20 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center group-hover:bg-secondary/15 transition-colors duration-300">
                    {getStatIcon(index)}
                  </div>
                </div>
                
                {/* Value */}
                <div className="mb-4">
                  <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </h2>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-secondary/90 transition-colors duration-300">
                  {stat.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {stat.description}
                </p>
              </div>
              
              {/* Decorative Element */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-secondary/20 rounded-full group-hover:bg-secondary/40 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Prêt à faire partie de cette success story ?
          </p>
          <button className="group inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/25">
            Rejoindre la communauté
            <FiTrendingUp className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}