"use client";
import Image from "next/image";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { logout } from "../api/logout";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useAuthQuery } from "@/entities/User";

interface UserNavProps {
  text?: "bright" | "dark";
}

const UserNav: FC<UserNavProps> = ({ text = "bright" }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data } = useAuthQuery();

  const queryClient = useQueryClient();

  const handleLogin = async () => {
    if (!data) {
      router.push("/auth/githubauthenticate");
    }
  };

  const handleLogout = async () => {
    const isOk = await logout();

    if (isOk) {
      if (queryClient)
        queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.refresh();
    }
  };

  const [opened, setOpened] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current) {
        if (
          e.target instanceof HTMLElement &&
          !ref.current.contains(e.target)
        ) {
          setOpened(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref.current]);

  useEffect(() => {
    setOpened(false);
  }, [pathname]);

  return (
    <div ref={ref} className="group relative z-[60] cursor-pointer">
      {!data && (
        <div onClick={handleLogin}>
          <Image
            src={text == "bright" ? "/user-nav.svg" : "/user-nav-dark.svg"}
            height="32"
            width="32"
            alt=""
          />
        </div>
      )}
      {data && (
        <div>
          <div
            className="flex items-center sm:hidden"
            onClick={() => setOpened(true)}
          >
            <p
              className={`${
                text == "bright" ? "white" : "text-[#898989]"
              } sm:text-[0.9375rem] `}
            >
              {data.name?.split(" ")[1]
                ? data.name?.split(" ")[1]
                : data.name?.split(" ")[0]}
            </p>
            <div className="pr-3" />
            <Image
              src={text == "bright" ? "/user-nav.svg" : "/user-nav-dark.svg"}
              height="32"
              width="32"
              alt=""
            />
          </div>
          <div
            className={`fixed right-0 top-0 z-50 h-screen flex-col overflow-auto bg-[#F5F6FA] py-9 pl-6 pr-5 shadow-center-xl transition-transform sm:overflow-visible sm:py-0 sm:text-black ${
              text == "bright" ? "sm:text-white" : "sm:text-black"
            } ${
              opened ? "" : "translate-x-full"
            } flex sm:static sm:h-auto sm:translate-x-0 sm:flex-row sm:bg-transparent sm:pr-0 sm:shadow-none`}
          >
            <div
              className="relative ml-auto min-h-[32px] min-w-[32px] cursor-pointer sm:hidden"
              onClick={() => setOpened(false)}
            >
              <Image src="/x-gray.svg" alt="Закрыть меню" fill={true} />
            </div>
            <div className="pt-10 sm:hidden" />
            <div className="flex flex-col-reverse items-center sm:flex-row">
              <p
                className={`"pt-3 text-xl text-[#898989] ${
                  text == "bright" ? "sm:text-white" : ""
                } sm:pt-0 sm:text-[0.9375rem] `}
              >
                {data.name?.split(" ")[1]
                  ? data.name?.split(" ")[1]
                  : data.name?.split(" ")[0]}
              </p>
              <div className="pr-3" />
              <div
                className={`relative h-8 w-8 ${
                  text == "bright" ? "sm:block" : ""
                } hidden`}
              >
                <Image src="/user-nav.svg" fill={true} alt="" />
              </div>
              <div
                className={`relative h-14 w-14 sm:h-8 sm:w-8 ${
                  text == "bright" ? "sm:hidden" : ""
                }`}
              >
                <Image src="/user-nav-dark.svg" fill={true} alt="" />
              </div>
            </div>
            <div className="right-0 top-full pr-12 pt-4 transition-opacity sm:invisible sm:absolute sm:pr-0 sm:opacity-0 sm:group-hover:visible sm:group-hover:opacity-100">
              <ul className="relative flex flex-col gap-7 whitespace-nowrap rounded-lg pt-8 text-xl text-black sm:gap-5 sm:bg-white sm:pb-8 sm:text-base sm:font-medium sm:shadow-center-lg">
                <li className="cursor-pointer sm:px-7">
                  <Link href="/user">Мой профиль</Link>
                </li>
                <li className="cursor-pointer sm:px-7">
                  <Link href="/user/survey">Анкета</Link>
                </li>
                <li className="cursor-pointer sm:px-7">
                  <Link href="/user/teams">Команды</Link>
                </li>
                <li className="cursor-pointer sm:px-7">
                  <Link href="/user/projects">Проекты</Link>
                </li>
                <li className="cursor-pointer sm:px-7">
                  <Link href="/user/requests">Заявки</Link>
                </li>
                <li className="cursor-pointer sm:px-7">
                  <Link href="/user/profile">Настройки</Link>
                </li>
                <li
                  className="cursor-pointer text-primary sm:px-7"
                  onClick={handleLogout}
                >
                  Выйти
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNav;
