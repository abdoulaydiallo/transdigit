import { Editor } from '@tiptap/react';

export enum BlockGroup {
  BASIC = 'Basique',
  FORMATTING = 'Formatage',
  MEDIA = 'Média',
}

export interface NotionBlock {
  id: string;
  type: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  keywords: string[];
  action: (editor: Editor) => void;
  group: BlockGroup;
}