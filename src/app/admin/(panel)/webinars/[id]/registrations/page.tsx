import { RegistrationList } from "@/components/admin/registration-list";

export const dynamic = "force-dynamic";

export default async function WebinarRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RegistrationList targetType="webinar" targetId={id} />;
}
