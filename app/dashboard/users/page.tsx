import { redirect } from 'next/navigation';
import { requireProfile } from '@/utils/guard';
import { userManagementService } from '@/services/user-management.service';
import { UserTable } from '@/features/user-management/components/user-table';

export default async function UserManagementPage() {
  const profile = await requireProfile();

  if (profile.role !== 'owner') {
    redirect('/dashboard');
  }

  const users = await userManagementService.listByOrganization(profile.organization_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Kelola role dan status aktif semua pengguna di bimbel kamu. Total {users.length} user.
        </p>
      </div>

      <UserTable users={users} currentUserId={profile.id} />
    </div>
  );
}