"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CourseTab } from "@/lib/db/schema";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FolderOpen,
  Plus,
  Loader2,
  AlertCircle,
  Settings,
  Calendar,
  Edit,
  Trash,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";
import { TabForm } from "./TabForm";
import { toast } from "sonner";
import { useCourseTabs } from "../hooks/useTabs";

interface CourseTabsProps {
  courseId: number;
  activeTabKey?: string;
  onTabChange?: (tabKey: string) => void;
}

export function CourseTabs({ courseId, activeTabKey, onTabChange }: CourseTabsProps) {
  const { tabs, isLoading, error, deleteTab, updateTab } = useCourseTabs({ courseId });
  const [isTabDialogOpen, setIsTabDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<CourseTab | null>(null);
  const [isManageModeOpen, setIsManageModeOpen] = useState(false);

  const sortedTabs = useMemo(() => {
    return Array.isArray(tabs)
      ? [...tabs].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
      : [];
  }, [tabs]);

  const activeTabs = useMemo(() => {
    return sortedTabs.filter((tab) => tab.isActive);
  }, [sortedTabs]);

  const handleOpenTabDialog = (tab: CourseTab | null = null) => {
    setSelectedTab(tab);
    setIsTabDialogOpen(true);
  };

  const handleDeleteTab = async (tabId: number, tabTitle: string) => {
    if (confirm(`Voulez-vous vraiment supprimer l'onglet "${tabTitle}" ?`)) {
      try {
        await deleteTab({ courseId, id: tabId });
        toast.success(`L'onglet "${tabTitle}" a été supprimé avec succès.`);
      } catch (error) {
        toast.error("Erreur lors de la suppression de l'onglet");
      }
    }
  };

  const handleToggleActive = async (tab: CourseTab) => {
    try {
      await updateTab({ courseId, id: tab.id, data: { ...tab, isActive: !tab.isActive } });
      toast.success(`L'onglet "${tab.title}" a été ${!tab.isActive ? "activé" : "désactivé"}.`);
    } catch (error) {
      toast.error("Erreur lors de la modification de l'onglet");
    }
  };

  console.log("Onglets chargés :", sortedTabs);

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation des onglets actifs */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Sections du cours</h2>
            <Badge variant="secondary" className="ml-2">
              {activeTabs.length} actif{activeTabs.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setIsManageModeOpen(!isManageModeOpen)}
            >
              <Settings className="h-4 w-4" />
              Gérer
            </Button>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => handleOpenTabDialog()}
              aria-label="Ajouter un onglet"
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </div>

        {/* Navigation des onglets */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Chargement des onglets...</span>
          </div>
        ) : error ? (
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
              Ce cours ne contient pas encore d'onglets actifs.
            </p>
            <Button
              size="sm"
              className="gap-2"
              onClick={() => handleOpenTabDialog()}
              aria-label="Créer le premier onglet"
            >
              <Plus className="h-4 w-4" />
              Créer le premier onglet
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <Tabs value={activeTabKey} onValueChange={onTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-auto">
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

      {/* Mode de gestion des onglets */}
      {isManageModeOpen && (
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Gestion des onglets</h3>
              <Badge variant="outline" className="ml-2">
                {sortedTabs.length} total
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsManageModeOpen(false)}>
              Fermer
            </Button>
          </div>

          {sortedTabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <FolderOpen className="h-8 w-8 text-muted-foreground mb-3" />
              <h4 className="font-medium mb-2">Aucun onglet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Commencez par créer votre premier onglet.
              </p>
              <Button size="sm" className="gap-2" onClick={() => handleOpenTabDialog()}>
                <Plus className="h-4 w-4" />
                Créer un onglet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedTabs.map((tab, index) => (
                <div
                  key={tab.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    tab.isActive ? "bg-primary/5 border-primary/20" : "bg-background hover:bg-accent/50"
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
                        <h4 className="font-medium">{tab.title}</h4>
                        <code className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                          {tab.key}
                        </code>
                        {tab.isActive && (
                          <Badge variant="secondary" className="text-xs">
                            Actif
                          </Badge>
                        )}
                      </div>
                      {tab.createdAt && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(tab.createdAt), "dd/MM/yyyy", { locale: fr })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={tab.isActive!}
                        onCheckedChange={() => handleToggleActive(tab)}
                        aria-label={`${tab.isActive ? "Désactiver" : "Activer"} l'onglet ${tab.title}`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {tab.isActive ? "Visible" : "Masqué"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenTabDialog(tab)}
                        aria-label={`Modifier l'onglet ${tab.title}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTab(tab.id, tab.title)}
                        aria-label={`Supprimer l'onglet ${tab.title}`}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dialogue pour créer/modifier un onglet */}
      <Dialog open={isTabDialogOpen} onOpenChange={setIsTabDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTab ? "Modifier l'onglet" : "Créer un onglet"}</DialogTitle>
          </DialogHeader>
          <TabForm
            tab={selectedTab}
            courseId={courseId}
            onSuccess={() => {
              setIsTabDialogOpen(false);
              setSelectedTab(null);
            }}
            onCancel={() => {
              setIsTabDialogOpen(false);
              setSelectedTab(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
