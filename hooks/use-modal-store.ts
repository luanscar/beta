
import { ChannelType, Company, Member, User } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createUser" | "profiles" | "editUser" | "createChannel";

interface ModalData {
  company?: Company;
  members?: Member;
  user?: User
  channelType?: ChannelType;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>(set => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false })
}));
