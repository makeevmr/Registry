"use client";
import { FC } from "react";
import { Chapter1Data, RoleInterest, DirectionInterest } from "../types/types";

interface Chapter1Props {
  data: Chapter1Data;
  onChange: (data: Partial<Chapter1Data>) => void;
}

const roleOptions: RoleInterest[] = [
  "Не интересно",
  "Интересно, можно попробовать",
  "Хочу поучаствовать в проекте в этой роли и развиваться дальше в этой области",
];

const directionOptions: DirectionInterest[] = [
  "Не интересно",
  "Интересно, можно попробовать",
  "Хочу поучаствовать в проекте по этому направлению",
];

const roles = [
  "Бизнес и системный анализ",
  "Дизайн UX / UI и проектирование интерфейсов",
  "Анализ и инженерия данных",
  "Backend - разработка",
  "Frontend - разработка",
  "Тестирование и обеспечение качества",
  "Развертывание и внедрение",
  "Управление командой / проектом",
] as const;

const directions = [
  "Разработка веб-сервисов (сайты, сервисы)",
  "Анализ текстов и поисковые движки",
  "Анализ изображений / видео",
  "Анализ временных рядов",
  "Анализ табличных данных",
  "Робототехника (оборудование, теория управления, техническое зрение, интерфейсы)",
  "Gamedev",
] as const;

const Chapter1: FC<Chapter1Props> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Question 1 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          1. Пожелания по направлению развития и текущий опыт
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
          rows={4}
          value={data.developmentWishes}
          onChange={(e) =>
            onChange({ developmentWishes: e.target.value })
          }
          placeholder="Опишите ваши пожелания..."
        />
      </div>

      {/* Question 2 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          2. Выберете интересующие Вас роли в IT{" "}
          <span style={{ color: "#DC2626", fontSize: "1.25rem", fontWeight: "bold" }}>*</span>
        </label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left text-sm">
                  Роль
                </th>
                {roleOptions.map((option) => (
                  <th
                    key={option}
                    className="border border-gray-300 p-2 text-center text-xs"
                  >
                    {option}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-sm">
                    {role}
                  </td>
                  {roleOptions.map((option) => (
                    <td
                      key={option}
                      className="border border-gray-300 p-2 text-center"
                    >
                      <input
                        type="radio"
                        name={`role-${role}`}
                        checked={data.roleInterests[role] === option}
                        onChange={() =>
                          onChange({
                            roleInterests: {
                              ...data.roleInterests,
                              [role]: option,
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
          3. Выберете интересные для вас направление проекта{" "}
          <span style={{ color: "#DC2626", fontSize: "1.25rem", fontWeight: "bold" }}>*</span>
        </label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left text-sm">
                  Направление
                </th>
                {directionOptions.map((option) => (
                  <th
                    key={option}
                    className="border border-gray-300 p-2 text-center text-xs"
                  >
                    {option}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {directions.map((direction) => (
                <tr key={direction} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-sm">
                    {direction}
                  </td>
                  {directionOptions.map((option) => (
                    <td
                      key={option}
                      className="border border-gray-300 p-2 text-center"
                    >
                      <input
                        type="radio"
                        name={`direction-${direction}`}
                        checked={data.directionInterests[direction] === option}
                        onChange={() =>
                          onChange({
                            directionInterests: {
                              ...data.directionInterests,
                              [direction]: option,
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

      {/* Question 4 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          4. Если в предыдущем вопросе для Вас не было интересного направления
          деятельности, расскажите нам об области, в которой Вы хотите
          развиваться
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
          rows={4}
          value={data.otherDirection}
          onChange={(e) => onChange({ otherDirection: e.target.value })}
          placeholder="Опишите интересующую область..."
        />
      </div>

      {/* Question 5 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          5. Если Вы уже работаете над интересным проектом или успешно завершили
          - опишите, что это за проект и свою роль в нем (можете добавить ссылку
          на репозиторий)
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
          rows={4}
          value={data.currentProject}
          onChange={(e) => onChange({ currentProject: e.target.value })}
          placeholder="Опишите ваш проект..."
        />
      </div>
    </div>
  );
};

export default Chapter1;
