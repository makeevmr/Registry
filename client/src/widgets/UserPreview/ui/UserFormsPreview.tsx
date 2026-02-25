"use client";
import { useProfileQuery } from "@/composites/Profile";
import { Button, ButtonAlt, NamedBlock } from "@/shared/ui";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface UserFormsPreviewProps {
  className?: string;
}

const UserFormsPreview: FC<UserFormsPreviewProps> = ({ className }) => {
  const { data: profile } = useProfileQuery();

  if (!profile) return <div></div>;

  // Check if internal survey is completed
  const surveyCompleted = profile.survey?.submittedAt;

  if (!surveyCompleted)
    return (
      <NamedBlock
        accent={true}
        className={className}
        title={"Анкета"}
        link="/user/survey"
      >
        <div className="flex h-full flex-col items-start">
          <div className="flex items-center">
            <div className="relative h-10 w-10">
              <Image fill={true} src="/warning-circle-icon-white.svg" alt="" />
            </div>
            <div className="pr-5" />
            <p className="font-medium">Вы не прошли анкету</p>
          </div>
          <div className="pt-11" />
          <Link href="/user/survey">
            <ButtonAlt className="mt-auto rounded-full px-8 py-3">
              Пройти анкету
            </ButtonAlt>
          </Link>
        </div>
      </NamedBlock>
    );

  return (
    <NamedBlock className={className} title={"Анкета"} link="/user/survey">
      <div className="flex h-full flex-col items-start">
        <div className="flex items-center gap-4">
          <div className="relative h-10 w-10">
            <Image src="/checked-circle-icon.svg" fill={true} alt="" />
          </div>
          <div>
            <p className="font-medium">Анкета заполнена</p>
            <p className="text-sm text-[#898989]">
              {new Date(surveyCompleted).toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </NamedBlock>
  );
};

export default UserFormsPreview;
