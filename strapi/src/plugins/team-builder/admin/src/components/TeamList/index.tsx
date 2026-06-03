import React, { FC, useState, useMemo } from "react";
import { Box } from "@strapi/design-system";
import { Plus } from "@strapi/icons";
import {
  AddTeamInList,
  Draggable,
  StudentBackground,
  StudentBorder,
  StudentInList,
  StudentList,
  StudentRemove,
  TeamInList,
  TeamListStyled,
  TeamName,
} from "./styles";
import Marginer from "../shared/Marginer";
import { useDnD } from "./hooks/useDnD";
import { useDraftTeamsStore } from "../../entities/Team/model";
import { formatNameShort, useStudentStore } from "../../entities/Student";
import UserAdd from "../UserAdd";
import TeamInspect from "../TeamInspect";
import { IStudentDetailed } from "../../entities/Student/types";
import { useProjectStore } from "../../entities/Project";

interface TeamListProps {}

const TeamList: FC<TeamListProps> = () => {
  const { draggedTo, handleDragStart } = useDnD();
  const [userAddTeamIndex, setUserAddTeamIndex] = useState<number | null>(null);
  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number | null>(
    null
  );

  const { teams, addTeam, removeTeam, addStudents, removeStudent } =
    useDraftTeamsStore();

  const { students } = useStudentStore();

  const { projects } = useProjectStore();

  const projectsMap = useMemo(() => {
    const map = new Map<number, string>();

    projects.forEach((project) => {
      map.set(project.id, project.name);
    });

    return map;
  }, [projects]);

  const studentsMap = useMemo(() => {
    const map = new Map<number, IStudentDetailed>();

    students.forEach((student) => {
      map.set(student.id, student);
    });

    return map;
  }, [students]);

  return (
    <>
      {userAddTeamIndex !== null && (
        <UserAdd
          onCancel={() => setUserAddTeamIndex(null)}
          onConfirm={(students) => {
            addStudents(userAddTeamIndex, students);
            setUserAddTeamIndex(null);
          }}
        />
      )}
      {selectedTeamIndex !== null && (
        <TeamInspect
          team={teams[selectedTeamIndex]}
          onCancel={() => setSelectedTeamIndex(null)}
          onDelete={() => {
            removeTeam(selectedTeamIndex);
            setSelectedTeamIndex(null);
          }}
        />
      )}
      <TeamListStyled onMouseDown={handleDragStart}>
        {teams.map((team, index) => (
          <TeamInList>
            <Box
              background="neutral0"
              hasRadius
              shadow="filterShadow"
              paddingTop={8}
              paddingBottom={8}
              paddingLeft={7}
              paddingRight={7}
              height="100%"
            >
              <TeamName onClick={() => setSelectedTeamIndex(index)}>
                {team.project != null && projectsMap.has(team.project)
                  ? projectsMap.get(team.project)
                  : `Team ${index + 1}`}
              </TeamName>
              <Marginer vertical={20} />
              <StudentList>
                {team.students.map((student, studentIndex) => (
                  <>
                    {draggedTo.teamIndex == index &&
                      draggedTo.studentIndex == studentIndex && (
                        <StudentInList>
                          <StudentBorder />
                        </StudentInList>
                      )}
                    <StudentInList>
                      <StudentBackground />
                      <Box
                        background="neutral0"
                        hasRadius
                        shadow="filterShadow"
                        height="35px"
                      >
                        <Draggable data-drag>
                          <StudentRemove
                            onClick={(e: React.MouseEvent) => {
                              removeStudent(index, studentIndex);
                            }}
                          >
                            <Plus />
                          </StudentRemove>
                          {studentsMap.has(student)
                            ? formatNameShort(studentsMap.get(student)!.name)
                            : ""}
                        </Draggable>
                      </Box>
                    </StudentInList>
                  </>
                ))}
                {draggedTo.teamIndex == index &&
                  draggedTo.studentIndex == team.students.length && (
                    <StudentInList>
                      <StudentBorder />
                    </StudentInList>
                  )}
              </StudentList>
              <Marginer vertical={10} />
              <Box
                background="primary100"
                hasRadius
                shadow="filterShadow"
                paddingTop={3}
                paddingBottom={3}
                paddingLeft={7}
                paddingRight={7}
                onClick={() => setUserAddTeamIndex(index)}
              >
                <Plus />
              </Box>
            </Box>
          </TeamInList>
        ))}
        <TeamInList>
          <Box
            background="primary100"
            hasRadius
            shadow="filterShadow"
            paddingTop={3}
            paddingBottom={3}
            paddingLeft={7}
            paddingRight={7}
            height="100%"
            width="100%"
            onClick={addTeam}
          >
            <AddTeamInList>
              <Plus />
            </AddTeamInList>
          </Box>
        </TeamInList>
      </TeamListStyled>
    </>
  );
};

export default TeamList;
