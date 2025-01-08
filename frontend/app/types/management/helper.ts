export type CustomModalType = {
  isModalOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}