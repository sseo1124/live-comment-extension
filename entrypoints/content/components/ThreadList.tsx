import type { Thread } from "../types";

type ThreadListProps = {
  threads: Thread[];
};

export function ThreadList({ threads }: ThreadListProps) {
  if (threads.length === 0) {
    return <div className="opacity-60">스레드가 없습니다.</div>;
  }

  return (
    <>
      {threads.map((thread) => (
        <div
          key={thread._id}
          className="border-b border-neutral-800 px-1 py-1.5 last:border-b-0"
        >
          {thread.content}
        </div>
      ))}
    </>
  );
}
