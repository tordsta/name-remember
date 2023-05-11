import { useEffect, useState } from "react";
import Modal from "react-modal";

export default function DefaultModal({
  children,
  openSignal,
}: {
  children: React.ReactNode;
  openSignal: boolean;
}) {
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(openSignal);
  }, [openSignal]);

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          color: "#1F2937",
        },
        overlay: {
          backgroundColor: "rgba(0,0,0,0.5)",
        },
      }}
    >
      {children}
    </Modal>
  );
}
