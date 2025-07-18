"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Course } from "@/lib/db/schema";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useCourses } from "../hooks/useCourses";

type CourseCardProps = {
  course: Course & { link?: string };
  onEdit: () => void;
  onDelete: () => void;
};

export function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  const { deleteCourse } = useCourses();
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const handleDelete = async () => {
    try {
      await deleteCourse(course.id);
      onDelete();
      toast.success(`Le cours "${course.title}" a été supprimé avec succès.`);
    } catch (error) {
      toast.error("Erreur lors de la suppression du cours");
    }
    setIsAlertOpen(false);
  };

  return (
    <Card className="flex flex-row md:flex-col hover:shadow-md overflow-hidden my-0 p-0">
      <div className="relative h-24 w-32 md:h-44 md:w-full rounded-l-xl md:rounded-t-xl md:rounded-l-none overflow-hidden flex-shrink-0">
        <Link href={course.link || `/dashboard/courses/${course.id}`}>
          <Image
            src={course.imageSrc || "/placeholder.svg"}
            alt={course.title}
            fill
            className="h-24 w-32 md:h-44 md:w-full rounded-l-xl md:rounded-t-xl md:rounded-bl-none object-cover cursor-pointer"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
          />
        </Link>
        <Badge
          variant={course.isActive ? "destructive" : "secondary"}
          className="absolute top-2 left-2 w-fit"
        >
          {course.isActive ? "Actif" : "Inactif"}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              aria-label={`Actions pour le cours ${course.title}`}
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                  <AlertDialogDescription>
                    Voulez-vous vraiment supprimer le cours "{course.title}" ? Cette
                    action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col pb-4 px-4 md:px-0">
        <CardTitle className="text-xl pt-4 md:py-0 md:px-6 font-bold w-full line-clamp-1">
          <span>{course.title}</span>
        </CardTitle>
        <CardContent className="hidden md:block px-6">
          <p className="text-sm pb-4 line-clamp-2">
            {course.description || "Aucune description disponible"}
          </p>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Durée : {course.duration || "Non spécifiée"}
            </p>
            <p className="text-sm text-muted-foreground">
              Heures : {course.totalHours || "Non spécifié"}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
