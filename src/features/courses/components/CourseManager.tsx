"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CourseSection, CourseTab } from "@/lib/db/schema";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  FolderOpen,
  Plus,
  Loader2,
  AlertCircle,
  Settings,
  Calendar,
  Edit,
  Trash,
  GripVertical,
} from "lucide-react";
import { SectionForm } from "../../sections/components/SectionForm";
import { TabForm } from "../../tabs/components/TabForm";
import { toast } from "sonner";
import { useCourseSections } from "../../sections/hooks/useCourseSections";
import { useCourseTabs } from "../../tabs/hooks/useTabs";
import { motion, AnimatePresence } from "framer-motion";

interface CourseManagerProps {
  courseId: number;
}

type Item = CourseSection | CourseTab;

export function CourseManager({ courseId }: CourseManagerProps) {
  const { sections, isLoading: sectionsLoading, error: sectionsError, deleteSection } = useCourseSections({ courseId });
  const { tabs, isLoading: tabsLoading, error: tabsError, deleteTab, updateTab } = useCourseTabs({ courseId });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"section" | "tab" | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isManageModeOpen, setIsManageModeOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState<string | undefined>(undefined);

  const sortedTabs = useMemo(() => {
    return Array.isArray(tabs)
      ? [...tabs].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
      : [];
  }, [tabs]);

  const activeTabs = useMemo(() => {
    const active = sortedTabs.filter((tab) => tab.isActive);
    if (!activeTabKey && active.length > 0) {
      setActiveTabKey(active[0].key);
    }
    return active;
  }, [sortedTabs, activeTabKey]);

  const sortedSections = useMemo(() => {
    return Array.isArray(sections)
      ? [...sections]
          .filter((section) => section.tabKey === activeTabKey)
          .sort((a, b) => (a.id || 0) - (b.id || 0))
      : [];
  }, [sections, activeTabKey]);

  const handleOpenDialog = (type: "section" | "tab", item: Item | null = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (type: "section" | "tab", itemId: number, itemTitle: string) => {
    if (confirm(`Voulez-vous vraiment supprimer ${type === "tab" ? "l'onglet" : "la section"} "${itemTitle}" ?`)) {
      try {
        if (type === "tab") {
          await deleteTab({ courseId, id: itemId });
          if (activeTabKey === (selectedItem as CourseTab)?.key) {
            setActiveTabKey(activeTabs[0]?.key);
          }
        } else {
          await deleteSection({ courseId, id: itemId });
        }
        toast.success(`${type === "tab" ? "L'onglet" : "La section"} "${itemTitle}" a été supprimée avec succès.`);
      } catch (error) {
        toast.error(`Erreur lors de la suppression ${type === "tab" ? "de l'onglet" : "de la section"}`);
      }
    }
  };

  const handleToggleActive = async (tab: CourseTab) => {
    try {
      await updateTab({ courseId, id: tab.id, data: { ...tab, isActive: !tab.isActive } });
      toast.success(`L'onglet "${tab.title}" a été ${!tab.isActive ? "activé" : "désactivé"}.`);
      if (!tab.isActive && activeTabKey === tab.key) {
        setActiveTabKey(activeTabs[0]?.key);
      }
    } catch (error) {
      toast.error("Erreur lors de la modification de l'onglet");
    }
  };

  const renderItem = (item: Item, index: number, type: "section" | "tab") => {
    const isTab = type === "tab";
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
          isTab && (item as CourseTab).isActive ? "bg-primary/5 border-primary/20" : "bg-background hover:bg-accent/50"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
              {index + 1}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">{item.title}</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                {isTab ? (item as CourseTab).key : (item as CourseSection).tabKey}
              </code>
              {isTab && (item as CourseTab).isActive && (
                <Badge variant="secondary" className="text-xs">
                  Actif
                </Badge>
              )}
            </div>
            {item.createdAt && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(item.createdAt), "dd/MM/yyyy", { locale: fr })}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isTab && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={(item as CourseTab).isActive!}
                      onCheckedChange={() => handleToggleActive(item as CourseTab)}
                      aria-label={`${(item as CourseTab).isActive ? "Désactiver" : "Activer"} l'onglet ${item.title}`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {(item as CourseTab).isActive ? "Visible" : "Masqué"}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {(item as CourseTab).isActive ? "Masquer l'onglet" : "Afficher l'onglet"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div className="flex items-center gap-1 ml-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenDialog(type, item)}
                    aria-label={`Modifier ${isTab ? "l'onglet" : "la section"} ${item.title}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Modifier</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover

:text-destructive"
                    onClick={() => handleDeleteItem(type, item.id, item.title)}
                    aria-label={`Supprimer ${isTab ? "l'onglet" : "la section"} ${item.title}`}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Supprimer</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* En-tête principal avec navigation des onglets */}
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Gestion du cours</h2>
              <Badge variant="secondary" className="ml-2">
                {activeTabs.length} onglet{activeTabs.length !== 1 ? "s" : ""} actif
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsManageModeOpen(!isManageModeOpen)}
                  >
                    <Settings className="h-4 w-4" />
                    Gérer
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Gérer les onglets et sections</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleOpenDialog("tab")}
                    aria-label="Ajouter un onglet"
                  >
                    <Plus className="h-4 w-4" />
                    Onglet
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ajouter un nouvel onglet</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleOpenDialog("section")}
                    aria-label="Ajouter une section"
                    disabled={!activeTabKey}
                  >
                    <Plus className="h-4 w-4" />
                    Section
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {activeTabKey
                    ? "Ajouter une nouvelle section"
                    : "Sélectionnez un onglet pour ajouter une section"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Navigation des onglets actifs */}
          {tabsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Chargement des onglets...</span>
            </div>
          ) : tabsError ? (
            <Alert variant="destructive" className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>Impossible de charger les onglets du cours.</AlertDescription>
            </Alert>
          ) : activeTabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun onglet actif</h3>
              <p className="text-muted-foreground mb-4">
                Créez un onglet pour commencer à organiser vos sections.
              </p>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => handleOpenDialog("tab")}
                aria-label="Créer le premier onglet"
              >
                <Plus className="h-4 w-4" />
                Créer le premier onglet
              </Button>
            </div>
          ) : (
            <div className="p-4">
              <Tabs value={activeTabKey} onValueChange={setActiveTabKey} className="w-full">
                <TabsList className="grid w-full grid-cols-7 gap-2">
                  {activeTabs.map((tab) => (
                    <TabsTrigger key={tab.key} value={tab.key} className="flex items-center gap-2">
                      {tab.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {/* Sections associées à l'onglet actif */}
        {activeTabKey && (
          <div className="rounded-lg border bg-card">
            <div className="p-4">
              <h3 className="text-md font-semibold mb-4">
                Sections de l'onglet "{activeTabs.find((tab) => tab.key === activeTabKey)?.title}"
              </h3>
              {sectionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Chargement des sections...</span>
                </div>
              ) : sectionsError ? (
                <Alert variant="destructive" className="m-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>Impossible de charger les sections du cours.</AlertDescription>
                </Alert>
              ) : sortedSections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune section</h3>
                  <p className="text-muted-foreground mb-4">
                    Cet onglet ne contient pas encore de sections.
                  </p>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleOpenDialog("section")}
                    aria-label="Créer la première section"
                  >
                    <Plus className="h-4 w-4" />
                    Créer la première section
                  </Button>
                </div>
              ) : (
                <AnimatePresence>
                  {sortedSections.map((section, index) => renderItem(section, index, "section"))}
                </AnimatePresence>
              )}
            </div>
          </div>
        )}

        {/* Mode de gestion */}
        <AnimatePresence>
          {isManageModeOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-lg border bg-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Gestion des onglets et sections</h3>
                  <Badge variant="outline" className="ml-2">
                    {sortedTabs.length} onglet{sortedTabs.length !== 1 ? "s" : ""}, {sections?.length} section
                    {sections?.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsManageModeOpen(false)}>
                  Fermer
                </Button>
              </div>
              <div className="space-y-6">
                {/* Gestion des onglets */}
                <div>
                  <h4 className="font-medium mb-3">Onglets</h4>
                  {sortedTabs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FolderOpen className="h-8 w-8 text-muted-foreground mb-3" />
                      <h4 className="font-medium mb-2">Aucun onglet</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Commencez par créer votre premier onglet.
                      </p>
                      <Button size="sm" className="gap-2" onClick={() => handleOpenDialog("tab")}>
                        <Plus className="h-4 w-4" />
                        Créer un onglet
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedTabs.map((tab, index) => renderItem(tab, index, "tab"))}
                    </div>
                  )}
                </div>
                {/* Gestion des sections */}
                <div>
                  <h4 className="font-medium mb-3">Sections</h4>
                  {sections?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FolderOpen className="h-8 w-8 text-muted-foreground mb-3" />
                      <h4 className="font-medium mb-2">Aucune section</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Commencez par créer votre première section.
                      </p>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleOpenDialog("section")}
                        disabled={!activeTabKey}
                      >
                        <Plus className="h-4 w-4" />
                        Créer une section
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sections?.sort((a, b) => (a.id || 0) - (b.id || 0))
                        .map((section, index) => renderItem(section, index, "section"))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dialogue pour créer/modifier */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
          <DialogContent className={`${dialogType === "tab" ? "" : "sm:max-w-[900px] max-h-[80vh] overflow-y-auto rounded-none"} p-6`}>
            <DialogHeader>
              <DialogTitle>
                {selectedItem
                  ? `Modifier ${dialogType === "tab" ? "l'onglet" : "la section"}`
                  : `Créer ${dialogType === "tab" ? "un onglet" : "une section"}`}
              </DialogTitle>
            </DialogHeader>
            {dialogType === "tab" ? (
              <TabForm
                tab={selectedItem as CourseTab}
                courseId={courseId}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  setSelectedItem(null);
                  setDialogType(null);
                }}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setSelectedItem(null);
                  setDialogType(null);
                }}
              />
            ) : (
              <SectionForm
                section={selectedItem as CourseSection}
                courseId={courseId}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  setSelectedItem(null);
                  setDialogType(null);
                }}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setSelectedItem(null);
                  setDialogType(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}