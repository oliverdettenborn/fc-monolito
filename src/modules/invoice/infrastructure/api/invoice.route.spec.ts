import express, { Express } from "express";
import request from "supertest";
import createInvoiceRouter from "./invoice.route";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "../../usecase/generate-invoice/generate-invoice.dto";
import { FindInvoiceUseCaseOutputDTO } from "../../usecase/find-invoice/find-invoice.dto";

describe("Invoice Routes", () => {
  let app: Express;
  let mockGenerate: jest.Mock;
  let mockFind: jest.Mock;
  let mockFacade: any;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    mockGenerate = jest.fn();
    mockFind = jest.fn();
    mockFacade = { generate: mockGenerate, find: mockFind };
    app.use(createInvoiceRouter(mockFacade));
  });

  describe("POST /invoice", () => {
    const mockInvoiceData: GenerateInvoiceUseCaseInputDto = {
      name: "Cliente Teste",
      document: "12345678900",
      street: "Rua Teste",
      number: "123",
      complement: "Apto 1",
      city: "Cidade Teste",
      state: "Estado Teste",
      zipCode: "12345-678",
      items: [
        {
          id: "1",
          name: "Produto 1",
          price: 100
        }
      ]
    };

    it("deve retornar 201 e os dados da nota fiscal quando gerada com sucesso", async () => {
      const mockResponse: GenerateInvoiceUseCaseOutputDto = {
        id: "789",
        ...mockInvoiceData,
        total: 100
      };
      mockGenerate.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post("/invoice")
        .send(mockInvoiceData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockResponse);
      expect(mockGenerate).toHaveBeenCalledWith(mockInvoiceData);
    });

    it("deve retornar 500 se o facade.generate lançar erro", async () => {
      mockGenerate.mockRejectedValue(new Error("Erro ao gerar nota"));
      
      const response = await request(app)
        .post("/invoice")
        .send(mockInvoiceData);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao gerar nota");
    });
  });

  describe("GET /invoice/:id", () => {
    it("deve retornar 200 e os dados da nota fiscal quando encontrada", async () => {
      const mockInvoice: FindInvoiceUseCaseOutputDTO = {
        id: "123",
        name: "Cliente Teste",
        document: "12345678900",
        address: {
          street: "Rua Teste",
          number: "123",
          complement: "Apto 1",
          city: "Cidade Teste",
          state: "Estado Teste",
          zipCode: "12345-678"
        },
        items: [
          {
            id: "1",
            name: "Produto 1",
            price: 100
          }
        ],
        total: 100,
        createdAt: new Date()
      };
      mockFind.mockResolvedValue(mockInvoice);

      const response = await request(app).get("/invoice/123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(JSON.parse(JSON.stringify(mockInvoice)));
      expect(mockFind).toHaveBeenCalledWith({ id: "123" });
    });

    it("deve retornar 500 se o facade.find lançar erro", async () => {
      mockFind.mockRejectedValue(new Error("Erro ao buscar nota"));
      
      const response = await request(app).get("/invoice/123");

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Erro ao buscar nota");
    });
  });
}); 
