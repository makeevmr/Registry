import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserFormsPreview from "../UserFormsPreview";
import {
  staticProfileTeamAssigned,
  useProfileQuery,
} from "@/composites/Profile";

jest.mock("@/composites/Profile", () => {
  const original = jest.requireActual("@/composites/Profile");

  return {
    ...original,
    useProfileQuery: jest.fn(),
  };
});

describe("UserFormsPreview widget UI", () => {
  describe("User logged in", () => {
    beforeAll(() => {
      (useProfileQuery as jest.Mock).mockReturnValue({
        data: { ...staticProfileTeamAssigned, survey: null },
      });
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should inform the user if the survey is not completed", () => {
      const { getByText } = render(<UserFormsPreview />);

      const warning = getByText(/Вы не прошли анкету/i);
      expect(warning).toBeVisible();
    });

    it("should show a redirect button when not completed", () => {
      const { getByText } = render(<UserFormsPreview />);

      const button = getByText(/Пройти анкету/i);
      expect(button).toBeVisible();
    });

    it("should show completed state when the survey is submitted", () => {
      (useProfileQuery as jest.Mock).mockReturnValueOnce({
        data: {
          ...staticProfileTeamAssigned,
          survey: { id: 1, submittedAt: "2023-10-26T15:43:25.385Z" },
        },
      });

      const { getByText } = render(<UserFormsPreview />);

      const completed = getByText(/Анкета заполнена/i);
      expect(completed).toBeVisible();
    });
  });

  describe("User not logged in", () => {
    beforeAll(() => {
      (useProfileQuery as jest.Mock).mockReturnValue({
        data: null,
      });
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("shouldn't render the block", () => {
      const { queryByText } = render(<UserFormsPreview />);

      const title = queryByText(/Анкета/i);

      expect(title).not.toBeInTheDocument();
    });
  });
});
