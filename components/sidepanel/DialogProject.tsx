import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DialogProject() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>프로젝트 생성</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>새 프로젝트 만들기</DialogTitle>
            <DialogDescription>
              새로운 프로젝트의 기본 정보를 입력하세요. <br />
              입력을 완료한 후 <strong>저장</strong> 버튼을 눌러 프로젝트를
              생성할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="project-name">프로젝트 이름</Label>
              <Input
                id="project-name"
                name="name"
                placeholder="예: LiveComment Extension"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="project-desc">프로젝트 설명</Label>
              <Input
                id="project-desc"
                name="description"
                placeholder="이 프로젝트에 대한 간단한 설명을 입력하세요"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit">프로젝트 생성</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
