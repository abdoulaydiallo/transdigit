// DragHandleMenu.tsx
import { Editor } from '@tiptap/react';
import { Popover, PopoverContent } from '@/components/ui/popover';

interface DragHandleMenuProps {
  editor: Editor;
  position: { top: number; left: number };
  blockId: string;
  onClose: () => void;
}

export function DragHandleMenu({ editor, position, onClose }: DragHandleMenuProps) {
  const colors = [
    { name: 'Default', bg: '', text: '' },
    { name: 'Gray', bg: 'bg-gray-100', text: 'text-gray-800' },
    { name: 'Blue', bg: 'bg-blue-100', text: 'text-blue-800' },
    { name: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  ];

  const blockTypes = [
    { name: 'Paragraph', type: 'paragraph' },
    { name: 'Heading 1', type: 'heading', attrs: { level: 1 } },
    { name: 'Heading 2', type: 'heading', attrs: { level: 2 } },
    { name: 'Heading 3', type: 'heading', attrs: { level: 3 } },
    { name: 'Bullet List', type: 'bulletList' },
  ];

  const handleAction = (action: string, attrs?: Record<string, any>) => {
    const { from, to } = editor.state.selection;
    switch (action) {
      case 'delete':
        editor.chain().focus().deleteRange({ from, to }).run();
        break;
      case 'duplicate':
        editor.chain().focus().insertContentAt(to, editor.state.doc.textBetween(from, to, '\n')).run();
        break;
      case 'turnInto':
        editor.chain().focus().setNode(attrs?.type, attrs?.attrs).run();
        break;
      // case 'color':
      // editor.chain().focus().setNodeAttrs(blockId, { class: `${attrs.bg} ${attrs.text}` }).run();
        break;
    }
    onClose();
  };

  return (
    <Popover open={true} onOpenChange={onClose}>
      <PopoverContent
        style={{ top: position.top, left: position.left }}
        className="w-48 p-2 bg-white shadow-lg rounded-md"
      >
        <div className="space-y-1">
          <button
            className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            onClick={() => handleAction('delete')}
          >
            Supprimer
          </button>
          <button
            className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
            onClick={() => handleAction('duplicate')}
          >
            Dupliquer
          </button>
          <div className="border-t border-gray-200 my-1" />
          <div className="text-sm font-semibold px-2 py-1">Transformer en</div>
          {blockTypes.map((type) => (
            <button
              key={type.name}
              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
              onClick={() => handleAction('turnInto', type)}
            >
              {type.name}
            </button>
          ))}
          <div className="border-t border-gray-200 my-1" />
          <div className="text-sm font-semibold px-2 py-1">Couleur</div>
          {colors.map((color) => (
            <button
              key={color.name}
              className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
              onClick={() => handleAction('color', color)}
            >
              {color.name}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}