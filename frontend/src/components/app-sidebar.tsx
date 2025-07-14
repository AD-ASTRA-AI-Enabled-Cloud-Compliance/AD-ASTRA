"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Mocked user data (can be enhanced)
const user = {
  name: "Skylock User",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

// Static project list (optional)
const projects = [
  {
    name: "Design Engineering",
    url: "#",
    icon: Frame,
  },
  {
    name: "Sales & Marketing",
    url: "#",
    icon: PieChart,
  },
  {
    name: "Travel",
    url: "#",
    icon: Map,
  },
];

// Sidebar items per role with path prefixing
function getNavItemsByRole(role: string, pathPrefix: string) {
  // Define routes without prefixes
  const commonRoutes = [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      title: "Explore Rules",
      url: "/explore_rules", // This matches your folder structure
    },
    {
      title: "Chat",
      url: "/chat",
    },
  ];

  const managementOnly = [
    {
      title: "Generate Terraform",
      url: "/terraform",
    },
    {
      title: "New Document",
      url: "/process_documentation",
    },
  ];

  // Select appropriate routes based on role
  const routes =
    role === "management" ? [...commonRoutes, ...managementOnly] : commonRoutes;

  // Add path prefix to each route
  const prefixedRoutes = routes.map((route) => ({
    ...route,
    url: route.url.startsWith("#") ? route.url : `${pathPrefix}${route.url}`,
  }));

  return [
    {
      title: "Frameworks",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: prefixedRoutes,
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [{ title: "System Prompts", url: "#" }],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState("user");
  const pathname = usePathname();

  // Determine the correct path prefix based on the current path
  const getPathPrefix = React.useCallback(() => {
    if (pathname?.startsWith("/management")) {
      return "/management";
    } else if (pathname?.startsWith("/user")) {
      return "/user";
    }
    // Default prefix based on role if not in a specific path
    return role === "management" ? "/management" : "/user";
  }, [pathname, role]);

  React.useEffect(() => {
    // Get user role from localStorage
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  // Get navigation items with the correct path prefix
  const navItems = React.useMemo(() => {
    const pathPrefix = getPathPrefix();
    return getNavItemsByRole(role, pathPrefix);
  }, [role, getPathPrefix]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={[]} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
