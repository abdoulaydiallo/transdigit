"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";
import { PhoneInput } from "@/components/PhoneInput";
import { courses } from "@/data/homeData";
import { Course } from "@/types/home";

// Créer un schéma Zod dynamique basé sur les cours disponibles
const courseValues = courses.map((course) => course.link.replace("/", "")) as [
  string,
  ...string[]
];
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit contenir au moins 2 caractères." })
    .max(40, { message: "Le prénom ne peut pas dépasser 40 caractères." }),
  lastName: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." })
    .max(40, { message: "Le nom ne peut pas dépasser 40 caractères." }),
  phoneNumber: z
    .string()
    .regex(/^\+224[0-9]{8,9}$/, {
      message: "Veuillez entrer un numéro de téléphone guinéen valide (ex. +224 622 123 456).",
    }),
  email: z.string().email({ message: "Veuillez entrer une adresse e-mail valide." }),
  course: z.enum(courseValues, {
    message: "Veuillez sélectionner un cours.",
  }),
  receiveUpdates: z.boolean().optional(),
  acceptPrivacyPolicy: z.literal(true, {
    message: "Vous devez accepter la politique de confidentialité.",
  }),
});

// Types pour les props du composant
interface ApplicationFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  courseOptions?: { value: string; label: string }[];
  defaultValues?: Partial<z.infer<typeof formSchema>>;
}

export function ApplicationForm({
  onSubmit = (values) => console.log(values),
  courseOptions = courses.map((course: Course) => ({
    value: course.link.replace("/", ""),
    label: course.title,
  })),
  defaultValues = {},
}: ApplicationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      course: undefined,
      receiveUpdates: true,
      acceptPrivacyPolicy: false, // Pré-coché par défaut
      ...defaultValues,
    } as any,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8 space-y-2"
        aria-labelledby="application-form"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
              <FormLabel className="sm:w-1/4 text-sm font-bold text-gray-900">
                Prénom *
              </FormLabel>
              <div className="w-full sm:w-3/4">
                <FormControl>
                  <Input
                    className="bg-[#f2f2f2] border-none focus-visible:ring-[#670BFF] focus-visible:ring-2"
                    placeholder="Mamadou"
                    {...field}
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage className="text-[#670BFF] text-sm mt-1" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
              <FormLabel className="sm:w-1/4 text-sm font-bold text-gray-900">
                Nom *
              </FormLabel>
              <div className="w-full sm:w-3/4">
                <FormControl>
                  <Input
                    className="bg-[#f2f2f2] border-none focus-visible:ring-[#670BFF] focus-visible:ring-2"
                    placeholder="Diallo"
                    {...field}
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage className="text-[#670BFF] text-sm mt-1" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
              <FormLabel className="sm:w-1/4 text-sm font-bold text-gray-900">
                Téléphone *
              </FormLabel>
              <div className="w-full sm:w-3/4">
                <FormControl>
                  <PhoneInput
                    className="bg-[#f2f2f2] border-none focus-visible:ring-[#670BFF] focus-visible:ring-2"
                    placeholder="+224 600 123 456"
                    {...field}
                    aria-required="true"
                    defaultCountry="GN"
                    countryCallingCodeEditable={false}
                  />
                </FormControl>
                <FormMessage className="text-[#670BFF] text-sm mt-1" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
              <FormLabel className="sm:w-1/4 text-sm font-bold text-gray-900">
                Email *
              </FormLabel>
              <div className="w-full sm:w-3/4">
                <FormControl>
                  <Input
                    className="bg-[#f2f2f2] border-none focus-visible:ring-[#670BFF] focus-visible:ring-2"
                    placeholder="mamadou.diallo@exemple.com"
                    {...field}
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage className="text-[#670BFF] text-sm mt-1" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem className="flex flex-col sm:flex-row sm:items-center gap-2">
              <FormLabel className="sm:w-1/4 text-sm font-bold text-gray-900">
                Cours *
              </FormLabel>
              <div className="w-full sm:w-3/4">
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    aria-required="true"
                  >
                    <SelectTrigger className="bg-[#f2f2f2] border-none focus-visible:ring-[#670BFF] focus-visible:ring-2">
                      <SelectValue placeholder="Sélectionnez un cours" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-[#670BFF] text-sm mt-1" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="receiveUpdates"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Input
                  type="checkbox"
                  className="h-4 w-4 bg-[#f2f2f2] border-none focus-visible:ring-[#670BFF] focus-visible:ring-2"
                  {...field}
                  value={field.value ? "true" : "false"}
                  onChange={(e) => field.onChange(e.target.checked)}
                  aria-describedby="receive-updates-error"
                />
              </FormControl>
              <FormLabel className="text-sm text-gray-900">
                Recevoir des nouvelles sur les programmes et événements
              </FormLabel>
              <FormMessage id="receive-updates-error" className="text-[#670BFF] text-sm mt-1" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptPrivacyPolicy"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Input
                  type="checkbox"
                  className="h-4 w-4 bg-[#f2f2f2] border-none focus-visible:ring-[#670BFF] focus-visible:ring-2"
                  {...field}
                  value={field.value ? "true" : "false"}
                  onChange={(e) => field.onChange(e.target.checked)}
                  aria-required="true"
                  aria-describedby="privacy-policy-error"
                />
              </FormControl>
              <FormLabel className="text-sm text-gray-900">
                J'accepte la{" "}
                <a
                  href="#privacy-policy"
                  className="text-[#670BFF] hover:underline"
                  aria-label="Politique de confidentialité de Goulotech"
                >
                  politique de confidentialité
                </a>{" "}
                *
              </FormLabel>
              <FormMessage id="privacy-policy-error" className="text-[#670BFF] text-sm mt-1" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className=" bg-[#670BFF] hover:bg-[#5208CC] text-white px-4 py-2 rounded-md flex items-center gap-2"
          aria-label="Soumettre la candidature"
        >
          Commencer <ArrowRight size={18} />
        </Button>
      </form>
    </Form>
  );
}