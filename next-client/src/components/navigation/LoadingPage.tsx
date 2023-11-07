import Layout from "./Layout";
import Image from "next/image";
import LoadingAnimation from "./LoadingAnimation";

export default function LoadingPage() {
  return (
    <Layout>
      <LoadingAnimation size="large" />
    </Layout>
  );
}
