import { useAppData } from "@/context/AppDataContext";
import { User } from "@/types/user";
import { Edit2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "../dialog/ConfirmDialog";
import UserForm from "../forms/UserForm";

const UsersTab = () => {
  const { users, setUsers, setRefetch } = useAppData();
  const [showUserForm, setShowUserForm] = useState<
    false | { mode: "create" } | { mode: "edit"; user: User }
  >(false);
  const [confirmDelete, setConfirmDelete] = useState<
    false | { userId: string; userEmail: string }
  >(false);
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh users list
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
        setConfirmDelete(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete user: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleUserSaved = () => {
    setShowUserForm(false);
    setRefetch(true); // This will trigger a refetch of users
  };
  return (
    <>
      <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full mt-6 w-[90vw] md:w-full">
        {/* Header */}
        <div className="p-4 flex gap-3 sm:items-center">
          <h2 className="font-bold text-lg">Users</h2>
          <div className="flex-1" />
          <button
            onClick={() => setShowUserForm({ mode: "create" })}
            className="inline-flex w-fit items-center gap-2 px-4 btn-primary"
          >
            <PlusIcon size={18} />
            Add User
          </button>
        </div>

        {/* Users List */}
        <div className="divide-y divide-gray-200">
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                Get started by adding your first user
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {user.name
                          ? user.name.charAt(0).toUpperCase()
                          : user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {user.name || user.email.split("@")[0]}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowUserForm({ mode: "edit", user })}
                    className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                  >
                    <Edit2Icon size={12} />
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDelete({
                        userId: user._id,
                        userEmail: user.email,
                      })
                    }
                    className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                  >
                    <Trash2Icon size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <UserForm
              mode={showUserForm.mode}
              user={
                showUserForm.mode === "edit" ? showUserForm.user : undefined
              }
              onClose={() => setShowUserForm(false)}
              onSaved={handleUserSaved}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete the user "${confirmDelete.userEmail}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmVariant="danger"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => handleDeleteUser(confirmDelete.userId)}
        />
      )}
    </>
  );
};

export default UsersTab;
