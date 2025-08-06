import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Building, Home, Menu, Settings, Bell, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Properties',
    href: '/properties',
    icon: Building,
  },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const NavItems = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              mobile ? 'w-full justify-start' : ''
            } ${
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-foreground">Flex Living</h1>
                <p className="text-xs text-muted-foreground -mt-0.5">Reviews Dashboard</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavItems />
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* API Demo Link */}
            <Button variant="outline" size="sm" asChild className="hidden lg:flex">
              <a href="/api/reviews" target="_blank" rel="noopener noreferrer">
                API Demo
              </a>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      FL
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Flex Living</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@flexliving.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-4">
                  <div className="flex items-center space-x-2 px-3">
                    <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
                      <Building className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold">Flex Living</h2>
                      <p className="text-xs text-muted-foreground">Reviews Dashboard</p>
                    </div>
                  </div>
                  <nav className="flex flex-col space-y-1 px-2">
                    <NavItems mobile />
                  </nav>
                  <div className="border-t pt-4 px-2">
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <a href="/api/reviews" target="_blank" rel="noopener noreferrer">
                        API Demo
                      </a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 