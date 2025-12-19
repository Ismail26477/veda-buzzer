import { Helmet } from "react-helmet-async";
import { AdminDashboard } from "@/components/AdminDashboard";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Veda Office Connect</title>
        <meta name="description" content="Manage and connect with your team instantly with Veda Office Connect admin dashboard." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1a9a8a" />
      </Helmet>
      <AdminDashboard />
    </>
  );
};

export default Index;
