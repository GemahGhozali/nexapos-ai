import { UserForm } from "@/features/user/components/user-form";
import { getUserById } from "@/features/user/queries";

interface UpdateUserProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateUserPage({ params }: UpdateUserProps) {
  const { id } = await params;
  const { data: user, error } = await getUserById(id);

  if (!user) throw new Error(error);

  return <UserForm user={user} />;
}
