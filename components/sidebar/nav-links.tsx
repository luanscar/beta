"use client";

import { cn } from "@/lib/utils";
import { Home, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "../ui/button";

const links = [
  { name: "Home", href: "/", icon: Home },
  {
    name: "Search",
    href: "/dashboard/search",
    icon: Search,
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
            key={link.name}
            href={matchPath}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              className: cn(` hover:bg-gray-50 gap-4`, {
                "hidden  md:flex": link.hideOnMobile,
              }),
              size: "default",
            })}
          >
            <LinkIcon className="w-6 h-6 shrink-0" />
            <p
              className={`${cn("hidden 2xl:flex ", {
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
