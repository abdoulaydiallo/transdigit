'use client';

import { useRef } from 'react';
import { Editor } from '@tiptap/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  onInsert: () => void;
  editor: Editor | null;
  cursorPositionRef: React.MutableRefObject<number | null>;
}

export function ImageDialog({
  open,
  onOpenChange,
  imageUrl,
  setImageUrl,
  onInsert,
  editor,
  cursorPositionRef,
}: ImageDialogProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insérer une image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            ref={imageInputRef}
            placeholder="URL de l'image"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            aria-label="URL de l'image"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setImageUrl('');
              if (editor && cursorPositionRef.current) {
                editor.chain().focus().setTextSelection(cursorPositionRef.current).run();
              }
            }}
          >
            Annuler
          </Button>
          <Button onClick={onInsert}>Insérer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}