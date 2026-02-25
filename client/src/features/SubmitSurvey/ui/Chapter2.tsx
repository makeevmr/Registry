"use client";
import { FC } from "react";
import { Chapter2Data, KnowledgeLevel } from "../types/types";

interface Chapter2Props {
  data: Chapter2Data;
  onChange: (data: Partial<Chapter2Data>) => void;
}

const knowledgeLevels: { value: KnowledgeLevel; label: string }[] = [
  { value: "0", label: "0 - Не знаю" },
  { value: "1", label: "1 - Что-то слышал или читал, но не овладел" },
  { value: "2", label: "2 - Изучал информацию и частично разобрался" },
  { value: "3", label: "3 - Пробовал на практике в простых задачах" },
  { value: "4", label: "4 - Применял в проекте в команде" },
  {
    value: "5",
    label:
      "5 - Могу давать советы и решать проблемы и понимаю тенденции развития областей",
  },
];

const itSkills = [
  "Парадигмы программирования (ООП, функциональное, аспектно-ориентированное, и др.)",
  "Архитектура ПО",
  "Паттерны проектирования",
  "Протоколы коммуникаций (REST, gRPC, и др.)",
  "Алгоритмы и структуры данных",
  "Потоки и параллельность",
  "Linux в разработке и администрировании",
  "Windows в разработке и администрировании",
  "Проектирование и оптимизация баз данных",
  "Наука о данных и машинное обучение",
] as const;

const Chapter2: FC<Chapter2Props> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Question 1 */}
      <div>
        <label className="mb-2 block text-sm font-medium">1. Знания</label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
          rows={4}
          value={data.knowledge}
          onChange={(e) => onChange({ knowledge: e.target.value })}
          placeholder="Опишите ваши знания..."
        />
      </div>

      {/* Question 2 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          2. Оцените Ваши знания в области IT{" "}
          <span style={{ color: "#DC2626", fontSize: "1.25rem", fontWeight: "bold" }}>*</span>
        </label>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left text-sm">
                  Область знаний
                </th>
                {knowledgeLevels.map((level) => (
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
              {itSkills.map((skill) => (
                <tr key={skill} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 text-sm">
                    {skill}
                  </td>
                  {knowledgeLevels.map((level) => (
                    <td
                      key={level.value}
                      className="border border-gray-300 p-2 text-center"
                    >
                      <input
                        type="radio"
                        name={`it-knowledge-${skill}`}
                        checked={data.itKnowledge[skill] === level.value}
                        onChange={() =>
                          onChange({
                            itKnowledge: {
                              ...data.itKnowledge,
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
          3. Какими еще знаниями Вы владеете, релевантными для IT-отрасли и в
          какой степени? Перечислите их и оцените
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
          rows={4}
          value={data.otherKnowledge}
          onChange={(e) => onChange({ otherKnowledge: e.target.value })}
          placeholder="Опишите дополнительные знания..."
        />
      </div>
    </div>
  );
};

export default Chapter2;
