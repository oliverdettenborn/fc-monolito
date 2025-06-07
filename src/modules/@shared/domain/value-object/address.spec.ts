import Address from "./address";

describe("Address Value Object", () => {
  it("deve lançar erro se street for vazio", () => {
    const address = new Address("", "123", "Apt 1", "Cidade", "Estado", "12345-678");
    expect(() => address.validate()).toThrowError("Street is required");
  });

  it("deve lançar erro se number for vazio", () => {
    const address = new Address("Rua", "", "Apt 1", "Cidade", "Estado", "12345-678");
    expect(() => address.validate()).toThrowError("Number is required");
  });

  it("deve lançar erro se complement for vazio", () => {
    const address = new Address("Rua", "123", "", "Cidade", "Estado", "12345-678");
    expect(() => address.validate()).toThrowError("Complement is required");
  });

  it("deve lançar erro se city for vazio", () => {
    const address = new Address("Rua", "123", "Apt 1", "", "Estado", "12345-678");
    expect(() => address.validate()).toThrowError("City is required");
  });

  it("deve lançar erro se state for vazio", () => {
    const address = new Address("Rua", "123", "Apt 1", "Cidade", "", "12345-678");
    expect(() => address.validate()).toThrowError("State is required");
  });

  it("deve lançar erro se zipCode for vazio", () => {
    const address = new Address("Rua", "123", "Apt 1", "Cidade", "Estado", "");
    expect(() => address.validate()).toThrowError("Zip code is required");
  });

  it("não deve lançar erro se todos os campos estiverem preenchidos", () => {
    const address = new Address("Rua", "123", "Apt 1", "Cidade", "Estado", "12345-678");
    expect(() => address.validate()).not.toThrow();
  });
}); 
