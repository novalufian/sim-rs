"use client";
import React, { useEffect, useRef, useState,useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { FiUsers } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { LuBuilding2, LuArchive, LuTicket,LuScale ,LuNotebookText} from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { VscReport } from "react-icons/vsc";
import { TbPigMoney } from "react-icons/tb";
import { MdOutlineMoreHoriz } from "react-icons/md";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  disable: boolean;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <RxDashboard className="h-6 w-6"/>,
    name: "DASHBOARD",
    path : "/",
    disable : false
  },
  {
    icon: <FiUsers className="h-6 w-6" />,
    name: "SIMPEG",
    path: "/simpeg",
    disable : true

  },
  {
    icon: <LuBuilding2 className="h-6 w-6" />,
    name: "SIM-ASSET",
    path: "/sim-asset",
    disable : true

  },

  {
    icon: <LuArchive className="h-6 w-6" />,
    name: "SIM-ARSIP",
    path: "/sim-arsip",
    disable : true

  },

  {
    icon: <VscReport className="h-6 w-6" />,
    name: "SIM-ADUAN",
    path: "/sim-aduan",
    disable : false

  },

  {
    icon: <LuTicket className="h-6 w-6" />,
    name: "SI-NOMOR",
    path: "/si-nomor",
    disable : true

  },

  {
    icon: <TbPigMoney className="h-6 w-6" />,
    name: "SI-KEU",
    path: "/si-keu",
    disable : true

  },
  {
    icon: <LuNotebookText className="h-6 w-6" />,
    name: "Service Desk",
    path: "/service-desk",
    disable : true

  },

  {
    icon: <LuScale className="h-6 w-6" />,
    name: "J.D.I.H",
    path: "/jdih",
    disable : true

  }
];

const othersItems:NavItem[] = [];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  const pathname = usePathname();
  const splitedPath = pathname.split("/");

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name} className={`${nav.disable ? "pointer-events-none opacity-55" : ""}`}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group rounded-full  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              } `}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <IoIosArrowDown
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group rounded-full  ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback((path: string) => path.split("/")[1] === splitedPath[1], [ splitedPath]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname,isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-transparent backdrop-blur-lg  text-gray-900 h-screen transition-all duration-300 ease-in-out z-50
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      // onMouseEnter={() => !isExpanded && setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-6 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/rsudlogo.png"
                alt="Logo"
                width={32}
                height={32}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/rsudlogo.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </>
          ) : (
            <Image
              src="/images/logo/rsudlogo.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar h-full justify-center">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
