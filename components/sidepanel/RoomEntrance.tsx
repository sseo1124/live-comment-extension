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
  const [seletedRoomId, setSeletedRoomId] = useState();

  const getActiveTab = async () => {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tabs[0];
  };

  useEffect(() => {
    async function getRoomOntheProject() {
      const activeTab = await getActiveTab();
      const url = activeTab.url;

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
      setSeletedRoomId(room._id);
    }

    getRoomOntheProject();
  }, [accessToken, projectId]);

  async function handleEnterRoom() {
    const activeTab = await getActiveTab();

    await browser.tabs.sendMessage(activeTab.id, {
      type: "JOIN_ROOM",
      payload: { projectId, accessToken, roomId: seletedRoomId },
    });
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
          <Button variant="outline" size="sm" onClick={handleEnterRoom}>
            참여하기
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
