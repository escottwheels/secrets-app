import * as React from "react";
import clsx from "clsx";
import { Link } from "@remix-run/react";

export type NavBarItem = {
  name: string;
  to: string;
  end?: string;
  icon?: React.ReactNode;
  prefetch?: "none" | "intent" | "render";
};

type NavBarProps = {
  className?: string;
  direction: "col" | "row";
  items: NavBarItem[];
};

export const NavBar = ({ direction, className, items }: NavBarProps) => (
  <div className="flex">
    {items.map((item) => (
      <div
        key={item.name}
        className={clsx(
          "items-center mx-10 mt-5 text-white hover:text-slate-200 drop-shadow-md font-bold transition ",
          direction === "col" && "flex-col",
          className
        )}
      >
        <Link prefetch={item.prefetch} to={item.to}>
          {item.name}
        </Link>
      </div>
    ))}
  </div>
);
