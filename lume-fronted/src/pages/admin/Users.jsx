  import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/user/delete/${id}`);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter(user => user._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/all");
        setUsers(res.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users", error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
           <h2 className="text-xl font-bold text-gray-800">Registered Users ({users.length})</h2>
           <p className="text-sm text-gray-500 mt-1">Manage all the users registered on your platform.</p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Loading users...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 font-semibold text-gray-600 border-b border-gray-200 text-sm w-1/4">Name</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 border-b border-gray-200 text-sm w-1/4">Email</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 border-b border-gray-200 text-sm">Role</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 border-b border-gray-200 text-sm text-center">Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-600 border-b border-gray-200 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold uppercase">
                          {user.name.slice(0, 2)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 capitalize">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(user._id); }} className="text-red-600 bg-red-50 p-2 rounded-md hover:bg-red-100 transition inline-flex">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                   <tr>
                     <td colSpan="5" className="text-center p-6 text-gray-500">No users found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
