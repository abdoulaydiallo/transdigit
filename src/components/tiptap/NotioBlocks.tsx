import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Pilcrow, Heading1, Heading2, List, ListOrdered, Image as ImageIcon, Code } from 'lucide-react';
import { NotionBlock } from '@/types/Editor';
import { cn } from '@/lib/utils';

enum BlockGroup {
  BASIC = 'Basique',
  FORMATTING = 'Formatage',
  MEDIA = 'Média',
}

export const NOTION_BLOCKS: NotionBlock[] = [
  {
    id: 'text',
    type: 'paragraph',
    icon: <Pilcrow className="w-4 h-4" />,
    title: 'Texte',
    description: 'Texte simple pour écrire.',
    keywords: ['texte', 'paragraphe'],
    action: (editor: Editor) => editor.chain().focus().setParagraph().run(),
    group: BlockGroup.BASIC,
  },
  {
    id: 'heading1',
    type: 'heading',
    icon: <Heading1 className="w-4 h-4" />,
    title: 'Titre 1',
    description: 'Grand titre de section.',
    keywords: ['titre', 'h1'],
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    group: BlockGroup.FORMATTING,
  },
  {
    id: 'heading2',
    type: 'heading',
    icon: <Heading2 className="w-4 h-4" />,
    title: 'Titre 2',
    description: 'Titre moyen.',
    keywords: ['titre', 'h2'],
    action: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    group: BlockGroup.FORMATTING,
  },
  {
    id: 'bulletList',
    type: 'bulletList',
    icon: <List className="w-4 h-4" />,
    title: 'Liste à puces',
    description: 'Liste avec puces.',
    keywords: ['liste', 'puces'],
    action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
    group: BlockGroup.BASIC,
  },
  {
    id: 'numberedList',
    type: 'orderedList',
    icon: <ListOrdered className="w-4 h-4" />,
    title: 'Liste numérotée',
    description: 'Liste avec numéros.',
    keywords: ['liste', 'numérotée'],
    action: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
    group: BlockGroup.BASIC,
  },
  {
    id: 'image',
    type: 'image',
    icon: <ImageIcon className="w-4 h-4" />,
    title: 'Image',
    description: 'Ajouter une image via URL.',
    keywords: ['image', 'photo'],
    action: () => {}, // Géré via dialogue
    group: BlockGroup.MEDIA,
  },
  {
    id: 'code',
    type: 'codeBlock',
    icon: <Code className="w-4 h-4" />,
    title: 'Code',
    description: 'Bloc de code avec coloration.',
    keywords: ['code', 'programmation'],
    action: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
    group: BlockGroup.MEDIA,
  },
];
