import { Column, Model, PrimaryKey, Table, HasMany } from "sequelize-typescript";
import { OrderProductModel } from "./order-product.model";

@Table({
  tableName: 'orders',
  timestamps: false
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @Column({ allowNull: false })
  client_id: string

  @Column({ allowNull: false })
  client_name: string

  @Column({ allowNull: false })
  client_email: string

  @Column({ allowNull: false })
  client_document: string

  @Column({ allowNull: false })
  client_street: string

  @Column({ allowNull: false })
  client_number: string

  @Column({ allowNull: true })
  client_complement: string

  @Column({ allowNull: false })
  client_city: string

  @Column({ allowNull: false })
  client_state: string

  @Column({ allowNull: false })
  client_zip_code: string

  @Column({ allowNull: false })
  status: string

  @Column({ allowNull: false })
  total: number

  @Column({ allowNull: false })
  createdAt: Date

  @Column({ allowNull: false })
  updatedAt: Date

  @HasMany(() => OrderProductModel)
  OrderProducts: OrderProductModel[]
} 
