import { IconFolderCode } from "@tabler/icons-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { DialogProject } from "./DialogProject";

export function EmptyProject() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>아직 프로젝트가 없습니다</EmptyTitle>
        <EmptyDescription>
          아직 생성된 프로젝트가 없습니다. <br />
          첫번째 프로젝트를 만들어 시작해보세요
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <DialogProject />
        </div>
      </EmptyContent>
    </Empty>
  );
}
