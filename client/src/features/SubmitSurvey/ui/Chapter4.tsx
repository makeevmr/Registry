"use client";
import { FC } from "react";
import { Chapter4Data, AnalyticalSkillLevel, SoftSkillLevel } from "../types/types";

interface Chapter4Props {
  data: Chapter4Data;
  onChange: (data: Partial<Chapter4Data>) => void;
}

const analyticalSkillLevels: { value: AnalyticalSkillLevel; label: string }[] = [
  { value: "0", label: "0 - Не знаю" },
  { value: "1", label: "1 - Слышал, но не применял" },
  { value: "2", label: "2 - Пробовал, и частично овладел" },
  { value: "3", label: "3 - Искал доп информацию и пытался прокачаться" },
  { value: "4", label: "4 - Постоянно применяю в работе и хорошо знаю теорию" },
  { value: "5", label: "5 - Могу обучать других и давать советы" },
];

const softSkillLevels: SoftSkillLevel[] = [
  "Плохо",
  "Ниже среднего",
  "Нормально",
  "Хорошо",
  "Отлично",
];

const analyticalSkills = [
  "Поиск информации (научные статьи, документация)",
  "Сбор и анализ требований к ПО",
  "Декомпозиция задач",
  "Планирование своей и чужой деятельности",
  "Тестирование",
  "Ведение документации",
] as const;

const softSkills = [
  "Самоуправление",
  "Коммуникации",
  "Работа в команде",
  "Наставничество",
  "Управление людьми",
] as const;

const Chapter4: FC<Chapter4Props> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Question 1 */}
      <div>
        <label className="mb-2 block text-sm font-medium">1. Навыки</label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
          rows={4}
          value={data.skills}
          onChange={(e) => onChange({ skills: e.target.value })}
          placeholder="Опишите ваши навыки..."
        />
      </div>

      {/* Question 2 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          2. Аналитические навыки{" "}
          <span style={{ color: "#DC2626", fontSize: "1.25rem", fontWeight: "bold" }}>*</span>
        </label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left text-sm">
                  Навык
                </th>
                {analyticalSkillLevels.map((level) => (
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
              {analyticalSkills.map((skill) => (
                <tr key={skill} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-sm">
                    {skill}
                  </td>
                  {analyticalSkillLevels.map((level) => (
                    <td
                      key={level.value}
                      className="border border-gray-300 p-2 text-center"
                    >
                      <input
                        type="radio"
                        name={`analytical-${skill}`}
                        checked={data.analyticalSkills[skill] === level.value}
                        onChange={() =>
                          onChange({
                            analyticalSkills: {
                              ...data.analyticalSkills,
                              [skill]: level.value,
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
          3. SoftSkills{" "}
          <span style={{ color: "#DC2626", fontSize: "1.25rem", fontWeight: "bold" }}>*</span>
        </label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left text-sm">
                  Навык
                </th>
                {softSkillLevels.map((level) => (
                  <th
                    key={level}
                    className="border border-gray-300 p-2 text-center text-xs"
                  >
                    {level}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {softSkills.map((skill) => (
                <tr key={skill} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-sm">
                    {skill}
                  </td>
                  {softSkillLevels.map((level) => (
                    <td
                      key={level}
                      className="border border-gray-300 p-2 text-center"
                    >
                      <input
                        type="radio"
                        name={`soft-${skill}`}
                        checked={data.softSkills[skill] === level}
                        onChange={() =>
                          onChange({
                            softSkills: {
                              ...data.softSkills,
                              [skill]: level,
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
          4. Какими еще навыками в области IT Вы обладаете? Оцените данные
          навыки
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
          rows={4}
          value={data.otherSkills}
          onChange={(e) => onChange({ otherSkills: e.target.value })}
          placeholder="Опишите дополнительные навыки..."
        />
      </div>
    </div>
  );
};

export default Chapter4;
