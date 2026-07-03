import {
  RegistrationList,
  type AttendanceFilter,
} from "@/components/admin/registration-list";

export const dynamic = "force-dynamic";

const validFilters: AttendanceFilter[] = ["all", "attended", "absent", "unset"];

export default async function WebinarRegistrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const filter = validFilters.includes(query.filtre as AttendanceFilter)
    ? (query.filtre as AttendanceFilter)
    : "all";

  return <RegistrationList targetType="webinar" targetId={id} filter={filter} />;
}
