import * as React from "react";
import clsx from "clsx";
type ContentLayoutProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
};

export const ContentLayout = ({
  children,
  title,
  className,
}: ContentLayoutProps) => {
  return (
    <div
      className={clsx(className, "overflow-hidden flex flex-col items-center")}
    >
      {title && <span className="text-7xl">{title}</span>}
      <div className="px-6 mt-1">{children}</div>
    </div>
  );
};
