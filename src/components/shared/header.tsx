
'use client';

import {
  Book,
  BotMessageSquare,
  Home,
  Menu,
  Sprout,
  Bell,
  Languages,
  Palette,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from 'next-themes';


import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
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
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
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

const colorThemes = [
  'default', 'forest', 'sky', 'rose', 'ocean', 'sunset', 'lavender', 'sunflower', 'cosmic'
];


export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mode, colorTheme] = theme?.split('-') ?? ['light', 'default'];

  const handleThemeChange = (newColor: string) => {
    const newTheme = resolvedTheme === 'dark' && newColor !== 'default' ? `dark-${newColor}` : newColor;
    setTheme(newTheme);
  }

  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    if (newMode === 'system') {
      setTheme(colorTheme);
      return;
    }
    const newTheme = colorTheme !== 'default' ? `${newMode}-${colorTheme}` : newMode;
    setTheme(newTheme);
  }

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
                    Mode
                  </DropdownMenuSubTrigger>
                   <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                         <DropdownMenuRadioGroup value={resolvedTheme} onValueChange={(v) => handleModeChange(v as any)}>
                            <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                          </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                 <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                     Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                       <DropdownMenuRadioGroup value={colorTheme} onValueChange={handleThemeChange}>
                          {colorThemes.map((ct) => (
                            <DropdownMenuRadioItem key={ct} value={ct}>
                              <span className="capitalize">{ct}</span>
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
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
                  <SheetTitle>{t('header.menu')}</SheetTitle>
                </SheetHeader>
                <div className="flex h-full flex-col">
                  <div className="flex flex-col gap-4 pt-8">
                    {navLinks.map((link) => (
                      <NavLink key={link.href} href={link.href} labelKey={link.labelKey} icon={link.icon} isMobile />
                    ))}
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
