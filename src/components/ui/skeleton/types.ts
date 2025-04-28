
import { type AnimationType } from "@/utils/animations";

export interface BaseSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: AnimationType;
}

export interface SkeletonCardProps extends BaseSkeletonProps {
  header?: boolean;
  rows?: number;
}

export interface SkeletonTableProps extends BaseSkeletonProps {
  rows?: number;
  columns?: number;
}
