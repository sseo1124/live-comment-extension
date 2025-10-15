import { browser } from "wxt/browser";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

type RoomEnteranceProps = {
  accessToken: string | null;
  projectId: string | null;
};

export function RoomEnterance({ accessToken, projectId }: RoomEnteranceProps) {
  const [seletedRoom, setSeletedRoom] = useState();

  useEffect(() => {
    async function getRoomOntheProject() {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const url = tabs[0].url;

      const response = await fetch(
        `${import.meta.env.WXT_API_URL.replace(/\/+$/, "")}/projects/${projectId}/rooms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ url }),
        }
      );

      const { room } = await response.json();
      setSeletedRoom(room);
    }

    getRoomOntheProject();
  }, [accessToken, projectId]);

  function test() {
    console.log(seletedRoom);
  }

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
          <Button variant="outline" size="sm" onClick={test}>
            참여하기
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
