import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Order } from '../models/Order';
import { OrderState, OrderStatus, ServiceStatus } from '../types/order.types';
import { OrderService } from './order.service';

vi.mock('../models/Order');

describe('OrderService - State Transitions', () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
    vi.clearAllMocks();
  });

  describe('advanceOrderState', () => {
    it('should advance order from CREATED to ANALYSIS', async () => {
      const mockOrder = {
        _id: '123',
        state: OrderState.CREATED,
        status: OrderStatus.ACTIVE,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.mocked(Order.findById).mockResolvedValue(mockOrder as any);

      const result = await orderService.advanceOrderState('123');

      expect(result.state).toBe(OrderState.ANALYSIS);
      expect(mockOrder.save).toHaveBeenCalledOnce();
    });

    it('should advance order from ANALYSIS to COMPLETED', async () => {
      const mockOrder = {
        _id: '123',
        state: OrderState.ANALYSIS,
        status: OrderStatus.ACTIVE,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.mocked(Order.findById).mockResolvedValue(mockOrder as any);

      const result = await orderService.advanceOrderState('123');

      expect(result.state).toBe(OrderState.COMPLETED);
      expect(mockOrder.save).toHaveBeenCalledOnce();
    });

    it('should throw error when trying to advance COMPLETED order', async () => {
      const mockOrder = {
        _id: '123',
        state: OrderState.COMPLETED,
        status: OrderStatus.ACTIVE,
        save: vi.fn(),
      };

      vi.mocked(Order.findById).mockResolvedValue(mockOrder as any);

      await expect(orderService.advanceOrderState('123')).rejects.toThrow(
        'Order is already in final state',
      );
      expect(mockOrder.save).not.toHaveBeenCalled();
    });

    it('should throw error when order is not found', async () => {
      vi.mocked(Order.findById).mockResolvedValue(null);

      await expect(orderService.advanceOrderState('999')).rejects.toThrow('Order not found');
    });

    it('should throw error when trying to advance DELETED order', async () => {
      const mockOrder = {
        _id: '123',
        state: OrderState.CREATED,
        status: OrderStatus.DELETED,
        save: vi.fn(),
      };

      vi.mocked(Order.findById).mockResolvedValue(mockOrder as any);

      await expect(orderService.advanceOrderState('123')).rejects.toThrow(
        'Cannot advance deleted order',
      );
      expect(mockOrder.save).not.toHaveBeenCalled();
    });

    it('should follow correct transition flow: CREATED -> ANALYSIS -> COMPLETED', async () => {
      const mockOrder = {
        _id: '123',
        state: OrderState.CREATED,
        status: OrderStatus.ACTIVE,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.mocked(Order.findById).mockResolvedValue(mockOrder as any);

      // First transition: CREATED -> ANALYSIS
      let result = await orderService.advanceOrderState('123');
      expect(result.state).toBe(OrderState.ANALYSIS);

      // Update mock to ANALYSIS state
      mockOrder.state = OrderState.ANALYSIS;

      // Second transition: ANALYSIS -> COMPLETED
      result = await orderService.advanceOrderState('123');
      expect(result.state).toBe(OrderState.COMPLETED);

      // Update mock to COMPLETED state
      mockOrder.state = OrderState.COMPLETED;

      // Third transition should fail
      await expect(orderService.advanceOrderState('123')).rejects.toThrow(
        'Order is already in final state',
      );
    });

    it('should not allow skipping states', async () => {
      const mockOrder = {
        _id: '123',
        state: OrderState.CREATED,
        status: OrderStatus.ACTIVE,
        save: vi.fn().mockResolvedValue(true),
      };

      vi.mocked(Order.findById).mockResolvedValue(mockOrder as any);

      // Advance once
      await orderService.advanceOrderState('123');

      // State should be ANALYSIS, not COMPLETED
      expect(mockOrder.state).toBe(OrderState.ANALYSIS);
      expect(mockOrder.state).not.toBe(OrderState.COMPLETED);
    });
  });

  describe('createOrder', () => {
    it('should create order with CREATED state', async () => {
      const orderData = {
        lab: 'Lab ABC',
        patient: 'John Doe',
        customer: 'Hospital XYZ',
        services: [
          {
            name: 'Hemograma',
            value: 50,
            status: ServiceStatus.PENDING,
          },
        ],
      };

      const mockCreatedOrder = {
        _id: '123',
        ...orderData,
        state: OrderState.CREATED,
        status: OrderStatus.ACTIVE,
      };

      vi.mocked(Order.create).mockResolvedValue(mockCreatedOrder as any);

      const result = await orderService.createOrder(orderData);

      expect(result.state).toBe(OrderState.CREATED);
      expect(result.status).toBe(OrderStatus.ACTIVE);
      expect(Order.create).toHaveBeenCalledWith({
        ...orderData,
        state: OrderState.CREATED,
        status: OrderStatus.ACTIVE,
      });
    });

    it('should throw error when creating order without services', async () => {
      const orderData = {
        lab: 'Lab ABC',
        patient: 'John Doe',
        customer: 'Hospital XYZ',
        services: [],
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow(
        'Order must have at least one service',
      );
    });

    it('should throw error when a service has zero value', async () => {
      const orderData = {
        lab: 'Lab ABC',
        patient: 'John Doe',
        customer: 'Hospital XYZ',
        services: [
          {
            name: 'Hemograma',
            value: 0,
            status: ServiceStatus.PENDING,
          },
        ],
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow(
        'Service "Hemograma" must have a value greater than zero',
      );
    });

    it('should throw error when a service has negative value', async () => {
      const orderData = {
        lab: 'Lab ABC',
        patient: 'John Doe',
        customer: 'Hospital XYZ',
        services: [
          {
            name: 'Raio-X',
            value: -50,
            status: ServiceStatus.PENDING,
          },
        ],
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow(
        'Service "Raio-X" must have a value greater than zero',
      );
    });

    it('should throw error when one service in multiple has zero value', async () => {
      const orderData = {
        lab: 'Lab ABC',
        patient: 'John Doe',
        customer: 'Hospital XYZ',
        services: [
          {
            name: 'Hemograma',
            value: 100,
            status: ServiceStatus.PENDING,
          },
          {
            name: 'Exame de Urina',
            value: 0,
            status: ServiceStatus.PENDING,
          },
          {
            name: 'Raio-X',
            value: 150,
            status: ServiceStatus.PENDING,
          },
        ],
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow(
        'Service "Exame de Urina" must have a value greater than zero',
      );
    });
  });

  describe('getOrders', () => {
    it('should only return ACTIVE orders by default', async () => {
      const mockOrders = [
        {
          _id: '1',
          state: OrderState.CREATED,
          status: OrderStatus.ACTIVE,
        },
        {
          _id: '2',
          state: OrderState.ANALYSIS,
          status: OrderStatus.ACTIVE,
        },
      ];

      const mockQuery = {
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockOrders),
      };

      vi.mocked(Order.find).mockReturnValue(mockQuery as any);
      vi.mocked(Order.countDocuments).mockResolvedValue(2);

      await orderService.getOrders({ page: 1, limit: 10 });

      expect(Order.find).toHaveBeenCalledWith({
        status: OrderStatus.ACTIVE,
      });
    });

    it('should filter orders by state when provided', async () => {
      const mockOrders = [
        {
          _id: '1',
          state: OrderState.COMPLETED,
          status: OrderStatus.ACTIVE,
        },
      ];

      const mockQuery = {
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockOrders),
      };

      vi.mocked(Order.find).mockReturnValue(mockQuery as any);
      vi.mocked(Order.countDocuments).mockResolvedValue(1);

      await orderService.getOrders({
        page: 1,
        limit: 10,
        state: OrderState.COMPLETED,
      });

      expect(Order.find).toHaveBeenCalledWith({
        status: OrderStatus.ACTIVE,
        state: OrderState.COMPLETED,
      });
    });

    it('should handle pagination correctly', async () => {
      const mockOrders: any[] = [];

      const mockQuery = {
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        sort: vi.fn().mockResolvedValue(mockOrders),
      };

      vi.mocked(Order.find).mockReturnValue(mockQuery as any);
      vi.mocked(Order.countDocuments).mockResolvedValue(0);

      await orderService.getOrders({ page: 2, limit: 5 });

      expect(mockQuery.skip).toHaveBeenCalledWith(5); // (page 2 - 1) * 5
      expect(mockQuery.limit).toHaveBeenCalledWith(5);
    });
  });
});
