import { getAllMapData, getAppliedJobs } from "@/app/actions";
import FindersApp from "@/components/FindersApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let companiesWithJobs: any[] = [];
  let appliedJobs: any[] = [];

  try {
    const results = await Promise.allSettled([
      getAllMapData(),
      getAppliedJobs(),
    ]);

    if (results[0].status === "fulfilled") {
      companiesWithJobs = results[0].value || [];
    }
    if (results[1].status === "fulfilled") {
      appliedJobs = results[1].value || [];
    }
  } catch (e) {
    console.error("HomePage SSR safe load fallback:", e);
  }

  return (
    <FindersApp
      initialCompanies={companiesWithJobs}
      initialApplicationsCount={appliedJobs.length}
    />
  );
}
