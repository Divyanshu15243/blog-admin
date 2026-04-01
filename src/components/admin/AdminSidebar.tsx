import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import {
  LayoutDashboard, FileText, Image, Settings, Users, Search, Tag, MessageSquare, Globe, FolderOpen, PenSquare, ChevronDown,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  SidebarSeparator, useSidebar,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from 'react-router-dom';

const mainNav = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
];

const contentNav = [
  { title: 'All Blogs', url: '/blogs', icon: FileText },
  { title: 'Add New Blog', url: '/blogs/new', icon: PenSquare },
  { title: 'Categories', url: '/categories', icon: FolderOpen },
  { title: 'Tags', url: '/tags', icon: Tag },
  { title: 'Comments', url: '/comments', icon: MessageSquare },
];

const manageNav = [
  { title: 'Sites', url: '/sites', icon: Globe },
  { title: 'Media Library', url: '/media', icon: Image },
  { title: 'SEO Settings', url: '/seo', icon: Search },
  { title: 'Users', url: '/users', icon: Users },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const contentOpen = contentNav.some(i => isActive(i.url));
  const manageOpen = manageNav.some(i => isActive(i.url));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">B</span>
          </div>
          {!collapsed && <span className="font-serif text-lg font-bold text-sidebar-foreground">BlogCMS</span>}
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Content */}
        <SidebarGroup>
          <Collapsible defaultOpen={contentOpen || true}>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md">
                {!collapsed && 'Content'}
                {!collapsed && <ChevronDown className="ml-auto h-3.5 w-3.5" />}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {contentNav.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                        <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Manage */}
        <SidebarGroup>
          <Collapsible defaultOpen={manageOpen || true}>
            <CollapsibleTrigger className="w-full">
              <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent/50 rounded-md">
                {!collapsed && 'Manage'}
                {!collapsed && <ChevronDown className="ml-auto h-3.5 w-3.5" />}
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {manageNav.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                        <NavLink to={item.url} end activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <Link to="/" target="_blank" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Globe className="h-3.5 w-3.5" />
            View Live Site
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
