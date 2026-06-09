import { UserNav } from "@/features/UserNav";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import CreateProjectLink from "./CreateProjectLink";

interface HeaderProps {
  text?: "bright" | "dark";
}

const Header: FC<HeaderProps> = ({ text = "bright" }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <Link href="/">
            <Image
              src={text == "bright" ? "/logo.svg" : "/logo-dark.svg"}
              alt=""
              height="50"
              width="140"
              priority
            />
          </Link>
        </div>
        <div
          className={`py-9 pl-6 transition-transform ${
            text == "bright" ? "text-white" : "text-black"
          } flex flex-row`}
        >
          <ul className="mr-10 hidden flex-col gap-7 text-xl sm:flex sm:flex-row sm:items-center sm:gap-0 sm:text-base">
            <CreateProjectLink />
            <li className="mr-4">
              <Link href="/projects">Список проектов</Link>
            </li>
            <li>
              <Link href="/#contact">Заказчикам</Link>
            </li>
          </ul>
          <UserNav text={text} />
        </div>
      </div>
    </div>
  );
};

export default Header;
