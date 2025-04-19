export default interface AlertConfig {
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose?: () => void;
  isVisible: boolean;
}

