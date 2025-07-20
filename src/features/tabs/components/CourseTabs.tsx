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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

  const TabCard = ({ tab, index }: { tab: CourseTab; index: number }) => (
    <div
      className={`group relative rounded-xl border transition-all duration-200 hover:shadow-md ${
        tab.isActive 
          ? "bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 shadow-sm" 
          : "bg-card hover:bg-accent/30"
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Handle de déplacement */}
            <div className="flex items-center gap-2 shrink-0">
              <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground cursor-move transition-colors" />
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                tab.isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {index + 1}
              </div>
            </div>
            
            {/* Contenu principal */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold text-base truncate">{tab.title}</h4>
                <code className="text-xs bg-muted/50 px-2 py-1 rounded-md text-muted-foreground font-mono">
                  {tab.key}
                </code>
                {tab.isActive && (
                  <Badge variant="default" className="text-xs shrink-0">
                    <Eye className="h-3 w-3 mr-1" />
                    Actif
                  </Badge>
                )}
              </div>
              
              {tab.createdAt && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Créé le {format(new Date(tab.createdAt), "dd MMMM yyyy", { locale: fr })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Toggle switch sur desktop */}
            <div className="hidden sm:flex items-center gap-2">
              <Switch
                checked={tab.isActive!}
                onCheckedChange={() => handleToggleActive(tab)}
                aria-label={`${tab.isActive ? "Désactiver" : "Activer"} l'onglet ${tab.title}`}
              />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {tab.isActive ? "Visible" : "Masqué"}
              </span>
            </div>

            {/* Menu actions pour mobile */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleToggleActive(tab)}>
                    {tab.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Masquer l'onglet
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Afficher l'onglet
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenTabDialog(tab)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteTab(tab.id, tab.title)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Boutons d'action desktop */}
            <div className="hidden sm:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleOpenTabDialog(tab)}
                aria-label={`Modifier l'onglet ${tab.title}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteTab(tab.id, tab.title)}
                aria-label={`Supprimer l'onglet ${tab.title}`}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête principal */}
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Sections du cours</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {activeTabs.length} actif{activeTabs.length !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {sortedTabs.length} total
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 transition-all hover:scale-105"
              onClick={() => setIsManageModeOpen(!isManageModeOpen)}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Gérer</span>
              {isManageModeOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="sm"
              className="gap-2 transition-all hover:scale-105"
              onClick={() => handleOpenTabDialog()}
              aria-label="Ajouter un onglet"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </Button>
          </div>
        </div>

        {/* Navigation des onglets */}
        <div className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Chargement des onglets...</p>
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreur de chargement</AlertTitle>
              <AlertDescription>
                Impossible de charger les onglets du cours. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          ) : activeTabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted/50 p-6 mb-4">
                <FolderOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucun onglet actif</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Ce cours ne contient pas encore d'onglets actifs. Créez votre premier onglet pour commencer.
              </p>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => handleOpenTabDialog()}
                aria-label="Créer le premier onglet"
              >
                <Plus className="h-5 w-5" />
                Créer le premier onglet
              </Button>
            </div>
          ) : (
            <Tabs value={activeTabKey} onValueChange={onTabChange} className="w-full">
              <ScrollArea className="w-full">
                <TabsList className={`inline-flex h-12 items-center justify-start rounded-lg bg-muted p-1 gap-1 ${
                  activeTabs.length > 4 ? 'w-max' : 'w-full grid'
                }`} style={{
                  gridTemplateColumns: activeTabs.length <= 4 ? `repeat(${activeTabs.length}, 1fr)` : undefined
                }}>
                  {activeTabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.key} 
                      value={tab.key} 
                      className="flex items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <span className="truncate max-w-32 sm:max-w-none">{tab.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </Tabs>
          )}
        </div>
      </div>

      {/* Mode de gestion des onglets */}
      {isManageModeOpen && (
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 border-b bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Gestion des onglets</h3>
                <p className="text-sm text-muted-foreground">
                  Organisez, modifiez et gérez la visibilité de vos onglets
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsManageModeOpen(false)}
              className="self-start sm:self-auto"
            >
              Fermer
            </Button>
          </div>

          <div className="p-4 sm:p-6">
            {sortedTabs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted/50 p-4 mb-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold mb-2">Aucun onglet créé</h4>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  Commencez par créer votre premier onglet pour structurer votre cours.
                </p>
                <Button size="default" className="gap-2" onClick={() => handleOpenTabDialog()}>
                  <Plus className="h-4 w-4" />
                  Créer un onglet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Glissez-déposez les onglets pour les réorganiser
                  </p>
                  <Button size="sm" variant="outline" className="gap-2 self-start sm:self-auto">
                    <Plus className="h-4 w-4" />
                    Nouvel onglet
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {sortedTabs.map((tab, index) => (
                    <TabCard key={tab.id} tab={tab} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialogue pour créer/modifier un onglet */}
      <Dialog open={isTabDialogOpen} onOpenChange={setIsTabDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedTab ? "Modifier l'onglet" : "Créer un nouvel onglet"}
            </DialogTitle>
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