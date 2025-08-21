import { DragHandle } from '@tiptap/extension-drag-handle';
export const handleDragExtention = DragHandle.configure({
  render: () => {
    // Créer le conteneur principal pour les deux icônes
    const container = document.createElement('div');
    // Suppression de bottom-0 et items-center, ajout de pt-0.5 pour un alignement fin
    container.className = 'notion-drag-handle-container absolute right-0  top-0 w-20 flex items-center gap-2 pt-[-5px] mx-6 mr-2 opacity-0 hover:opacity-100 transition-opacity duration-200 z-10';
    
    // --- Créer le bouton + ---
    const plusButton = document.createElement('button');
    plusButton.type = 'button';
    plusButton.className = 'notion-plus-button p-1.5  hover:bg-gray-200 mb-1 focus:outline-none focus:ring-1 focus:ring-gray-300 rounded-full';
    plusButton.setAttribute('aria-label', 'Ajouter un bloc');
    const plusIcon = document.createElement('div');
    plusIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    `;
    plusButton.appendChild(plusIcon);

    // --- Créer le bouton grip (drag handle) ---
    const gripButton = document.createElement('button');
    gripButton.type = 'button';
    gripButton.className = 'notion-grip-button p-1.5 rounded-full hover:bg-gray-200 cursor-grab focus:outline-none focus:ring-1 focus:ring-gray-300';
    gripButton.setAttribute('aria-label', 'Déplacer le bloc');
    gripButton.setAttribute('data-drag-handle', '');
    const gripIcon = document.createElement('div');
    gripIcon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500">
        <circle cx="9" cy="12" r="1"></circle>
        <circle cx="9" cy="5" r="1"></circle>
        <circle cx="9" cy="19" r="1"></circle>
        <circle cx="15" cy="12" r="1"></circle>
        <circle cx="15" cy="5" r="1"></circle>
        <circle cx="15" cy="19" r="1"></circle>
      </svg>
    `;
    gripButton.appendChild(gripIcon);

    // Ajouter les deux boutons au conteneur
    container.appendChild(plusButton);
    container.appendChild(gripButton);

    return container;
  },
});