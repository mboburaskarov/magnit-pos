export const order_statuses = [
  {
    id: 'ALL',
    color: 'green.500',
    name: 'Все заказы',
    countName: 'totalCount',
  },
  {
    id: 'CANCELED',
    color: 'red.500',
    name: 'Отменено',
    countName: 'canceled',
  },
  {
    id: 'INACTIVE',
    color: 'red.400',
    name: 'Неактивный',
    countName: 'inactive',
    notVisible: true,
  },
  {
    id: 'PENDING',
    color: 'yellow.400',
    name: 'В ожидании',
    countName: 'pending',
    notVisible: true,
  },
  {
    id: 'PAID',
    color: 'green.400',
    name: 'Оплаченный',
    countName: 'paid',
  },

  {
    id: 'IN_PROGRESS',
    color: 'yellow.400',
    name: 'В прогрессе',
    countName: 'inProgress',
  },
  {
    id: 'REJECTED',
    color: 'red.400',
    name: 'Отклонен',
    countName: 'rejected',
  },
  {
    id: 'CHECKING',
    color: 'yellow.500',
    name: 'Проверка',
    countName: 'checking',
  },
  {
    id: 'APPROVED',
    color: 'teal.500',
    name: 'Одобренный',
    countName: 'approved',
  },
  {
    id: 'IN_DELIVERY',
    color: 'bluegray.500',
    name: 'В доставке',
    countName: 'inDelivery',
  },
  {
    id: 'DELIVERED',
    color: 'bluegray.600',
    name: 'Доставлен',
    countName: 'delivered',
  },

  {
    id: 'DONE',
    color: 'green.600',
    name: 'Завершен',
    countName: 'done',
  },
]
