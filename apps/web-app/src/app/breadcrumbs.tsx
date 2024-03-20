"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  usePathname,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from "next/navigation";

export function Breadcrumbs() {
  const selectedLayoutSegments = useSelectedLayoutSegments();

  if (selectedLayoutSegments.length === 0) {
    return null;
  }

  const paths = [];
  let path = "";
  for (const segment of selectedLayoutSegments) {
    path = `${path}/${segment}`;
    paths.push({ segment: segment, href: path });
  }

  return (
    <Breadcrumb className="px-6 pt-6">
      <BreadcrumbList>
        <BreadcrumbItem className="capitalize">
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        {paths.map((path, idx) => {
          return (
            <>
              <BreadcrumbItem className="capitalize">
                {idx !== paths.length - 1 ? (
                  <BreadcrumbLink href={path.href}>
                    {path.segment}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{path.segment}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {idx !== paths.length - 1 ? <BreadcrumbSeparator /> : null}
            </>
          );
        })}
      </BreadcrumbList>
      {/* //{" "}
      <BreadcrumbList>
        //{" "}
        <BreadcrumbItem>
          // <BreadcrumbLink href="/">Home</BreadcrumbLink>
          //{" "}
        </BreadcrumbItem>
        // <BreadcrumbSeparator />
        //{" "}
        <BreadcrumbItem>
          // <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          //{" "}
        </BreadcrumbItem>
        // <BreadcrumbSeparator />
        //{" "}
        <BreadcrumbItem>
          // <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          //{" "}
        </BreadcrumbItem>
        //{" "}
      </BreadcrumbList> */}
    </Breadcrumb>
  );
}
