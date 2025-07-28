import { Node } from '@tiptap/core';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { Plugin, PluginKey } from 'prosemirror-state';

// Nœud personnalisé pour Paragraphe
const CustomParagraph = Node.create({
  name: 'paragraph',
  group: 'block',
  content: 'inline*',
  draggable: true, // Compatible avec DragHandle
  parseHTML() {
    return [{ tag: 'p' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', { class: 'notion-paragraph my-2 text-gray-800 leading-relaxed', ...HTMLAttributes }, 0];
  },
});

// Nœud personnalisé pour Titre (Heading)
const CustomHeading = Node.create({
  name: 'heading',
  group: 'block',
  content: 'inline*',
  draggable: true,
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
    };
  },
  parseHTML() {
    return [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level;
    const classes = {
      1: 'notion-heading-1 mt-6 mb-3 text-3xl font-bold',
      2: 'notion-heading-2 mt-5 mb-2 text-2xl font-semibold',
      3: 'notion-heading-3 mt-4 mb-2 text-xl font-semibold',
      4: 'notion-heading-4 mt-3 mb-1 text-lg font-medium',
    };
    return [`h${level}`, { class: classes[level as keyof typeof classes], ...HTMLAttributes }, 0];
  },
});

// Nœud personnalisé pour Bloc de Code
const CustomCodeBlock = Node.create({
  name: 'codeBlock',
  group: 'block',
  content: 'text*',
  marks: '',
  code: true,
  draggable: true,
  parseHTML() {
    return [{ tag: 'pre', attrs: { class: 'notion-code-block' } }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['pre', { class: 'notion-code-block bg-gray-800 text-gray-100 rounded-xl p-5 font-mono text-sm my-6 shadow-md', ...HTMLAttributes }, ['code', 0]];
  },
});

// Nœud personnalisé pour Image
const CustomImage = Node.create({
  name: 'image',
  group: 'block',
  draggable: true,
  addAttributes() {
    return {
      src: { default: '' },
      alt: { default: '' },
      title: { default: '' },
    };
  },
  parseHTML() {
    return [{ tag: 'img[src]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['img', { class: 'notion-image rounded-xl max-w-full my-6 shadow-md', ...HTMLAttributes }];
  },
});

// Extension Placeholder personnalisée
const CustomPlaceholder = Node.create({
  name: 'placeholder',
  priority: 1000,
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('placeholder'),
        props: {
          decorations: ({ doc, selection }) => {
            const decorations: any[] = [];
            doc.descendants((node, pos) => {
              if (node.isTextblock && node.content.size === 0) {
                let placeholder = '';
                if (node.type.name === 'paragraph') {
                  placeholder = 'Tapez du texte ou "/" pour les commandes...';
                } else if (node.type.name === 'heading') {
                  placeholder = `Titre ${node.attrs.level}`;
                } else if (node.type.name === 'codeBlock') {
                  placeholder = 'Entrez du code...';
                }
                if (placeholder) {
                  decorations.push(
                    Decoration.widget(pos + 1, () => {
                      const div = document.createElement('div');
                      div.className = 'notion-placeholder text-gray-400 italic';
                      div.textContent = placeholder;
                      return div;
                    })
                  );
                }
              }
            });
            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export { CustomParagraph, CustomHeading, CustomCodeBlock, CustomImage, CustomPlaceholder };