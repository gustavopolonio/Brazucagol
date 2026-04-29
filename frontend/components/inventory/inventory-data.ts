export type InventoryItemType = "vip" | "transfer_pass";

export type InventoryItem = {
  id: string;
  type: InventoryItemType;
  name: string;
  quantity: number;
  durationSeconds?: number;
};

export const loggedInPlayerInventoryItems: InventoryItem[] = [
  {
    id: "vip-7-days",
    type: "vip",
    name: "VIP 7 dias",
    quantity: 2,
    durationSeconds: 7 * 24 * 60 * 60,
  },
  {
    id: "vip-30-days",
    type: "vip",
    name: "VIP 30 dias",
    quantity: 1,
    durationSeconds: 30 * 24 * 60 * 60,
  },
  {
    id: "vip-1-hour-30-minutes",
    type: "vip",
    name: "VIP 1 hora e 30 minutos",
    quantity: 1,
    durationSeconds: 90 * 60,
  },
  {
    id: "transfer-pass",
    type: "transfer_pass",
    name: "Passe de Transferência",
    quantity: 3,
  },
];
