"use client";

import * as React from "react";
import Link from "next/link";
import { Course } from "@/lib/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { BookOpen, Plus } from "lucide-react";
import { useCourses } from "@/features/courses/hooks/useCourses";
import { CourseForm } from "@/features/courses/components/CourseForm";
import { CourseCard } from "@/features/courses/components/CourseCard";

export default function CoursesPage() {
  const [page, setPage] = React.useState(1);
  const [perPage, setPerPage] = React.useState(10);
  const [isActiveFilter, setIsActiveFilter] = React.useState<string | undefined>(
    undefined
  );
  const [titleFilter, setTitleFilter] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editCourse, setEditCourse] = React.useState<Course | null>(null);

  const { courses, isLoading, error, refetch } = useCourses({
    page,
    per_page: perPage,
    filters: {
      isActive:
        isActiveFilter === "true"
          ? true
          : isActiveFilter === "false"
          ? false
          : undefined,
      title: titleFilter || undefined,
    },
  });

  // Calculer le nombre total de pages
  const totalCourses = courses?.total || courses?.courses.length || 0; // Utiliser total si disponible
  const totalPages = Math.ceil(totalCourses / perPage);

  // Gérer le changement de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      refetch();
    }
  };

  // Gérer le changement de filtre
  const handleFilterChange = () => {
    setPage(1); // Réinitialiser à la première page
    refetch();
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* En-tête */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Cours</h1>
          <p className="text-muted-foreground">
            Consultez, créez, et gérez vos cours.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button
            variant="default"
            onClick={() => {
              setEditCourse(null); // Réinitialiser pour création
              setIsDialogOpen(true);
            }}
            aria-label="Créer un nouveau cours"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un cours
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editCourse ? "Modifier le Cours" : "Créer un Nouveau Cours"}
              </DialogTitle>
            </DialogHeader>
            <CourseForm
              course={editCourse}
              onSuccess={() => {
                setIsDialogOpen(false);
                setEditCourse(null);
                refetch();
              }}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditCourse(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </header>

      {/* Filtres */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par titre..."
            value={titleFilter}
            onChange={(e) => {
              setTitleFilter(e.target.value);
              handleFilterChange();
            }}
            aria-label="Filtrer les cours par titre"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={isActiveFilter}
            onValueChange={(value) => {
              setIsActiveFilter(value === "all" ? undefined : value);
              handleFilterChange();
            }}
          >
            <SelectTrigger aria-label="Filtrer par état">
              <SelectValue placeholder="Tous les états" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les états</SelectItem>
              <SelectItem value="true">Actifs</SelectItem>
              <SelectItem value="false">Inactifs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Liste des Cours */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading && (
          <div className="col-span-full text-center text-muted-foreground">
            Chargement...
          </div>
        )}
        {error && (
          <div className="col-span-full text-center text-destructive">
            Erreur : {error.message}
          </div>
        )}
        {!isLoading && !error && !courses?.courses.length && (
          <div className="col-span-full text-center text-muted-foreground">
            Aucun cours trouvé.
          </div>
        )}
        {!isLoading &&
          !error &&
          courses?.courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => {
                setEditCourse(course);
                setIsDialogOpen(true);
              }}
              onDelete={refetch}
            />
          ))}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(page - 1)}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => handlePageChange(page + 1)}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </section>
      )}
    </div>
  );
}
