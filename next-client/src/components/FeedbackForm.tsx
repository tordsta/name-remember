import { useState } from "react";
import DefaultModal from "./Modal";
import Button, { FramedButton } from "./style/Button";
import resizeImage from "@/utils/resizeImage";
import { notifyError, notifyPromiseFetch } from "./Notify";
import { track } from "@amplitude/analytics-browser";

export default function FeedbackForm() {
  const [openSignal, setOpenSignal] = useState(false);
  const [file, setFile] = useState<string | null>(null);

  const handleSendFeedback = async (event: React.FormEvent) => {
    event.preventDefault();
    setOpenSignal(false);
    const type = (event.target as any)["type"].value;
    const description = (event.target as any)["description"].value;

    await notifyPromiseFetch({
      url: "/api/crud/addFeedback",
      body: JSON.stringify({
        type,
        message: description,
        file,
      }),
      pending: "... processing",
      success: "Feedback submitted successfully.",
      error: "Error: Feedback not submitted.",
    });
    setFile(null);
    track("Feedback submitted", { type, description });
  };

  const handleFileChange = async (event: React.ChangeEvent) => {
    event.preventDefault();
    const file = (event.target as any).files[0];

    if (file.type === "application/pdf" && file.size > 20000000) {
      notifyError("File size must be less than 20MB");
      return;
    }

    if (file.type === "application/pdf" && file.size < 20000000) {
      const fileReader = new FileReader();
      let base64: string | null;
      fileReader.onload = function (fileLoadedEvent) {
        base64 =
          typeof fileLoadedEvent?.target?.result == "string"
            ? fileLoadedEvent.target.result
            : null;
      };
      fileReader.readAsDataURL(file);
      setFile(file);
    } else {
      const targetSizeKb = 200;
      await resizeImage({ file, targetSizeKb, setImageFile: setFile });
    }
  };

  return (
    <>
      <FramedButton
        onClick={() => {
          setOpenSignal(true);
          setFile(null);
        }}
      >
        Submit Feedback
      </FramedButton>
      <DefaultModal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <div className="text-xl text-center mt-4">Submit Feedback</div>
        <form
          onSubmit={handleSendFeedback}
          className="flex flex-col items-center justify-center gap-4 mt-4"
        >
          <label>
            Select type:
            <select
              name="type"
              className="border border-black rounded mx-2 px-1"
            >
              <option value="bug">Bug</option>
              <option value="feature">Feature request</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="flex flex-col justify-center items-start">
            Description
            <textarea
              name="description"
              rows={4}
              cols={35}
              className="border border-black rounded px-2 py-1"
            />
          </label>
          <div className="flex flex-col justify-center items-center md:items-start gap-4 mt-4">
            <input
              className="my-2 w-full"
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-center items-center gap-2 my-4">
            <Button
              style={"cancel"}
              onClick={() => {
                setOpenSignal(false);
                setFile(null);
              }}
            />
            <Button style="submit" typeSubmit={true} />
          </div>
        </form>
      </DefaultModal>
    </>
  );
}
