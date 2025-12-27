export enum OrderState {
  CREATED = 'CREATED',
  ANALYSIS = 'ANALYSIS',
  COMPLETED = 'COMPLETED',
}

export enum OrderStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export enum ServiceStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

export interface IService {
  name: string;
  value: number;
  status: ServiceStatus;
}

export interface IOrder {
  lab: string;
  patient: string;
  customer: string;
  state: OrderState;
  status: OrderStatus;
  services: IService[];
}

export interface ICreateOrderRequest {
  lab: string;
  patient: string;
  customer: string;
  services: IService[];
}

export interface IOrderQuery {
  page?: number;
  limit?: number;
  state?: OrderState;
}
