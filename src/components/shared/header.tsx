'use client';

import {
  Book,
  BotMessageSquare,
  Home,
  Menu,
  Sprout,
  Bell,
  User,
  LogOut,
  LogIn,
  Languages,
  Moon,
  Sun,
  Palette,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useTheme } from 'next-themes';


import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useLanguage, languages, useTranslation } from '@/context/language-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const navLinks = [
  { href: '/', labelKey: 'header.home', icon: Home },
  { href: '/query', labelKey: 'header.aiQuery', icon: BotMessageSquare },
  { href: '/advisory-hub', labelKey: 'header.advisoryHub', icon: Book },
  { href: '/alerts', labelKey: 'header.alerts', icon: Bell },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { setTheme } = useTheme();


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const NavLink = ({
    href,
    labelKey,
    icon: Icon,
    isMobile = false,
  }: {
    href: string;
    labelKey: string;
    icon: React.ElementType;
    isMobile?: boolean;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => isMobile && setMobileMenuOpen(false)}
        className={cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary/90 text-primary-foreground'
            : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground',
          isMobile && 'text-lg'
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{t(labelKey)}</span>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Sprout className="h-7 w-7 text-primary" />
          <span className="text-xl font-headline">{t('header.title')}</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} labelKey={link.labelKey} icon={link.icon} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Palette className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Mode</span>
                  </DropdownMenuSubTrigger>
                   <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                 <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                     <Palette className="mr-2 h-4 w-4" />
                     <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme('theme-default')}>Default</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('theme-forest')}>Forest</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('theme-sky')}>Sky</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('theme-rose')}>Rose</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
           <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-muted-foreground hidden sm:block" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={t('header.language')} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || t('header.user')} />
                    <AvatarFallback>{user.displayName ? user.displayName[0].toUpperCase() : <User />}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('header.profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('header.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" className="hidden md:flex">
                <Link href="/login">
                    <LogIn className="mr-2"/>
                    {t('header.login')}
                </Link>
            </Button>
          )}

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{t('header.openMenu')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 pt-10">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} href={link.href} labelKey={link.labelKey} icon={link.icon} isMobile />
                  ))}
                   <div className="mt-auto pt-6 border-t">
                  {user ? (
                    <div className='space-y-4'>
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium">
                        <Avatar>
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || t('header.user')} />
                            <AvatarFallback>{user.displayName ? user.displayName[0].toUpperCase() : <User />}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{user.displayName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </Link>
                      <Button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full justify-start text-lg">
                        <LogOut className="mr-2 h-5 w-5" />
                        {t('header.logout')}
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full justify-start text-lg">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <LogIn className="mr-2 h-5 w-5" />
                        {t('header.loginSignup')}
                      </Link>
                    </Button>
                  )}
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
