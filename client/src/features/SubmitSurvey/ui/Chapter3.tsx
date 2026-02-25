"use client";
import { FC } from "react";
import { Chapter3Data } from "../types/types";

interface Chapter3Props {
  data: Chapter3Data;
  onChange: (data: Partial<Chapter3Data>) => void;
}

const Chapter3: FC<Chapter3Props> = ({ data, onChange }) => {
  return (
    <div className="flex flex-col gap-8">
      {/* Instructions */}
      <div className="space-y-6">
        <div className="rounded-lg bg-blue-50 p-6">
          <h4 className="mb-4 font-semibold">
            Опишите инструменты, c которыми Вы знакомы и оцените уровень знания
            инструмента в каждом из разделов, по следующей метрике:
          </h4>
          <ul className="mb-0 list-inside list-decimal space-y-1 text-sm">
            <li>Понимаю области применения инструмента</li>
            <li>
              Изучал документацию и статьи, пробовал инструмент на примерах из
              документации
            </li>
            <li>
              Применял в проекте в команде (инструмент использовало одновременно
              от 3 человек в совместной задаче)
            </li>
            <li>
              Постоянно использую инструмент и знаю как он развивается, слежу за
              известными проектами с данной технологией
            </li>
            <li>
              Могу решить практически любые вопросы, возникающие с данным
              инструментом
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-yellow-100 p-6">
        <p className="mb-2 font-semibold text-red-700">
          ВАЖНО, ВНИМАТЕЛЬНО ПРОЧИТАЙТЕ ТЕКСТ НИЖЕ:
        </p>
        <p className="mb-4 text-sm">
          Данные будут анализироваться автоматически, поэтому важно заполнять
          ответы на вопросы корректно.
        </p>

        <p className="mb-2 font-semibold">
          КАК ЗАПОЛНЯТЬ ОТВЕТЫ НА КАЖДЫЙ ВОПРОС В ДАННОМ РАЗДЕЛЕ:
        </p>
        <p className="mb-4 text-sm">
          Название инструмента с заглавной буквы, пробел, дефис, пробел,
          оценка по метрике, переход на следующую строку.
        </p>

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold">ПРИМЕР 1:</p>
            <div className="mt-1 rounded bg-white p-2 font-mono">
              C++ - 4<br />
              Java - 2<br />
              Python - 3
            </div>
          </div>

          <div>
            <p className="font-semibold">ПРИМЕР 2:</p>
            <div className="mt-1 rounded bg-white p-2 font-mono">
              Qt - 2<br />
              Numpy - 5
            </div>
          </div>

          <div>
            <p className="font-semibold">ПРИМЕР 3:</p>
            <div className="mt-1 rounded bg-white p-2 font-mono">
              Selenium - 1<br />
              Gatling - 1
            </div>
          </div>
        </div>
        </div>

        <p className="mt-4 text-sm italic">
          Если ни один инструмент из категории не знаком (например, не знаете
          ни один язык программирования), то просто не отвечайте на вопрос -
          оставьте поле для ответа пустым.
        </p>
      </div>

      {/* Question 1 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          1. Языки программирования (например: C++, Python, Java, etc)
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 font-mono text-sm outline-none focus:border-blue-500"
          rows={6}
          value={data.programmingLanguages}
          onChange={(e) => onChange({ programmingLanguages: e.target.value })}
          placeholder={"C++ - 4\nPython - 3\nJava - 2"}
        />
      </div>

      {/* Question 2 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          2. Библиотеки и фреймворки для различных направлений использования
          (например: Qt, Numpy, Weka, Angular, PyTorch, etc)
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 font-mono text-sm outline-none focus:border-blue-500"
          rows={6}
          value={data.librariesFrameworks}
          onChange={(e) => onChange({ librariesFrameworks: e.target.value })}
          placeholder={"Qt - 2\nNumpy - 5"}
        />
      </div>

      {/* Question 3 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          3. Инструменты для проектирования, бизнес и системного анализа
          (например: BPMN, UML, Archimate, ARIS etc)
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 font-mono text-sm outline-none focus:border-blue-500"
          rows={6}
          value={data.designTools}
          onChange={(e) => onChange({ designTools: e.target.value })}
          placeholder={"UML - 3\nBPMN - 2"}
        />
      </div>

      {/* Question 4 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          4. Инструменты для разработки ПО (например: VS Code, PyCharm, Git,
          etc)
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 font-mono text-sm outline-none focus:border-blue-500"
          rows={6}
          value={data.developmentTools}
          onChange={(e) => onChange({ developmentTools: e.target.value })}
          placeholder={"VS Code - 4\nGit - 5"}
        />
      </div>

      {/* Question 5 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          5. Инструменты для тестирования (например: GTests, Selenium, Gatling,
          pytest etc)
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 font-mono text-sm outline-none focus:border-blue-500"
          rows={6}
          value={data.testingTools}
          onChange={(e) => onChange({ testingTools: e.target.value })}
          placeholder={"Selenium - 1\nGatling - 1"}
        />
      </div>

      {/* Question 6 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          6. Инструменты CI / CD (например: Jenkins, Travis CI, Docker, etc)
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 font-mono text-sm outline-none focus:border-blue-500"
          rows={6}
          value={data.cicdTools}
          onChange={(e) => onChange({ cicdTools: e.target.value })}
          placeholder={"Docker - 3\nJenkins - 2"}
        />
      </div>

      {/* Question 7 */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          7. Инструменты для управления проектами (например: Jira, Trello, MS
          Project, etc)
        </label>
        <textarea
          className="w-full rounded border border-gray-300 p-3 font-mono text-sm outline-none focus:border-blue-500"
          rows={6}
          value={data.projectManagementTools}
          onChange={(e) =>
            onChange({ projectManagementTools: e.target.value })
          }
          placeholder={"Jira - 4\nTrello - 3"}
        />
      </div>
    </div>
  );
};

export default Chapter3;
