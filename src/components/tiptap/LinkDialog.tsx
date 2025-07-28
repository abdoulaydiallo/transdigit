'use client';

import { Editor } from '@tiptap/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkUrl: string;
  setLinkUrl: (url: string) => void;
  onInsert: () => void;
  editor: Editor | null;
  cursorPositionRef: React.MutableRefObject<number | null>;
}

export function LinkDialog({
  open,
  onOpenChange,
  linkUrl,
  setLinkUrl,
  onInsert,
  editor,
  cursorPositionRef,
}: LinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insérer un lien</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="URL du lien"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            aria-label="URL du lien"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setLinkUrl('');
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