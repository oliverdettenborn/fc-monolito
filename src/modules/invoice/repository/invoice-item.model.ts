import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "invoice_items",
  timestamps: true,
})
export default class InvoiceItemModel extends Model {
  @Column({
    type: DataType.STRING(255),
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => InvoiceModel)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  invoiceId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  price: number;

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;
} 
