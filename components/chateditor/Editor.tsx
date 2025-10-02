import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Descendant, Editor, Transforms } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import * as Y from "yjs";
import { withYjs, YjsEditor, withYHistory } from "@slate-yjs/core";
import { HocuspocusProvider } from "@hocuspocus/provider";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default function CollaborativeEditor() {
  const [value, setValue] = useState([]);

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: "ws://127.0.0.1:8000/collaboration",
        name: "slate-yjs-demo",
        connect: false,
      }),
    []
  );

  const editor = useMemo(() => {
    const sharedType = provider.document.get("content", Y.XmlText);
    const e = withReact(withYHistory(withYjs(createEditor(), sharedType)));

    const { normalizeNode } = e;
    e.normalizeNode = (entry) => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }

      Transforms.insertNodes(
        editor,
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
        { at: [0] }
      );
    };

    return e;
  }, [provider.document]);

  useEffect(() => {
    provider.connect();
    return () => provider.disconnect();
  }, [provider]);

  useEffect(() => {
    YjsEditor.connect(editor);
    return () => YjsEditor.disconnect(editor);
  }, [editor]);

  return (
    <Slate
      value={value}
      onChange={setValue}
      editor={editor}
      initialValue={initialValue}
    >
      <Editable />
    </Slate>
  );
}
