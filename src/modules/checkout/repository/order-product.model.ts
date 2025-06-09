import { Column, Model, PrimaryKey, Table, ForeignKey, BelongsTo } from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({
  tableName: 'order_products',
  timestamps: false
})
export class OrderProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  order_id: string

  @Column({ allowNull: false })
  product_id: string

  @Column({ allowNull: false })
  product_name: string

  @Column({ allowNull: false })
  product_description: string

  @Column({ allowNull: false })
  quantity: number

  @Column({ allowNull: false })
  price: number

  @Column({ allowNull: false })
  createdAt: Date

  @Column({ allowNull: false })
  updatedAt: Date

  @BelongsTo(() => OrderModel)
  order: OrderModel
} 
