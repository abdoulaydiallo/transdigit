'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, JSONContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Strike from '@tiptap/extension-strike';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { SlashMenu } from './SlashMenu';
import { FloatingToolbar } from './FloatingToolbar';
import { ImageDialog } from './ImageDialog';
import { LinkDialog } from './LinkDialog';
import { handleDragExtention } from './HandleDragExtention';

// Initialisation de lowlight
const lowlight = createLowlight(common);

// Props du composant
interface NotionEditorProps {
  defaultValue: JSONContent | null;
  onChange: (content: JSONContent) => void;
}

// Interface pour les positions des menus
interface MenuPosition {
  top: number;
  left: number;
}

export function RichTextEditor({ defaultValue = {}, onChange }: NotionEditorProps) {
  const [mounted, setMounted] = useState<boolean>(false);
  const [showSlashMenu, setShowSlashMenu] = useState<boolean>(false);
  const [slashPosition, setSlashPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const [showFloatingMenu, setShowFloatingMenu] = useState<boolean>(false);
  const [floatingMenuPosition, setFloatingMenuPosition] = useState<MenuPosition>({ top: 0, left: 0 });
  const [showImageDialog, setShowImageDialog] = useState<boolean>(false);
  const [showLinkDialog, setShowLinkDialog] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(-1);
  const slashMenuRef = useRef<HTMLDivElement>(null);
  const floatingMenuRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const cursorPositionRef = useRef<number | null>(null);

  // Initialisation de l'éditeur avec drag-and-drop
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4] as (1 | 2 | 3 | 4)[],
            HTMLAttributes: {
              class: 'mt-6 mb-3 text-2xl font-bold leading-tight',
            },
          },
          code: {
            HTMLAttributes: {
              class: 'bg-gray-100 text-red-600 px-1.5 py-0.5 rounded-md font-mono text-sm',
            },
          },
          codeBlock: false,
          blockquote: {
            HTMLAttributes: {
              class: 'border-l-4 border-blue-400 pl-5 italic text-gray-800 my-5',
            },
          },
          bulletList: {
            HTMLAttributes: { class: 'list-disc ml-8 my-3' },
          },
          orderedList: {
            HTMLAttributes: { class: 'list-decimal ml-8 my-3' },
          },
          listItem: {
            HTMLAttributes: { class: 'mb-2' },
          },
          horizontalRule: {
            HTMLAttributes: { class: 'border-gray-200 my-8' },
          },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-500 underline decoration-blue-500/30 underline-offset-4 hover:decoration-blue-500',
          },
        }),
        Highlight.configure({
          HTMLAttributes: { class: 'bg-yellow-100 px-1.5 rounded-md' },
        }),
        Strike,
        Image.configure({
          HTMLAttributes: { class: 'rounded-xl max-w-full my-6 shadow-md' },
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Placeholder.configure({
          placeholder: 'Tapez "/" pour les commandes...',
        }),
        CodeBlockLowlight.configure({
          lowlight,
          HTMLAttributes: {
            class: 'bg-gray-800 text-gray-100 rounded-xl p-3 font-mono text-sm my-6 shadow-md',
          },
        }),
        handleDragExtention,
      ],
      content: defaultValue,
      editorProps: {
        attributes: {
          class:
            'tiptap min-h-[400px] px-4 mx-auto focus:outline-none prose prose-lg dark:prose-invert',
          style:
            'font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;',
        },
        handleKeyDown: (view, event: KeyboardEvent) => {
          if (event.key === '/' && view.state.selection.empty) {
            const { state } = view;
            const { from } = state.selection;
            cursorPositionRef.current = from;
            const coords = view.coordsAtPos(from);
            const editorBounds = view.dom.getBoundingClientRect();
            const maxLeft = editorBounds.width - 280;
            setSlashPosition({
              top: coords.top - editorBounds.top + 32,
              left: Math.min(Math.max(coords.left - editorBounds.left, 16), maxLeft),
            });
            view.dispatch(state.tr.delete(from - 1, from).scrollIntoView());
            setShowSlashMenu(true);
            setSelectedBlockIndex(0);
            return true;
          }
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        if (typeof onChange !== 'function') {
          console.error('onChange must be a function');
          return;
        }
        onChange(editor.getJSON());
      },
      onSelectionUpdate: ({ editor }) => {
        const { from, to, empty } = editor.state.selection;
        if (!empty) {
          const start = editor.view.coordsAtPos(from);
          const end = editor.view.coordsAtPos(to);
          const editorBounds = editor.view.dom.getBoundingClientRect();
          setFloatingMenuPosition({
            top: start.top - editorBounds.top - 60,
            left: (start.left + end.left) / 2 - editorBounds.left,
          });
          setShowFloatingMenu(true);
        } else {
          setShowFloatingMenu(false);
        }
      },
      immediatelyRender: false,
    },
    []
  );

  // Montage et démontage
  useEffect(() => {
    setMounted(true);
    editorRef.current = editor;
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Synchronisation du contenu
  useEffect(() => {
    if (editor && defaultValue && JSON.stringify(defaultValue) !== JSON.stringify(editor.getJSON())) {
      editor.commands.setContent(defaultValue);
    }
  }, [defaultValue, editor]);

  // Gestion des clics en dehors des menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (slashMenuRef.current && !slashMenuRef.current.contains(event.target as Node)) {
        setShowSlashMenu(false);
        setSelectedBlockIndex(-1);
        if (editor && cursorPositionRef.current) {
          editor.chain().focus().setTextSelection(cursorPositionRef.current).run();
        }
      }
      if (floatingMenuRef.current && !floatingMenuRef.current.contains(event.target as Node)) {
        setShowFloatingMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editor]);

  // Insertion d'image
  const onInsertImage = () => {
    if (!editor || !imageUrl) return;
    if (/^https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg)$/i.test(imageUrl)) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setShowImageDialog(false);
      setImageUrl('');
      setShowSlashMenu(false);
      setSelectedBlockIndex(-1);
      if (cursorPositionRef.current) {
        editor.chain().focus().setTextSelection(cursorPositionRef.current).run();
      }
    } else {
      alert('Veuillez entrer une URL d\'image valide.');
    }
  };

  // Insertion de lien
  const onInsertLink = () => {
    if (!editor || !linkUrl) return;
    if (/^https?:\/\/.+$/i.test(linkUrl)) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setShowLinkDialog(false);
      setLinkUrl('');
      if (cursorPositionRef.current) {
        editor.chain().focus().setTextSelection(cursorPositionRef.current).run();
      }
    } else {
      alert('Veuillez entrer une URL valide.');
    }
  };

  // Rendu conditionnel pour SSR
  if (!mounted || !editor) {
    return (
      <FormItem>
        <FormControl>
          <div className="bg-white flex items-center justify-center rounded-xl shadow-sm">
            <div className="text-gray-400">Chargement...</div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }

  return (
    <FormItem>
      <FormControl>
        <div className="relative tiptap-editor-container mx-4">
          <EditorContent editor={editor} />
          <SlashMenu
            editor={editor}
            show={showSlashMenu}
            position={slashPosition}
            selectedBlockIndex={selectedBlockIndex}
            setSelectedBlockIndex={setSelectedBlockIndex}
            setShowSlashMenu={setShowSlashMenu}
            setShowImageDialog={setShowImageDialog}
            cursorPositionRef={cursorPositionRef}
            slashMenuRef={slashMenuRef}
          />
          <FloatingToolbar
            editor={editor}
            show={showFloatingMenu}
            position={floatingMenuPosition}
            floatingMenuRef={floatingMenuRef}
            setShowLinkDialog={setShowLinkDialog}
          />
          <ImageDialog
            open={showImageDialog}
            onOpenChange={setShowImageDialog}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            onInsert={onInsertImage}
            editor={editor}
            cursorPositionRef={cursorPositionRef}
          />
          <LinkDialog
            open={showLinkDialog}
            onOpenChange={setShowLinkDialog}
            linkUrl={linkUrl}
            setLinkUrl={setLinkUrl}
            onInsert={onInsertLink}
            editor={editor}
            cursorPositionRef={cursorPositionRef}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}