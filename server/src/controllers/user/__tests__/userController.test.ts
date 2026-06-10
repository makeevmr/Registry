import userService from "@/services/user";
import userController from "..";
import { staticUser } from "@/entities/user";
import { BadRequestError, UnauthorizedError } from "@/helpers/errors";
import projectStatusService from "@/services/project-status";
import profileService from "@/services/profile";

const req: any = {};

const res: any = {
  send: jest.fn(),
  json: jest.fn(),
  status: jest.fn(function (responseStatus) {
    // This next line makes it chainable
    return this;
  }),
  cookie: jest.fn(),
};

jest.mock("@/services/user");
jest.mock("@/services/project-status");
jest.mock("@/services/profile");

describe("User Controller", () => {
  describe("getProjectStatusData method", () => {
    it("should throw an UnauthorizedError when no user is specified in req.user", async () => {
      req.user = undefined;
      const nextMock = jest.fn();
      await userController.getProjectStatusData(req, res, nextMock);

      expect(nextMock.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    });
    it("should throw a BadRequestError when no user is specified in req.user", async () => {
      req.user = staticUser;
      req.params = { projectId: undefined };
      const nextMock = jest.fn();
      await userController.getProjectStatusData(req, res, nextMock);

      expect(nextMock.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
    });
    it("should send a json when everything is ok", async () => {
      req.params = { projectId: "1" };
      req.user = staticUser;
      await userController.getProjectStatusData(req, res, jest.fn());

      expect(res.json).toHaveBeenCalled();
    });

    it("should send a 200 status when everything is ok", async () => {
      req.params = { projectId: "1" };
      req.user = staticUser;
      await userController.getProjectStatusData(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should call projectStatusService.getAssignableTeams when everything is ok", async () => {
      req.params = { projectId: "1" };
      req.user = staticUser;
      await userController.getProjectStatusData(req, res, jest.fn());

      expect(projectStatusService.getAssignableTeams).toHaveBeenCalledWith(
        1,
        staticUser.id
      );
    });
  });

  describe("getProfileData method", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should throw an Unauthorized error if no user is specified in req.user", async () => {
      req.user = undefined;

      const nextMock = jest.fn();
      await userController.getProfileData(req, res, nextMock);

      expect(nextMock.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    });

    it("should send a json when everything is ok", async () => {
      req.user = staticUser;
      await userController.getProfileData(req, res, jest.fn());

      expect(res.json).toHaveBeenCalled();
    });

    it("should send a 200 status when everything is ok", async () => {
      req.user = staticUser;
      await userController.getProfileData(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should call profileService.getUserData when everything is ok", async () => {
      req.user = staticUser;
      await userController.getProfileData(req, res, jest.fn());

      expect(profileService.getUserData).toHaveBeenCalledWith(staticUser);
    });
  });
});
