import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectSelect() {
  return (
    <div className="w-full max-w-md">
      <Field>
        <FieldLabel>프로젝트 종류</FieldLabel>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="프로젝트를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="영신엔지니어링">영신엔지니어링</SelectItem>
            <SelectItem value="바닐라코딩">바닐라코딩</SelectItem>
            <SelectItem value="SJJM홈페이지">SJJM홈페이지</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>
          참여 중이거나 담당하고 있는 프로젝트 유형을 선택하세요.
        </FieldDescription>
      </Field>
    </div>
  );
}
