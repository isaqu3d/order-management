import { NextFunction, Response } from 'express';
import { orderService } from '../services/order.service';
import { IAuthRequest } from '../types/express.types';
import { ICreateOrderRequest, IOrderQuery } from '../types/order.types';

export class OrderController {
  async createOrder(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: ICreateOrderRequest = req.body;
      const order = await orderService.createOrder(data);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const query: IOrderQuery = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        state: req.query.state as IOrderQuery['state'],
      };

      const result = await orderService.getOrders(query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async advanceOrder(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const order = await orderService.advanceOrderState(id);
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();
