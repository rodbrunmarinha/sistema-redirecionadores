"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SubItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavLinkProps {
  href: string;
  name: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconColorClass: string;
  hasDropdown?: boolean;
  subItems?: SubItem[];
  isCollapsed?: boolean;
}

export function NavLink({ href, name, icon, iconBgClass, iconColorClass, hasDropdown, subItems, isCollapsed }: NavLinkProps) {
  const pathname = usePathname();
  
  // Checks if the current path starts with the link's href.
  const isActive = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
  
  // Checks if any sub-item is active
  const isSubItemActive = (subHref: string) => pathname === subHref;

  const [isOpen, setIsOpen] = useState(isActive);

  useEffect(() => {
    if (isActive && !isOpen) {
      setIsOpen(true);
    }
  }, [isActive, pathname]);

  if (subItems && subItems.length > 0 && !isCollapsed) {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isCollapsed ? name : undefined}
        >
          <div className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors ${
            isActive ? 'bg-white/20 text-white' : `${iconBgClass} ${iconColorClass}`
          }`}>
            {icon}
          </div>
          {!isCollapsed && (
            <>
              <span className="font-medium leading-tight flex-1 text-left">{name}</span>
              <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </>
          )}
        </button>

        {isOpen && !isCollapsed && (
          <div className="mt-1 ml-6 space-y-1">
            {subItems.map((subItem, idx) => {
              const subActive = isSubItemActive(subItem.href);
              return (
                <Link
                  key={idx}
                  href={subItem.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                    subActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`${subActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    {subItem.icon}
                  </div>
                  {subItem.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-200 ${
        isCollapsed ? 'justify-center px-0' : 'px-4'
      } ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
      title={isCollapsed ? name : undefined}
    >
      <div className={`w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors ${
        isActive ? 'bg-white/20 text-white' : `${iconBgClass} ${iconColorClass}`
      }`}>
        {icon}
      </div>
      {!isCollapsed && (
        <span className="font-medium leading-tight flex-1">{name}</span>
      )}
    </Link>
  );
}
