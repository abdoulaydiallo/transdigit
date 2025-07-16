"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ApplicationForm } from "./ApplyForm";

interface CourseApplicationDialogProps {
  courseKey: string;
  courseTitle: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit?: (values: any) => void;
}

export function CourseApplicationDialog({
  courseKey,
  courseTitle,
  isOpen,
  setIsOpen,
  onSubmit,
}: CourseApplicationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Commancer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Postuler pour {courseTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Colonne de présentation */}
          <div className="space-y-6 hidden md:block">
            <h3 className="text-lg font-semibold text-gray-900">
              Obtenez une vue détaillée de notre cours
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#670BFF]" />
                <span className="text-gray-700">Comprendre l'objectif du bootcamp</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#670BFF]" />
                <span className="text-gray-700">En savoir plus sur le cours</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-[#670BFF]" />
                <span className="text-gray-700">Découvrir notre méthodologie</span>
              </li>
            </ul>
            <p className="text-gray-600">
              Cette candidature prend moins de 5 minutes. Notre équipe vous contactera pour un entretien de 30 minutes.
            </p>
          </div>
          {/* Colonne du formulaire */}
          <div>
            <ApplicationForm
              onSubmit={onSubmit}
              defaultValues={{ course: courseKey }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}