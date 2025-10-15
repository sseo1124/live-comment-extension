import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export function RoomEnterance() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>피드백 남겨주세요</ItemTitle>
          <ItemDescription>
            이 페이지에 피드백을 남길 수 있습니다.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            참여하기
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
