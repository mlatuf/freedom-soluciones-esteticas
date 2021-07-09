import { CashRegisterModule } from "./cash-register.module";

describe("CashRegisterModule", () => {
  let cashRegisterModule: CashRegisterModule;

  beforeEach(() => {
    cashRegisterModule = new CashRegisterModule();
  });

  it("should create an instance", () => {
    expect(cashRegisterModule).toBeTruthy();
  });
});
