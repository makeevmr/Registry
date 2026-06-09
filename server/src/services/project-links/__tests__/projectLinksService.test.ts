import { staticUser } from "@/entities/user";
import projectLinksService from "..";
import projectRepository from "@/repositories/project";
import {
  BadRequestError,
  ServerError,
  UnauthorizedError,
} from "@/helpers/errors";
import { staticProjectList } from "@/entities/project";
import platformRepository from "@/repositories/platform";
import { staticPlatformList } from "@/entities/platform";
import projectLinksRepository from "@/repositories/project-links";

jest.mock("@/repositories/project");
jest.mock("@/repositories/platform");
jest.mock("@/repositories/project-links");

describe("projectLinksServices", () => {
  describe("add method", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should fetch the project", async () => {
      try {
        await projectLinksService.add(
          "1",
          "GitHub",
          "https://example.com",
          staticUser
        );
      } catch {}

      expect(projectRepository.findOne).toHaveBeenCalled();
    });

    it("should throw an error if the project is not found", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce(null);

      expect(
        projectLinksService.add(
          "1",
          "GitHub",
          "https://example.com",
          staticUser
        )
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the project's administrators property is not defined", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
      });

      expect(
        projectLinksService.add(
          "1",
          "GitHub",
          "https://example.com",
          staticUser
        )
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the user is not an administrator", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [
          {
            id: 1,
            name: "Test",
            email: "test@test.com",
          },
        ],
      });

      const user = {
        id: 2,
        name: "User",
        email: "user@test.com",
        phone: "+7 999 999 99 99",
        userType: "student" as const,
      };

      expect(
        projectLinksService.add("1", "GitHub", "https://example.com", user)
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should fetch the platform", async () => {
      const user = {
        id: 1,
        name: "User",
        email: "user@test.com",
        phone: "+7 999 999 99 99",
        userType: "student" as const,
      };

      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [user],
      });
      (platformRepository.findOne as jest.Mock).mockReturnValueOnce(
        staticPlatformList[0]
      );

      await projectLinksService.add("1", "GitHub", "https://example.com", user);

      expect(platformRepository.findOne).toHaveBeenCalled();
    });

    it("should throw an error if the platform isn't in the database", async () => {
      const user = {
        id: 1,
        name: "User",
        email: "user@test.com",
        phone: "+7 999 999 99 99",
        userType: "student" as const,
      };

      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [user],
      });
      (platformRepository.findOne as jest.Mock).mockReturnValueOnce(null);

      expect(
        projectLinksService.add("1", "GitHub", "https://example.com", user)
      ).rejects.toThrow(ServerError);
    });

    it("should call the repository's add method if everything is ok", async () => {
      const user = {
        id: 1,
        name: "User",
        email: "user@test.com",
        phone: "+7 999 999 99 99",
        userType: "student" as const,
      };

      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [user],
      });
      (platformRepository.findOne as jest.Mock).mockReturnValueOnce(
        staticPlatformList[0]
      );

      await projectLinksService.add("1", "GitHub", "https://example.com", user);

      expect(projectLinksRepository.add).toHaveBeenCalled();
    });
  });

  describe("deleteLink method", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should fetch the project", async () => {
      try {
        await projectLinksService.deleteLink("1", 1, staticUser);
      } catch {}

      expect(projectRepository.findOne).toHaveBeenCalled();
    });

    it("should throw an error if the project is not found", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce(null);

      expect(
        projectLinksService.deleteLink("1", 1, staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the project's administrators property is not defined", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
      });

      expect(
        projectLinksService.deleteLink("1", 1, staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the user is not an administrator", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [
          {
            id: 1,
            name: "Test",
            email: "test@test.com",
          },
        ],
      });

      const user = {
        id: 2,
        name: "User",
        email: "user@test.com",
        phone: "+7 999 999 99 99",
        userType: "student" as const,
      };

      expect(projectLinksService.deleteLink("1", 1, user)).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("should call the repository's deleteLink method if everything is ok", async () => {
      const user = {
        id: 1,
        name: "User",
        email: "user@test.com",
        phone: "+7 999 999 99 99",
        userType: "student" as const,
      };

      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [user],
      });
      (platformRepository.findOne as jest.Mock).mockReturnValueOnce(
        staticPlatformList[0]
      );

      await projectLinksService.deleteLink("1", 1, user);

      expect(projectLinksRepository.deleteLink).toHaveBeenCalled();
    });
  });
});
