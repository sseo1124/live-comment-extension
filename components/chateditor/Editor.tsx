import { useEffect, useMemo, useState } from "react";
import type { Descendant } from "slate";
import { createEditor, Editor, Transforms } from "slate";
import { Editable, Slate, withReact } from "slate-react";
import * as Y from "yjs";
import { withCursors, withYjs, YjsEditor, withYHistory } from "@slate-yjs/core";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { randomCursorData } from "@/lib/random-cursor-data";
import { RemoteCursorOverlay } from "@/components/chateditor/Cursors";

const initialValue = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

export default function CollaborativeEditor() {
  const [value, setValue] = useState<Descendant[]>([]);
  const [connected, setConnected] = useState(false);

  const provider = useMemo(
    () =>
      new HocuspocusProvider({
        url: "ws://127.0.0.1:8000/collaboration",
        name: "slate-yjs-demo",
        onConnect: () => setConnected(true),
        onDisconnect: () => setConnected(false),
        connect: false,
      }),
    []
  );

  const editor = useMemo(() => {
    const sharedType = provider.document.get("content", Y.XmlText);
    const e = withReact(
      withYHistory(
        withCursors(
          withYjs(createEditor(), sharedType, { autoConnect: false }),
          provider.awareness,
          {
            data: randomCursorData(),
          }
        )
      )
    );

    const { normalizeNode } = e;
    e.normalizeNode = (entry) => {
      const [node] = entry;

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry);
      }

      Transforms.insertNodes(editor, initialValue, { at: [0] });
    };

    return e;
  }, [provider.awareness, provider.document]);

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
      <RemoteCursorOverlay>
        <Editable className="max-w-4xl w-full flex-col break-words" />
      </RemoteCursorOverlay>
    </Slate>
  );
}
