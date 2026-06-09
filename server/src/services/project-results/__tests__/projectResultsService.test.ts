import { staticUser } from "@/entities/user";
import projectResultsService from "..";
import projectRepository from "@/repositories/project";
import { ServerError, UnauthorizedError } from "@/helpers/errors";
import { staticProjectList } from "@/entities/project";
import projectResultsRepository from "@/repositories/project-results";
import projectFileTypeService from "@/services/project-file-type";

jest.mock("@/repositories/project");
jest.mock("@/repositories/project-results");
jest.mock("@/services/project-file-type", () => ({
  findAll: jest.fn().mockReturnValue([
    {
      id: 1,
      name: "2",
      isPublic: true,
    },
  ]),
}));

const file = { name: "testfile.jpg" } as any;

describe("projectResultsService", () => {
  describe("uploadFile method", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should fetch the project", async () => {
      try {
        await projectResultsService.uploadFile("1", file, "2", staticUser);
      } catch {}

      expect(projectRepository.findOne).toHaveBeenCalled();
    });

    it("should fetch all file types", async () => {
      try {
        await projectResultsService.uploadFile("1", file, "2", staticUser);
      } catch {}

      expect(projectFileTypeService.findAll).toHaveBeenCalled();
    });

    it("should throw an error if the file type is not in DB", async () => {
      (projectFileTypeService.findAll as jest.Mock).mockReturnValueOnce([]);
      expect(
        projectResultsService.uploadFile("1", file, "2", staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the project is not in DB", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce(null);

      expect(
        projectResultsService.uploadFile("1", file, "2", staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the project's administrators property is not defined", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
      });

      expect(
        projectResultsService.uploadFile("1", file, "2", staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the user is not a project's administrator", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [
          {
            id: 1,
            name: "Test",
            email: "test@test.com",
            phone: "+7 999 999 99 99",
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
        projectResultsService.uploadFile("1", file, "2", user)
      ).rejects.toThrow(UnauthorizedError);

      expect(
        projectResultsService.uploadFile("1", file, "2", staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should call the repository's addFiles method if everything is ok", async () => {
      const user = {
        id: 2,
        name: "User",
        email: "user@test.com",
        phone: "+7 999 999 99 99",
        userType: "student" as const,
      };

      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [user],
      });

      await projectResultsService.uploadFile("1", file, "2", user);

      expect(projectResultsRepository.addFile).toHaveBeenCalled();
    });
  });

  describe("deleteFile method", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should fetch the project", async () => {
      try {
        await projectResultsService.deleteFile("1", 1, staticUser);
      } catch {}

      expect(projectRepository.findOne).toHaveBeenCalled();
    });

    it("should throw an error if the project is not in DB", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce(null);

      expect(
        projectResultsService.deleteFile("1", 1, staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the project's administrators property is not defined", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
      });

      expect(
        projectResultsService.deleteFile("1", 1, staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the user is not a project's administrator", async () => {
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

      expect(projectResultsService.deleteFile("1", 1, user)).rejects.toThrow(
        UnauthorizedError
      );

      expect(
        projectResultsService.deleteFile("1", 1, staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should call the repository's addFiles method if everything is ok", async () => {
      const user = {
        id: 2,
        name: "User",
        email: "user@test.com",
        phone: "+7 999 999 99 99",
        userType: "student" as const,
      };

      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [user],
      });

      await projectResultsService.deleteFile("1", 1, user);

      expect(projectResultsRepository.deleteFile).toHaveBeenCalled();
    });
  });

  describe("changeFile method", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should fetch the project", async () => {
      try {
        await projectResultsService.changeFile("1", 1, {} as any, staticUser);
      } catch {}

      expect(projectRepository.findOne).toHaveBeenCalled();
    });

    it("should throw an error if the project is not in DB", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce(null);

      expect(
        projectResultsService.changeFile("1", 1, {} as any, staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the project's administrators property is not defined", async () => {
      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
      });

      expect(
        projectResultsService.changeFile("1", 1, {} as any, staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should throw an error if the user is not a project's administrator", async () => {
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
      };

      expect(
        projectResultsService.changeFile("1", 1, {} as any, staticUser)
      ).rejects.toThrow(UnauthorizedError);

      expect(
        projectResultsService.changeFile("1", 1, {} as any, staticUser)
      ).rejects.toThrow(ServerError);
    });

    it("should call the repository's addFiles method if everything is ok", async () => {
      const user = {
        id: 2,
        name: "User",
        email: "user@test.com",
      };

      (projectRepository.findOne as jest.Mock).mockReturnValueOnce({
        project: staticProjectList[0],
        administrators: [user],
      });

      await projectResultsService.changeFile("1", 1, {} as any, staticUser);

      expect(projectResultsRepository.changeFile).toHaveBeenCalled();
    });
  });
});
