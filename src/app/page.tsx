import { getAllMapData, getAppliedJobs } from "@/app/actions";
import FindersApp from "@/components/FindersApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [companiesWithJobs, appliedJobs] = await Promise.all([
    getAllMapData(),
    getAppliedJobs(),
  ]);

  return (
    <FindersApp
      initialCompanies={companiesWithJobs}
      initialApplicationsCount={appliedJobs.length}
    />
  );
}
