// NotionStyleDragHandle.tsx
import { Plus, GripVertical } from 'lucide-react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { useState, useEffect } from 'react';

// Définir les types pour les props si nécessaire
// Pour l'instant, on part du principe que NodeViewWrapper gère les props nécessaires

export const NotionStyleDragHandle = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Vous pouvez ajouter ici la logique pour gérer la visibilité
  // Par exemple, basée sur le survol du bloc parent ou la sélection
  // Pour l'instant, on la rend visible par défaut pour le test
  // Nous verrons comment la gérer dynamiquement plus tard

  return (
    <NodeViewWrapper
      className={`notion-style-drag-handle-wrapper absolute -left-8 top-0 bottom-0 w-8 flex flex-col items-center justify-start pt-1 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      // Vous pouvez ajouter onMouseEnter/onMouseLeave ici pour gérer isVisible
      // Mais cela nécessite plus d'intégration avec l'éditeur
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        type="button"
        className="notion-style-plus-button p-1 rounded hover:bg-gray-200 mb-1"
        aria-label="Ajouter un bloc"
        // onClick={() => { /* Logique pour ajouter un bloc */ }}
      >
        <Plus size={16} className="text-gray-500" />
      </button>
      <button
        type="button"
        className="notion-style-grip-button p-1 rounded hover:bg-gray-200 cursor-grab"
        aria-label="Déplacer le bloc"
        data-drag-handle // Important pour que Tiptap reconnaisse ceci comme le point de drag
      >
        <GripVertical size={16} className="text-gray-500" />
      </button>
    </NodeViewWrapper>
  );
};
