// src/app/admin/users/page.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/user';

export default async function AdminUsersPage() {
  await dbConnect();
  const users = await User.find({}).lean();

  return (
    <div style={{ padding: '1rem' }}>
      <h1>All Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.userId}>
            <strong>{user.email}</strong> - Role: {user.role} - Wallet: {user.walletBalance}{" "}
            <a href={`/admin/users/${user.userId}`}>Edit</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
