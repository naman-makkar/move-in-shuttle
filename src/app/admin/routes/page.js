// src/app/admin/routes/page.js
import { dbConnect } from '@/lib/dbConnect';
import Route from '@/models/route';

export default async function AdminRoutesPage() {
  // Server Component: We can fetch data here
  await dbConnect();
  const routes = await Route.find({}).lean();

  return (
    <div style={{ padding: '1rem' }}>
      <h1>All Routes</h1>
      <a href="/admin/routes/new" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        Create New Route
      </a>

      <ul>
        {routes.map((route) => (
          <li key={route.routeId}>
            <strong>{route.routeName}</strong>{" "}
            {route.isActive ? "(Active)" : "(Inactive)"}
            {" - "}
            <a href={`/admin/routes/${route.routeId}`}>Edit</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
