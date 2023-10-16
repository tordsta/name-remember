import { useEffect, useState } from "react";
import Modal from "react-modal";

export default function DefaultModal({
  children,
  openSignal,
  setOpenSignal,
}: {
  children: React.ReactNode;
  openSignal: boolean;
  setOpenSignal: Function;
}) {
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(openSignal);
  }, [openSignal]);

  function closeModal() {
    setIsOpen(false);
    setOpenSignal(false);
  }

  return (
    <Modal
      ariaHideApp={false}
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
