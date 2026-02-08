import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DepositForm from "@/components/deposit/DepositForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

const mockFunds = [
  { isin: "FR0000001111", fundName: "Fonds Actions Europe", latestValorisation: { date: "2026-02-08", value: 150.25 } },
  { isin: "FR0000002222", fundName: "Fonds Obligations", latestValorisation: { date: "2026-02-08", value: 102.50 } },
];

describe("DepositForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders all form fields", () => {
      render(<DepositForm funds={mockFunds} />);

      expect(screen.getByLabelText("Montant (EUR)")).toBeInTheDocument();
      expect(screen.getByLabelText("RIB")).toBeInTheDocument();
      expect(screen.getByLabelText("BIC")).toBeInTheDocument();
      expect(screen.getByLabelText("Date du versement")).toBeInTheDocument();
    });

    it("renders submit button disabled initially", () => {
      render(<DepositForm funds={mockFunds} />);

      const submitButton = screen.getByRole("button", { name: "Valider le versement" });
      expect(submitButton).toBeDisabled();
    });

    it("renders fund selector with fund names", () => {
      render(<DepositForm funds={mockFunds} />);

      expect(screen.getByText("Sélectionnez vos fonds")).toBeInTheDocument();
      expect(screen.getByText("Fonds Actions Europe")).toBeInTheDocument();
      expect(screen.getByText("Fonds Obligations")).toBeInTheDocument();
    });

    it("renders checkboxes for each fund", () => {
      render(<DepositForm funds={mockFunds} />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(2);
    });
  });

  describe("amount validation", () => {
    it("accepts valid positive numbers", async () => {
      render(<DepositForm funds={mockFunds} />);

      const amountInput = screen.getByLabelText("Montant (EUR)");
      await userEvent.type(amountInput, "1000");

      expect(amountInput).toHaveValue("1000");
    });

    it("accepts decimal numbers with 2 decimal places", async () => {
      render(<DepositForm funds={mockFunds} />);

      const amountInput = screen.getByLabelText("Montant (EUR)");
      await userEvent.type(amountInput, "1000.50");

      expect(amountInput).toHaveValue("1000.50");
    });

    it("rejects letters in amount field", async () => {
      render(<DepositForm funds={mockFunds} />);

      const amountInput = screen.getByLabelText("Montant (EUR)");
      await userEvent.type(amountInput, "abc");

      expect(amountInput).toHaveValue("");
    });

    it("shows error for amount of 0", async () => {
      render(<DepositForm funds={mockFunds} />);

      const amountInput = screen.getByLabelText("Montant (EUR)");
      await userEvent.type(amountInput, "0");

      expect(screen.getByText("Le montant doit être supérieur à 0")).toBeInTheDocument();
    });
  });

  describe("IBAN validation", () => {
    it("shows error for invalid IBAN after blur", async () => {
      render(<DepositForm funds={mockFunds} />);

      const ribInput = screen.getByLabelText("RIB");
      await userEvent.type(ribInput, "invalid");
      fireEvent.blur(ribInput);

      expect(screen.getByText("Format IBAN invalide")).toBeInTheDocument();
    });

    it("does not show error while typing (before blur)", async () => {
      render(<DepositForm funds={mockFunds} />);

      const ribInput = screen.getByLabelText("RIB");
      await userEvent.type(ribInput, "invalid");

      expect(screen.queryByText("Format IBAN invalide")).not.toBeInTheDocument();
    });

    it("accepts valid French IBAN", async () => {
      render(<DepositForm funds={mockFunds} />);

      const ribInput = screen.getByLabelText("RIB");
      await userEvent.type(ribInput, "FR7630001007941234567890185");
      fireEvent.blur(ribInput);

      expect(screen.queryByText("Format IBAN invalide")).not.toBeInTheDocument();
    });

    it("accepts IBAN with spaces (normalized)", async () => {
      render(<DepositForm funds={mockFunds} />);

      const ribInput = screen.getByLabelText("RIB");
      await userEvent.type(ribInput, "FR76 3000 1007 9412 3456 7890 185");
      fireEvent.blur(ribInput);

      expect(screen.queryByText("Format IBAN invalide")).not.toBeInTheDocument();
    });

    it("accepts lowercase IBAN (normalized to uppercase)", async () => {
      render(<DepositForm funds={mockFunds} />);

      const ribInput = screen.getByLabelText("RIB");
      await userEvent.type(ribInput, "fr7630001007941234567890185");
      fireEvent.blur(ribInput);

      expect(screen.queryByText("Format IBAN invalide")).not.toBeInTheDocument();
    });
  });

  describe("BIC validation", () => {
    it("shows error for invalid BIC after blur", async () => {
      render(<DepositForm funds={mockFunds} />);

      const bicInput = screen.getByLabelText("BIC");
      await userEvent.type(bicInput, "invalid");
      fireEvent.blur(bicInput);

      expect(screen.getByText("Format BIC invalide")).toBeInTheDocument();
    });

    it("does not show error while typing (before blur)", async () => {
      render(<DepositForm funds={mockFunds} />);

      const bicInput = screen.getByLabelText("BIC");
      await userEvent.type(bicInput, "invalid");

      expect(screen.queryByText("Format BIC invalide")).not.toBeInTheDocument();
    });

    it("accepts valid 8-character BIC", async () => {
      render(<DepositForm funds={mockFunds} />);

      const bicInput = screen.getByLabelText("BIC");
      await userEvent.type(bicInput, "BNPAFRPP");
      fireEvent.blur(bicInput);

      expect(screen.queryByText("Format BIC invalide")).not.toBeInTheDocument();
    });

    it("accepts valid 11-character BIC", async () => {
      render(<DepositForm funds={mockFunds} />);

      const bicInput = screen.getByLabelText("BIC");
      await userEvent.type(bicInput, "BNPAFRPPXXX");
      fireEvent.blur(bicInput);

      expect(screen.queryByText("Format BIC invalide")).not.toBeInTheDocument();
    });

    it("accepts lowercase BIC (normalized to uppercase)", async () => {
      render(<DepositForm funds={mockFunds} />);

      const bicInput = screen.getByLabelText("BIC");
      await userEvent.type(bicInput, "bnpafrpp");
      fireEvent.blur(bicInput);

      expect(screen.queryByText("Format BIC invalide")).not.toBeInTheDocument();
    });
  });

  describe("form validity", () => {
    it("enables submit button when all fields are valid", async () => {
      render(<DepositForm funds={mockFunds} />);

      await userEvent.type(screen.getByLabelText("Montant (EUR)"), "1000");
      await userEvent.type(screen.getByLabelText("RIB"), "FR7630001007941234567890185");
      await userEvent.type(screen.getByLabelText("BIC"), "BNPAFRPP");
      await userEvent.click(screen.getByText("Fonds Actions Europe"));
      const allocationInput = screen.getByDisplayValue("0");
      await userEvent.clear(allocationInput);
      await userEvent.type(allocationInput, "100");

      expect(screen.getByRole("button", { name: "Valider le versement" })).toBeEnabled();
    });

    it("keeps submit button disabled when allocation total is not 100%", async () => {
      render(<DepositForm funds={mockFunds} />);

      await userEvent.type(screen.getByLabelText("Montant (EUR)"), "1000");
      await userEvent.type(screen.getByLabelText("RIB"), "FR7630001007941234567890185");
      await userEvent.type(screen.getByLabelText("BIC"), "BNPAFRPP");
      await userEvent.click(screen.getByText("Fonds Actions Europe"));

      expect(screen.getByRole("button", { name: "Valider le versement" })).toBeDisabled();
    });

    it("keeps submit button disabled when no fund is selected", async () => {
      render(<DepositForm funds={mockFunds} />);

      await userEvent.type(screen.getByLabelText("Montant (EUR)"), "1000");
      await userEvent.type(screen.getByLabelText("RIB"), "FR7630001007941234567890185");
      await userEvent.type(screen.getByLabelText("BIC"), "BNPAFRPP");

      expect(screen.getByRole("button", { name: "Valider le versement" })).toBeDisabled();
    });
  });

  describe("fund selection", () => {
    it("shows allocation inputs when fund is selected", async () => {
      render(<DepositForm funds={mockFunds} />);
      expect(screen.queryByText("Répartition de l'investissement")).not.toBeInTheDocument();

      await userEvent.click(screen.getByText("Fonds Actions Europe"));

      expect(screen.getByText("Répartition de l'investissement")).toBeInTheDocument();
    });

    it("hides allocation inputs when all funds are deselected", async () => {
      render(<DepositForm funds={mockFunds} />);
      await userEvent.click(screen.getByText("Fonds Actions Europe"));
      expect(screen.getByText("Répartition de l'investissement")).toBeInTheDocument();

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[0]);

      expect(screen.queryByText("Répartition de l'investissement")).not.toBeInTheDocument();
    });
  });
});
