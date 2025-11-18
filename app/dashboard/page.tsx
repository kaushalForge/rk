import axios from "axios";
import DashboardUI from "@/components/dashboardUI/page";

export default async function DashboardHome() {
  const [cowsRes, calvesRes] = await Promise.all([
    axios.get(`http://localhost:3000/api/cows`),
    axios.get(`http://localhost:3000/api/calves`),
  ]);

  const cowsData = cowsRes.data?.cows || [];
  const calvesData = calvesRes.data?.calves || [];

  return <DashboardUI cows={cowsData} calves={calvesData} />;
}
