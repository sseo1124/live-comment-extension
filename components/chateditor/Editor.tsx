import React, { useState, useEffect, useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import * as Y from "yjs";
import { slateNodesToInsertDelta } from "@slate-yjs/core";

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable plain text, just like a <textarea>!" },
    ],
  },
];

export default function CollaborativeEditor() {
  const sharedType = useMemo(() => {
    const yDoc = new Y.Doc();
    const sharedType = yDoc.get("content", Y.XmlText);

    sharedType.applyDelta(slateNodesToInsertDelta(initialValue));

    return sharedType;
  }, []);

  return <PlainTextEditor />;
}

function PlainTextEditor() {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const [value, setValue] = useState([]);

  return (
    <Slate editor={editor} value={value} onChange={setValue}>
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  );
}
