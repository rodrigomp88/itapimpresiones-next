"use client";

import { SimpleUser } from "@/app/admin/users/page";
import { FaGoogle, FaEnvelope } from "react-icons/fa";

interface UsersClientProps {
  users: SimpleUser[];
}

const UsersClient: React.FC<UsersClientProps> = ({ users }) => {
  const ProviderIcon = ({ provider }: { provider: string }) => {
    if (provider === "google") {
      return <FaGoogle title="Google" className="text-red-500" />;
    }
    return <FaEnvelope title="Correo/Contraseña" className="text-gray-500" />;
  };

  return (
    <div className="overflow-x-auto border rounded-lg bg-white dark:bg-black">
      <table className="w-full text-left">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="p-4">Usuario</th>
            <th className="p-4">UID</th>
            <th className="p-4">Proveedor</th>
            <th className="p-4">Fecha de Creación</th>
            <th className="p-4">Último Acceso</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.uid} className="border-t dark:border-gray-700">
              <td className="p-4">
                <div className="font-medium">{user.displayName}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="p-4 text-xs text-gray-600 dark:text-gray-400 font-mono">
                {user.uid.slice(0, 10)}...
              </td>
              <td className="p-4">
                <span className="flex items-center gap-2 text-lg capitalize">
                  <ProviderIcon provider={user.provider} />
                  {user.provider}
                </span>
              </td>
              <td className="p-4 text-sm">{user.creationTime}</td>
              <td className="p-4 text-sm">{user.lastSignInTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersClient;
