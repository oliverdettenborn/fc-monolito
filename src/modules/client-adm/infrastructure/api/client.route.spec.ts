import express, { Express } from "express";
import request from "supertest";
import createClientRouter from "./client.route";
import { AddClientFacadeInputDto } from "../../facade/client-adm.facade.dto";

describe("Client Routes", () => {
  let app: Express;
  let mockAddClient: jest.Mock;
  let mockFacade: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockAddClient = jest.fn();
    mockFacade = { add: mockAddClient };
    app.use(createClientRouter(mockFacade));
  });

  describe("POST /clients", () => {
    const mockClientData: AddClientFacadeInputDto = {
      id: "1",
      name: "Client 1",
      email: "client1@example.com",
      document: "12345678900",
      address: {
        street: "Street 1",
        number: "123",
        complement: "Apt 1",
        city: "City 1",
        state: "State 1",
        zipCode: "12345678"
      }
    };

    it("deve retornar 201 e os dados do cliente quando criado com sucesso", async () => {
      mockAddClient.mockResolvedValue(mockClientData);

      const response = await request(app)
        .post("/clients")
        .send(mockClientData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockClientData);
      expect(mockAddClient).toHaveBeenCalledWith(mockClientData);
    });

    it("deve retornar 500 se o facade.addClient lançar erro", async () => {
      mockAddClient.mockRejectedValue(new Error("Erro ao criar cliente"));
      
      const response = await request(app)
        .post("/clients")
        .send(mockClientData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao criar cliente");
    });
  });
}); 
