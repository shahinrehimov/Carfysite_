import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/routing";
export default function BreadcrumbView({ data }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {data.map((item, index) =>
          item.type === "link" ? (
            <React.Fragment key={item.id}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {index !== data.length - 1 && (
                <BreadcrumbSeparator>|</BreadcrumbSeparator>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment key={item.id}>
              <BreadcrumbItem>
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              </BreadcrumbItem>
              {index !== data.length - 1 && (
                <BreadcrumbSeparator>|</BreadcrumbSeparator>
              )}
            </React.Fragment>
          )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
