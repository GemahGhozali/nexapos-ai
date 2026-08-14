"use client";

import Link from "next/link";
import { Fragment } from "react";
import { segmentMapping } from "../constants";
import { filterRouteGroupFromSegments } from "../utils";
import { useSelectedLayoutSegments, useParams } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export function DashboardBreadcrumb() {
  const params = useParams();
  const rawSegments = useSelectedLayoutSegments();
  const segments = filterRouteGroupFromSegments(rawSegments);

  const dynamicValues = Object.values(params).flat();
  const breadcrumbItems = segments.filter((segment) => !dynamicValues.includes(segment));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/dashboard" />}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbItems.length > 0 && <BreadcrumbSeparator />}

        {breadcrumbItems.map((segment, index) => {
          const isNotLast = index !== breadcrumbItems.length - 1;

          return (
            <Fragment key={index}>
              <BreadcrumbItem className="capitalize">
                {isNotLast ? (
                  <BreadcrumbLink render={<Link href={`/dashboard/${segment}`} />}>{segmentMapping[segment]}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{segmentMapping[segment]}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {isNotLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
