import { DataTypes, Sequelize } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable("orders", {
        id: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
        },
        client_id: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        client_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        client_email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        client_document: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        client_street: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        client_number: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        client_complement: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        client_city: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        client_state: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        client_zip_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        total: {
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
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable("orders");
}; 
