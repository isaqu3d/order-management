import { IOrderDocument, Order } from '../models/Order';
import { ICreateOrderRequest, IOrderQuery, OrderState, OrderStatus } from '../types/order.types';

export class OrderService {
  async createOrder(data: ICreateOrderRequest): Promise<IOrderDocument> {
    if (!data.services || data.services.length === 0) {
      throw new Error('Order must have at least one service');
    }

    const totalValue = data.services.reduce((sum, service) => sum + service.value, 0);
    if (totalValue <= 0) {
      throw new Error('Order total value must be greater than zero');
    }

    const order = await Order.create({
      ...data,
      state: OrderState.CREATED,
      status: OrderStatus.ACTIVE,
    });

    return order;
  }

  async getOrders(query: IOrderQuery): Promise<{ orders: IOrderDocument[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filter: { status: OrderStatus; state?: OrderState } = {
      status: OrderStatus.ACTIVE,
    };

    if (query.state) {
      filter.state = query.state;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    return { orders, total };
  }

  async advanceOrderState(orderId: string): Promise<IOrderDocument> {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.DELETED) {
      throw new Error('Cannot advance deleted order');
    }

    const stateTransitions: Record<OrderState, OrderState | null> = {
      [OrderState.CREATED]: OrderState.ANALYSIS,
      [OrderState.ANALYSIS]: OrderState.COMPLETED,
      [OrderState.COMPLETED]: null,
    };

    const nextState = stateTransitions[order.state];

    if (!nextState) {
      throw new Error('Order is already in final state');
    }

    order.state = nextState;
    await order.save();

    return order;
  }
}

export const orderService = new OrderService();
