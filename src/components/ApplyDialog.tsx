"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ApplicationForm, formSchema } from "./ApplyForm";
import { output } from "zod";
import { FiPackage } from "react-icons/fi";
import { FaRocket } from "react-icons/fa";

interface CourseApplicationDialogProps {
  courseKey: string;
  courseTitle: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit?: (values: output<typeof formSchema>) => void;
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
        <Button size="lg" className="group border-secondary/30 text-white hover:bg-secondary hover:text-white hover:border-secondary font-semibold px-8 py-4 h-auto rounded-xl transition-all duration-300"
        >
          <FaRocket className="w-5 h-5 mr-2" />
          Commancer
        </Button>
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
                <Check className="h-5 w-5 text-primary" />
                <span className="text-gray-700">Comprendre l&apos;objectif du bootcamp</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-gray-700">En savoir plus sur le cours</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
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
              courseTitle={courseTitle}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}