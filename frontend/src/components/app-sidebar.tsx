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
  UploadCloudIcon,
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
const defaultUser = {
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
      url: "/explore_rules",
    },
    // {
    //   title: "Chat",
    //   url: "/chat",
    // },
  ];

  const commonDeployRoutes: { title: string; url: string }[] = [
    {
      title: "Validate Terraform",
      url: "/terraform_comparison",
    },
    {
      title: "Provision Resources",
      url: "/provisioner",
    }
  ];

  const managementOnly = [
    {
      title: "New Document",
      url: "/process_documentation",
    },
    {
      title: "Generate Terraform",
      url: "/terraform",
    },
    // {
    //   title: "Explore Documents",
    //   url: "/explore_documents",
    // },
  ];

  // Select appropriate routes based on role
  const routes =
    role === "management"
      ? [...commonRoutes, ...managementOnly]
      : [...commonRoutes];

  // Add path prefix to each route
  const prefixedRoutes = routes.map((route) => ({
    ...route,
    url: route.url.startsWith("#") ? route.url : `${pathPrefix}${route.url}`,
  }));

  // Add path prefix to deployment routes
  const prefixedDeployRoutes = commonDeployRoutes.map((route) => ({
    ...route,
    url: route.url.startsWith("#") ? route.url : `${pathPrefix}${route.url}`,
  }));

  return [
    {
      title: "Frameworks",
      url: "#",
      icon: SquareTerminal,
      isActive: true, // Set to true to expand by default
      items: prefixedRoutes,
    },
    {
      title: "Deployments",
      url: "#",
      icon: UploadCloudIcon,
      isActive: true, // Set to true to expand by default
      items: prefixedDeployRoutes,
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [{ title: "System Prompts", url: "#" }],
    // },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      isActive: true, // Set to true to expand by default
      items: [
        { title: "Introduction", url: `${pathPrefix}/documentation/introduction` },
        { title: "Get Started", url: `${pathPrefix}/documentation/get-started` },
        { title: "Tutorials", url: `${pathPrefix}/documentation/tutorials` },
      ],
    },
  ];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState("user");
  const [user, setUser] = React.useState(defaultUser);
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
    // Get user role and email from localStorage
    const storedRole = localStorage.getItem("role");
    const storedEmail = localStorage.getItem("email");
    
    if (storedRole) {
      setRole(storedRole);
      
      // Update user name based on role
      const userName = localStorage.getItem("userName") || (storedRole === "management" ? "Skylock Management" : "Skylock User");
      
      setUser({
        ...defaultUser,
        name: userName,
        email: storedEmail || defaultUser.email
      });
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
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
