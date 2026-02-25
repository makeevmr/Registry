"use client";
import { FC } from "react";
import { Chapter5Data, MotivationLevel, YesNo } from "../types/types";

interface Chapter5Props {
  data: Chapter5Data;
  onChange: (data: Partial<Chapter5Data>) => void;
}

const motivationLevels: { value: MotivationLevel; label: string }[] = [
  { value: "0", label: "0 - Не хочу" },
  { value: "1", label: "1 - Вроде хочу что-то делать, но лень" },
  { value: "2", label: "2 - Хочу что-то делать, но не знаю что и как" },
  {
    value: "3",
    label: "3 - Готов выполнять задания, но если в них вижу личную выгоду/интерес",
  },
  { value: "4", label: "4 - Готов выполнять задания на благо команды" },
  { value: "5", label: "5 - Готов сам стать мотиватором для других" },
];

const motivationAreas = [
  "К работе над интересными проектами",
  "Определить свой путь дальнейшего развития и развиваться в IT",
  "Устроиться на интересную для себя работу",
] as const;

const yesNoOptions: YesNo[] = ["Да", "Нет"];

const Chapter5: FC<Chapter5Props> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Question 1 */}
      <div>
        <label className="mb-2 block text-sm font-medium">1. Мотивация</label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
          rows={4}
          value={data.motivation}
          onChange={(e) => onChange({ motivation: e.target.value })}
          placeholder="Опишите вашу мотивацию..."
        />
      </div>

      {/* Question 2 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          2. Оцените Ваш уровень мотивации{" "}
          <span style={{ color: "#DC2626", fontSize: "1.25rem", fontWeight: "bold" }}>*</span>
        </label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left text-sm">
                  Область мотивации
                </th>
                {motivationLevels.map((level) => (
                  <th
                    key={level.value}
                    className="border border-gray-300 p-2 text-center text-xs"
                  >
                    {level.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {motivationAreas.map((area) => (
                <tr key={area} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-sm">
                    {area}
                  </td>
                  {motivationLevels.map((level) => (
                    <td
                      key={level.value}
                      className="border border-gray-300 p-2 text-center"
                    >
                      <input
                        type="radio"
                        name={`motivation-${area}`}
                        checked={data.motivationLevels[area] === level.value}
                        onChange={() =>
                          onChange({
                            motivationLevels: {
                              ...data.motivationLevels,
                              [area]: level.value,
                            },
                          })
                        }
                        className="h-4 w-4 cursor-pointer"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question 3 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          3. Хотите ли Вы общаться с другими студентами и выпускниками,
          заинтересованными в развитии в области IT на базе СПбГУ на
          интересующие Вас темы?{" "}
          <span style={{ color: "#DC2626", fontSize: "1.25rem", fontWeight: "bold" }}>*</span>
        </label>
        <div className="flex gap-6">
          {yesNoOptions.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name="want-to-communicate"
                checked={data.wantToCommunicate === option}
                onChange={() => onChange({ wantToCommunicate: option })}
                className="h-4 w-4 cursor-pointer"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 4 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          4. Что Вам поможет развиваться быстрее в том направлении
          деятельности, которое Вы выбрали?
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
          rows={4}
          value={data.developmentHelp}
          onChange={(e) => onChange({ developmentHelp: e.target.value })}
          placeholder="Опишите, что поможет вам развиваться..."
        />
      </div>
    </div>
  );
};

export default Chapter5;
