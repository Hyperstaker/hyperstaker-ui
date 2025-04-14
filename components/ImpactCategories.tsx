import { Tag } from "./ui/Tag";
import { impactCategories } from "../config";

export const ImpactCategories = ({ tags }: { tags?: string[] }) => (
  <div className="no-scrollbar">
    <div className="flex gap-1 overflow-x-auto">
      {tags?.map((key, i) => (
        <Tag key={i} className="rounded py-1 px-2 text-xs">
          {impactCategories[key as keyof typeof impactCategories]?.label ?? key}
        </Tag>
      ))}
    </div>
  </div>
);
