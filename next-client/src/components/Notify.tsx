import { ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

export const notify = (message: string) => toast(message, options);
export const notifyInfo = (message: string) => toast.info(message, options);
export const notifyWarning = (message: string) => toast.warn(message, options);
export const notifySuccess = (message: string) =>
  toast.success(message, options);
export const notifyError = (message: string) => toast.error(message, options);

export const notifyPromiseFetch = async ({
  url,
  body,
  pending,
  success,
  error,
}: {
  url: string;
  body?: any;
  pending: string;
  success: string;
  error: string;
}) => {
  const res = await toast.promise(
    new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      }).then((res) => {
        if (res.ok) {
          resolve(res);
        } else {
          reject(res);
        }
      });
    }),
    {
      pending: pending,
      success: success,
      error: error,
    }
  );
  return res;
};

export const NotifyContainer = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};
