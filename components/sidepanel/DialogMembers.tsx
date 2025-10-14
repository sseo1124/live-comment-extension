import { MembersList } from "./MembersList";
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

export function DialogMembers() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">공유하기</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>프로젝트 공유하기</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input type="email" placeholder="Email" />
          <Button type="submit" variant="outline">
            초대하기
          </Button>
        </div>
        <DialogDescription>접근가능한 멤버들</DialogDescription>
        <MembersList />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
