import Layout from "@/components/Layout";
import Lists from "@/components/Lists";

export default function Dashboard() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-col flex-grow w-full justify-start md:justify-between items-center">
        <Lists />
      </div>
    </Layout>
  );
}
