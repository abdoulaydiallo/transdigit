"use client";

import CourseDetails from "@/features/courses/components/CourseDetails";
import { useParams } from "next/navigation";

export default function CourseDetailsPage(){
    const params = useParams();
    const courseId = Number(params?.id);
    
    return <CourseDetails courseId={courseId} />;
}