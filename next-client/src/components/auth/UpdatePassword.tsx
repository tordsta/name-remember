import { useState } from "react";
import { FramedButton } from "../Button";
import { notifyError, notifyPromiseFetch } from "../Notify";
import Modal from "../Modal";

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [openSignal, setOpenSignal] = useState(false);

  const handlePasswordReset = async () => {
    if (!newPassword || !newPasswordConfirm) {
      notifyError("Please enter a new password");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      notifyError("Passwords do not match");
      return;
    }
    if (newPassword === oldPassword) {
      notifyError("New password cannot be the same as old password");
      return;
    }
    const res = await notifyPromiseFetch({
      url: "/api/auth/update-password",
      body: JSON.stringify({
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
      pending: "Updating password...",
      success: "Password updated successfully",
      error: "Error: Password not updated",
    });
    if (res.ok) {
      setOpenSignal(false);
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    }
  };

  return (
    <>
      <FramedButton onClick={() => setOpenSignal(true)}>
        Reset password
      </FramedButton>
      <Modal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <div className="flex flex-col items-center justify-center text-center py-5 px-10 max-w-lg gap-4">
          <div>
            <p>Enter your old & new password below.</p>
            <p> Leave old password empty if no password is set.</p>
          </div>
          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="border border-black px-2 py-1 w-52"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border border-black px-2 py-1 w-52"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            className="border border-black px-2 py-1 w-52"
          />
          <FramedButton onClick={handlePasswordReset}>
            Reset password
          </FramedButton>
        </div>
      </Modal>
    </>
  );
}
