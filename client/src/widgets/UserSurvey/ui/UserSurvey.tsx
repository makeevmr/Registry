"use client";
import { useProfileQuery } from "@/composites/Profile";
import { SubmitSurvey } from "@/features/SubmitSurvey";
import { Block, NamedBlock } from "@/shared/ui";
import Image from "next/image";
import { FC } from "react";

const UserSurvey: FC = () => {
  const { data: profile } = useProfileQuery();

  if (!profile) return <div></div>;

  // Check if user has email (required for surveys)
  if (!profile.user.email) {
    return (
      <NamedBlock
        accent={true}
        title={"Не указана корпоративная почта"}
        link="/user/profile"
      >
        <div className="flex h-full flex-col items-start">
          <div className="flex items-center">
            <div className="relative h-10 w-10">
              <Image fill={true} src="/warning-circle-icon-white.svg" alt="" />
            </div>
            <div className="pr-5" />
            <p className="font-medium">
              Для прохождения анкеты необходимо указать корпоративную почту в
              настройках профиля.
            </p>
          </div>
        </div>
      </NamedBlock>
    );
  }

  // Check if survey is completed
  const surveyCompleted = profile.survey?.submittedAt;

  return (
    <div>
      <h2 className="text-3xl uppercase">Анкета</h2>
      <div className="pt-5" />

      {!surveyCompleted && (
        <>
          <p className="pb-5 text-[#898989]">
            Заполните анкету для прохождения учебной практики
          </p>
          <SubmitSurvey />
        </>
      )}

      {surveyCompleted && (
        <SubmitSurvey isCompleted={true} />
      )}
    </div>
  );
};

export default UserSurvey;
