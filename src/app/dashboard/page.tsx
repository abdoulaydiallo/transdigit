"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus } from "lucide-react";
import { useCourses } from "@/features/courses/hooks/useCourses";

export default function DashboardPage() {
  const { courses, isLoading, error } = useCourses({
    page: 1,
    per_page: 3, // Limiter à 3 cours pour l'aperçu
  });

  // Statistiques simulées (peut être remplacé par une requête API)
  const stats = {
    totalCourses: courses?.courses.length || 0,
    activeCourses: courses?.courses.filter((course) => course.isActive).length || 0,
    inactiveCourses: courses?.courses.filter((course) => !course.isActive).length || 0,
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* En-tête */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Bienvenue sur le Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Gérez vos cours, consultez les utilisateurs, et configurez les paramètres de votre plateforme.
        </p>
      </header>

      {/* Statistiques */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Cours</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Tous les cours enregistrés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Actifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.activeCourses}</div>
            <p className="text-xs text-muted-foreground">Cours actuellement actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours Inactifs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : stats.inactiveCourses}</div>
            <p className="text-xs text-muted-foreground">Cours archivés ou désactivés</p>
          </CardContent>
        </Card>
      </section>

      {/* Aperçu des Derniers Cours */}
      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Derniers Cours</h2>
          <Button variant="default" asChild>
            <Link href="/dashboard/courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Voir tous les cours
            </Link>
          </Button>
        </div>
        {isLoading && (
          <div className="text-center text-muted-foreground">Chargement...</div>
        )}
        {error && (
          <div className="text-center text-destructive">Erreur : {error.message}</div>
        )}
        {!isLoading && !error && courses?.courses.length === 0 && (
          <div className="text-center text-muted-foreground">Aucun cours trouvé.</div>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses?.courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge variant={course.isActive ? "default" : "secondary"}>
                  {course.isActive ? "Actif" : "Inactif"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description || "Aucune description disponible"}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Durée : {course.duration || "Non spécifiée"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Heures : {course.totalHours || "Non spécifié"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Actions Rapides */}
      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">Actions Rapides</h2>
        <div className="flex gap-4">
          <Button variant="default" asChild>
            <Link href="/dashboard/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              Créer un nouveau cours
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/users">Gérer les utilisateurs</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings">Configurer les paramètres</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

