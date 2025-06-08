import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    // Criar tabela products_adm
    await sequelize.getQueryInterface().createTable("products_adm", {
        id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        purchasePrice: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        stock: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    // Criar tabela products_store_catalog
    await sequelize.getQueryInterface().createTable("products_store_catalog", {
        id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        salesPrice: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
    });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("products_store_catalog");
    await sequelize.getQueryInterface().dropTable("products_adm");
}; 
