"use client";

import { EditorContent, EditorRoot, JSONContent } from "novel";
import { useState } from "react";

interface EditorProps {
  label: string;
  defaultValue: JSONContent | null;
  onChange: (content: JSONContent) => void;
}

export const NovelEditor = ({label, defaultValue, onChange}: EditorProps) => {
  const [content, setContent] = useState(defaultValue || undefined);
  return (
    <EditorRoot>
      <EditorContent
        initialContent={content}
        onUpdate={({ editor }) => {
          const json = editor.getJSON();
          setContent(json);
          onChange(json);
        }}
      />
    </EditorRoot>
  );
};