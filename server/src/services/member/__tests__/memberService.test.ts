import { Member, staticMembers } from "@/entities/member";
import memberService from "..";
import { User, staticUser } from "@/entities/user";
import teamRepository from "@/repositories/team";
import { staticTeams } from "@/entities/team";
import { TeamWithAdministrators } from "@/entities/team/types/types";
import memberRepository from "@/repositories/member";
import { UnauthorizedError } from "@/helpers/errors";

jest.mock("@/repositories/team");
jest.mock("@/repositories/member");
jest.mock("@/services/user-role");

describe("memberService", () => {
  describe("edit method", () => {
    it("should call teamRepository.findOne", async () => {
      const member = staticMembers[0];
      const user = staticUser;

      try {
        await memberService.edit(member, user);
      } catch {}

      expect(teamRepository.findOne).toHaveBeenCalled();
    });

    it("should allow editing if the user is the team's administrator", async () => {
      const teams: TeamWithAdministrators[] = [
        {
          id: 1,
          name: "Test",
          administrators: [1],
          members: [2],
        },
      ];
      (teamRepository.findOne as jest.Mock).mockReturnValueOnce({
        teams: teams,
      });

      const member: Member = {
        id: 1,
        name: "TestMember",
        roles: ["Test Role"],
        isAdministrator: false,
        team: 1,
        user: 2,
      };

      const user: User = {
        id: 1,
        name: "User",
        email: "test@test.com",
        phone: "+7 999 999 99 99",
        userType: "student",
      };

      await memberService.edit(member, user);

      expect(memberRepository.edit).toHaveBeenCalled();
    });

    it("should allow editing if the user is the edited member", async () => {
      const teams: TeamWithAdministrators[] = [
        {
          id: 1,
          name: "Test",
          administrators: [2],
          members: [1],
        },
      ];
      (teamRepository.findOne as jest.Mock).mockReturnValueOnce({
        teams: teams,
      });

      const member: Member = {
        id: 1,
        name: "TestMember",
        roles: ["Test Role"],
        isAdministrator: false,
        team: 1,
        user: 1,
      };

      const user: User = {
        id: 1,
        name: "User",
        email: "test@test.com",
        phone: "+7 999 999 99 99",
        userType: "student",
      };

      await memberService.edit(member, user);

      expect(memberRepository.edit).toHaveBeenCalled();
    });

    it("should throw an error if the user is neither the administrator nor the edited member", async () => {
      const teams: TeamWithAdministrators[] = [
        {
          id: 1,
          name: "Test",
          administrators: [2],
          members: [2],
        },
      ];
      (teamRepository.findOne as jest.Mock).mockReturnValueOnce({
        teams: teams,
      });

      const member: Member = {
        id: 1,
        name: "TestMember",
        roles: ["Test Role"],
        isAdministrator: false,
        team: 1,
        user: 2,
      };

      const user: User = {
        id: 1,
        name: "User",
        email: "test@test.com",
        phone: "+7 999 999 99 99",
        userType: "student",
      };

      expect(memberService.edit(member, user)).rejects.toThrow(
        UnauthorizedError
      );

      expect(memberRepository.edit).toHaveBeenCalled();
    });
  });
});
