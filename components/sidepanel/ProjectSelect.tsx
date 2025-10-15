import React, { useEffect, useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomEnterance } from "./RoomEntrance";

type Project = {
  _id: string;
  name: string;
};

type ProjectSelectProps = {
  accessToken: string | null;
};

const resolveProjectsEndpoint = () => {
  const baseUrl = import.meta.env.WXT_API_URL ?? "http://localhost:8000";
  return `${baseUrl.replace(/\/+$/, "")}/projects`;
};

export function ProjectSelect({ accessToken }: ProjectSelectProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();

  useEffect(() => {
    let cancelled = false;

    const fetchProjects = async () => {
      setStatus("loading");
      setError(null);

      if (!accessToken) {
        if (!cancelled) {
          setProjects([]);
          setStatus("error");
          setError("프로젝트를 가져오려면 로그인이 필요합니다.");
        }
        return;
      }

      try {
        const response = await fetch(resolveProjectsEndpoint(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("프로젝트 목록을 불러오지 못했습니다.");
        }

        const payload = (await response.json()) as { projects?: Project[] };

        if (!Array.isArray(payload.projects)) {
          throw new Error("프로젝트 데이터 형식이 올바르지 않습니다.");
        }

        if (!cancelled) {
          setProjects(payload.projects);
          setStatus("idle");
        }
      } catch (err) {
        if (!cancelled) {
          setProjects([]);
          setStatus("error");
          setError(
            err instanceof Error
              ? err.message
              : "프로젝트 목록을 불러오는 중 오류가 발생했습니다."
          );
        }
      }
    };

    void fetchProjects();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const isDisabled = status !== "idle" || projects.length === 0;

  return (
    <div className="w-full max-w-md">
      <Field>
        <FieldLabel>프로젝트 종류</FieldLabel>
        <Select
          value={selectedProjectId}
          onValueChange={setSelectedProjectId}
          disabled={isDisabled}
        >
          <SelectTrigger disabled={isDisabled}>
            <SelectValue
              placeholder={
                status === "loading"
                  ? "프로젝트를 불러오는 중..."
                  : status === "error"
                    ? "프로젝트 목록을 불러오지 못했습니다"
                    : projects.length === 0
                      ? "등록된 프로젝트가 없습니다"
                      : "프로젝트를 선택하세요"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project._id} value={project._id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>
          {error ?? "참여 중이거나 담당하고 있는 프로젝트 유형을 선택하세요."}
        </FieldDescription>
      </Field>

      {selectedProjectId && (
        <RoomEnterance
          accessToken={accessToken}
          projectId={selectedProjectId}
        />
      )}
    </div>
  );
}
