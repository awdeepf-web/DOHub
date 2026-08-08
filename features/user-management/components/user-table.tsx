import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChangeRoleSelect } from '@/features/user-management/components/change-role-select';
import { ToggleActiveButton } from '@/features/user-management/components/toggle-active-button';
import type { Profile } from '@/types/database.types';

export function UserTable({ users, currentUserId }: { users: Profile[]; currentUserId: string }) {
  if (users.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        Belum ada user.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isSelf = user.id === currentUserId;
          return (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.full_name}
                {isSelf && <span className="ml-2 text-xs text-muted-foreground">(kamu)</span>}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <ChangeRoleSelect profileId={user.id} currentRole={user.role} disabled={isSelf} />
              </TableCell>
              <TableCell>
                <Badge variant={user.is_active ? 'default' : 'secondary'}>
                  {user.is_active ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <ToggleActiveButton
                  profileId={user.id}
                  isActive={user.is_active}
                  disabled={isSelf}
                  userName={user.full_name}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}