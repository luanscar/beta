"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";

const links = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Usuários",
    href: "/users",
    icon: Users2,
    hideOnMobile: true,
  },
  // { name: "Explore", href: "/dashboard/explore", icon: Compass },
  // {
  //   name: "Reels",
  //   href: "/dashboard/reels",
  //   icon: Clapperboard,
  // },
  // {
  //   name: "Messages",
  //   href: "/dashboard/messages",
  //   icon: MessageCircle,
  // },
  // {
  //   name: "Notifications",
  //   href: "/dashboard/notifications",
  //   icon: Heart,
  //   hideOnMobile: true,
  // },
  // {
  //   name: "Create",
  //   href: "/dashboard/create",
  //   icon: PlusSquare,
  // },
];

interface NavLinksProps {
  companyId: string;
}

function NavLinks({ companyId }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;

        const matchPath =
          link.href === "/" ? `/${companyId}` : `/${companyId + link.href}`;
        const isActive = pathname === matchPath;

        return (
          <Link
            key={matchPath}
            href={`/${companyId + link.href}`}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              className: cn(
                `hover:bg-gray-50 md:justify-start md:items-center md:flex md:w-32 shrink-0 md:gap-4`,
                {
                  "hidden md:items-center md:flex ": link.hideOnMobile,
                }
              ),
              size: "default",
            })}
          >
            <LinkIcon className="w-6 h-6 shrink-0" />
            <p
              className={`${cn("hidden md:flex", {
                "font-extrabold": isActive,
              })}`}
            >
              {link.name}
            </p>
          </Link>
        );
      })}
    </>
  );
}

export default NavLinks;
