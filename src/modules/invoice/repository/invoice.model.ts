import { Column, DataType, Model, Table, HasMany } from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";

@Table({
  tableName: "invoices",
  timestamps: true,
})
export default class InvoiceModel extends Model {
  @Column({
    type: DataType.STRING(255),
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  document: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  street: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  number: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  complement: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  state: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  zipCode: string;

  @HasMany(() => InvoiceItemModel)
  items: InvoiceItemModel[];
} 
