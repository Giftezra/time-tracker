export interface CustomModalType {
  isModalOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}