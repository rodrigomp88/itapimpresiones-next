import UsersClient from "@/src/components/Admin/UsersClient";
import { adminAuth } from "@/src/firebase/admin";
import { UserRecord } from "firebase-admin/auth";

export interface SimpleUser {
  uid: string;
  email: string;
  displayName: string;
  creationTime: string;
  lastSignInTime: string;
  provider: string;
}

async function getAllUsers(): Promise<SimpleUser[]> {
  try {
    const userRecords: UserRecord[] = [];
    let nextPageToken;

    do {
      const listUsersResult = await adminAuth.listUsers(1000, nextPageToken);
      userRecords.push(...listUsersResult.users);
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    const users: SimpleUser[] = userRecords.map((user) => {
      const provider =
        user.providerData.length > 0
          ? user.providerData[0].providerId.replace(".com", "")
          : "password";

      return {
        uid: user.uid,
        email: user.email || "No disponible",
        displayName: user.displayName || "Sin nombre",
        creationTime: new Date(user.metadata.creationTime).toLocaleDateString(
          "es-AR"
        ),
        lastSignInTime: new Date(
          user.metadata.lastSignInTime
        ).toLocaleDateString("es-AR"),
        provider: provider,
      };
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

const AdminUsersPage = async () => {
  const users = await getAllUsers();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Gestión de Usuarios ({users.length})
      </h2>
      <UsersClient users={users} />
    </div>
  );
};

export default AdminUsersPage;
