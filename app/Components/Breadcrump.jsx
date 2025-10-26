"use client";
import React from "react";
import { useProject } from "../context/ProjectContext";
import { usePathname, useRouter } from "next/navigation";


const Breadcrump = () => {
  const pathname = usePathname();
  const { getBreadcrumb } = useProject();
  const router = useRouter();

  const breadcrumbItems = pathname ? getBreadcrumb(pathname) : [];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-3 sm:px-4 mt-2 gap-2 sm:gap-0">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-neutral-400 text-xs">
        {breadcrumbItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <span
              onClick={() => item.clickable && router.push(item.path)}
              className={`${
                item.clickable
                  ? "cursor-pointer hover:underline text-white/70"
                  : "cursor-default text-white/80 font-medium"
              }`}
            >
              {item.label}
            </span>
            {idx !== breadcrumbItems.length - 1 && (
              <span className="text-neutral-600">/</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Breadcrump;
