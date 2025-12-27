import mongoose, { Document, Schema } from 'mongoose';
import { IOrder, OrderState, OrderStatus, ServiceStatus } from '../types/order.types';

export interface IOrderDocument extends IOrder, Document {}

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(ServiceStatus),
      default: ServiceStatus.PENDING,
    },
  },
  {
    _id: false,
  },
);

const orderSchema = new Schema<IOrderDocument>(
  {
    lab: {
      type: String,
      required: true,
    },

    patient: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: Object.values(OrderState),
      default: OrderState.CREATED,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.ACTIVE,
    },

    services: {
      type: [serviceSchema],
      required: true,
      validate: {
        validator: (services: unknown[]) => services.length > 0,
        message: 'Order must have at least one service',
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Order = mongoose.model<IOrderDocument>('Order', orderSchema);
