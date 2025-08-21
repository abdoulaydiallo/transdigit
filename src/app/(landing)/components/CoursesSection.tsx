import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { FiArrowRight, FiClock, FiStar, FiPlay } from "react-icons/fi";
import { Course } from "@/types/home";

interface CoursesSectionProps {
  courses: Course[];
}

export default function CoursesSection({ courses }: CoursesSectionProps) {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50/30 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
       

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {courses.map((course, index) => (
            <div key={course.title} className="group">
              <Card className="relative h-full bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-secondary/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 py-0">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={course.imageSrc}
                    alt={course.imageAlt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-semibold text-gray-800">4.8</span>
                  </div>
                  
                  {/* Play Button */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/90 transition-colors">
                      <FiPlay className="w-4 h-4 text-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="">
                    <CardTitle className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-secondary transition-colors duration-300">
                      {course.title}
                    </CardTitle>
                    
                    {/* Course Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        <span>2-4 mois</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Débutant</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-0 flex-grow">
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                  </CardContent>

                  <CardFooter className="p-0 py-2">
                    <Link href={course.link} className="w-full">
                      <Button 
                        variant="outline" 
                        className="w-full group/btn border-gray-200 hover:border-secondary hover:bg-secondary hover:text-white font-medium rounded-xl transition-all duration-300"
                      >
                        Voir les détails
                        <FiArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-32 left-10 w-4 h-4 bg-secondary/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 right-10 w-6 h-6 border-2 border-secondary/15 rounded-lg rotate-45 animate-bounce"></div>
    </section>
  );
}