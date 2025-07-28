'use client';

import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
} from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor | null;
  show: boolean;
  position: { top: number; left: number };
  floatingMenuRef: React.MutableRefObject<HTMLDivElement | null>;
  setShowLinkDialog: (show: boolean) => void;
}

interface FloatingButtonProps {
  onClick: () => void;
  isActive: boolean;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
}

function FloatingButton({ onClick, isActive, title, ariaLabel, children }: FloatingButtonProps) {
  return (
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      size="sm"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className="p-1.5"
    >
      {children}
    </Button>
  );
}

export function FloatingToolbar({
  editor,
  show,
  position,
  floatingMenuRef,
  setShowLinkDialog,
}: FloatingToolbarProps) {
  if (!show || !editor) return null;

  return (
    <div
      ref={floatingMenuRef}
      className="absolute z-50 flex items-center bg-white border border-gray-100 rounded-lg px-1 py-1"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-30%)',
        transition: 'all 0.2s ease-out',
      }}
      role="toolbar"
      aria-label="Barre d'outils de formatage"
    >
      <FloatingButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Gras (Ctrl+B)"
        ariaLabel="Mettre en gras"
      >
        <Bold className="w-4 h-4" />
      </FloatingButton>
      <FloatingButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italique (Ctrl+I)"
        ariaLabel="Mettre en italique"
      >
        <Italic className="w-4 h-4" />
      </FloatingButton>
      <FloatingButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Souligné (Ctrl+U)"
        ariaLabel="Souligner"
      >
        <UnderlineIcon className="w-4 h-4" />
      </FloatingButton>
      <FloatingButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Barré"
        ariaLabel="Barrer"
      >
        <Strikethrough className="w-4 h-4" />
      </FloatingButton>
      <FloatingButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        title="Surligner"
        ariaLabel="Surligner le texte"
      >
        <Highlighter className="w-4 h-4" />
      </FloatingButton>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <FloatingButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Aligner à gauche"
        ariaLabel="Aligner le texte à gauche"
      >
        <AlignLeft className="w-4 h-4" />
      </FloatingButton>
      <FloatingButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Centrer"
        ariaLabel="Centrer le texte"
      >
        <AlignCenter className="w-4 h-4" />
      </FloatingButton>
      <FloatingButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Aligner à droite"
        ariaLabel="Aligner le texte à droite"
      >
        <AlignRight className="w-4 h-4" />
      </FloatingButton>
      <FloatingButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
        title="Justifier"
        ariaLabel="Justifier le texte"
      >
        <AlignJustify className="w-4 h-4" />
      </FloatingButton>
      <div className="w-px h-5 bg-gray-200 mx-1" />
      <FloatingButton
        onClick={() => setShowLinkDialog(true)}
        isActive={editor.isActive('link')}
        title="Lien (Ctrl+K)"
        ariaLabel="Ajouter un lien"
      >
        <LinkIcon className="w-4 h-4" />
      </FloatingButton>
    </div>
  );
}