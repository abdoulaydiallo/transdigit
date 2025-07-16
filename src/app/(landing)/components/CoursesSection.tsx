import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from "@/types/home";

interface CoursesSectionProps {
  courses: Course[];
}

export default function CoursesSection({ courses }: CoursesSectionProps) {
  return (
    <div className="mb-12 lg:mb-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-dense gap-4">
      {courses.map((course) => (
        <Card key={course.title} className="flex flex-row md:flex-col hover:shadow-md overflow-hidden my-0 p-0">
          <div className="relative h-24 w-32 md:h-44 md:w-full rounded-l-xl md:rounded-t-xl md:rounded-l-none overflow-hidden flex-shrink-0">
            <Image
              src={course.imageSrc}
              alt={course.imageAlt}
              fill
              className="h-16 w-24 md:h-44 md:w-full rounded-l-xl md:rounded-t-xl md:rounded-bl-none object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col pb-4 px-4 md:px-0">
            <CardTitle className="text-xl pt-4 md:py-0 md:px-6 font-bold w-full line-clamp-1">{course.title}</CardTitle>
            <CardContent className="hidden md:block px-6 ">
              <p className="text-sm pb-4 ">{course.description}</p>
            </CardContent>
            <CardFooter className="p-0 md:px-6 pt-0">
              <Link href={course.link}>
                <Button variant="outline">
                  {course.title} <ArrowRight size={4} />
                </Button>
              </Link>
            </CardFooter>
          </div>
        </Card>
      ))}
    </div>
  );
}