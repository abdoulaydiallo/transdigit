'use client';

import { useCallback, useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { NotionBlock } from '@/types/Editor';
import { cn } from '@/lib/utils';
import { NOTION_BLOCKS } from './NotioBlocks';

interface SlashMenuProps {
  editor: Editor | null;
  show: boolean;
  position: { top: number; left: number };
  selectedBlockIndex: number;
  setSelectedBlockIndex: (index: number | any) => void;
  setShowSlashMenu: (show: boolean) => void;
  setShowImageDialog: (show: boolean) => void;
  cursorPositionRef: React.MutableRefObject<number | null>;
  slashMenuRef: React.MutableRefObject<HTMLDivElement | null>;
}

export function SlashMenu({
  editor,
  show,
  position,
  selectedBlockIndex,
  setSelectedBlockIndex,
  setShowSlashMenu,
  setShowImageDialog,
  cursorPositionRef,
  slashMenuRef,
}: SlashMenuProps) {
  // Suivi du mode de navigation (clavier ou souris)
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);

  // Gestion des commandes slash
  const handleSlashCommand = useCallback(
    (block: NotionBlock) => {
      if (!editor) return;
      if (block.id === 'image') {
        setShowImageDialog(true);
      } else {
        block.action(editor);
        setShowSlashMenu(false);
        setSelectedBlockIndex(-1);
        if (cursorPositionRef.current) {
          editor.chain().focus().setTextSelection(cursorPositionRef.current).run();
        }
      }
    },
    [editor, setShowSlashMenu, setSelectedBlockIndex, setShowImageDialog, cursorPositionRef]
  );

  // Gestion du clavier pour le menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!show) return;
      setIsKeyboardNav(true); // Activer la navigation clavier

      if (event.key === 'Escape') {
        setShowSlashMenu(false);
        setSelectedBlockIndex(-1);
        if (editor && cursorPositionRef.current) {
          editor.chain().focus().setTextSelection(cursorPositionRef.current).run();
        }
        return;
      }
      if (event.key === 'ArrowDown') {
        setSelectedBlockIndex((prev: number) => Math.min(prev + 1, NOTION_BLOCKS.length - 1));
        return;
      }
      if (event.key === 'ArrowUp') {
        setSelectedBlockIndex((prev: number) => Math.max(prev - 1, 0));
        return;
      }
      if (event.key === 'Enter' && selectedBlockIndex >= 0) {
        const block = NOTION_BLOCKS[selectedBlockIndex];
        if (block) {
          handleSlashCommand(block);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, editor, selectedBlockIndex, handleSlashCommand, setShowSlashMenu, setSelectedBlockIndex, cursorPositionRef]);

  // Réinitialiser la navigation clavier lors du clic/survol
  const handleMouseInteraction = useCallback(() => {
    setIsKeyboardNav(false);
  }, []);

  if (!show) return null;

  return (
    <Popover open={show}>
      <PopoverTrigger asChild>
        <div
          className="absolute"
          style={{
            top: position.top,
            left: position.left,
          }}
        />
      </PopoverTrigger>
      <PopoverContent
        ref={slashMenuRef}
        className={cn(
          'bg-white rounded-lg shadow-lg w-60 max-h-60 overflow-y-auto',
          'focus:outline-none transition-all duration-200 ease-out',
          'px-1'
        )}
        style={{
          transform: show ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
          opacity: show ? 1 : 0,
        }}
        align="start"
        side="bottom"
        role="menu"
        aria-label="Menu de sélection de blocs"
        aria-activedescendant={
          selectedBlockIndex >= 0 ? `slash-block-${NOTION_BLOCKS[selectedBlockIndex].id}` : undefined
        }
      >
        <div className="p-1">
          {Object.entries(
            NOTION_BLOCKS.reduce<Record<string, NotionBlock[]>>((acc, block) => {
              const group = block.group;
              acc[group] = acc[group] || [];
              acc[group].push(block);
              return acc;
            }, {})
          ).map(([groupName, groupBlocks]) => (
            <div key={groupName}>
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground tracking-wide">
                {groupName}
              </div>
              {groupBlocks.map((block, index) => (
                <div
                  key={block.id}
                  id={`slash-block-${block.id}`}
                  className={cn(
                    'w-full flex items-center gap-2 justify-start p-1.5 text-left h-auto rounded-md  cursor-pointer',
                    'hover:bg-muted hover:text-primary-foreground transition-colors',
                    index === selectedBlockIndex && ''
                  )}
                  onClick={() => {
                    handleMouseInteraction();
                    handleSlashCommand(block);
                  }}
                  onMouseEnter={() => {
                    if (!isKeyboardNav) {
                      setSelectedBlockIndex(index);
                    }
                  }}
                  aria-label={`Ajouter ${block.title}`}
                >
                  <div className="flex items-center justify-center w-6 h-6 bg-muted rounded-md text-muted-foreground">
                    {block.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-xs text-foreground">
                      {block.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {block.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}