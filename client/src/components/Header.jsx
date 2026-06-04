import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-2xl text-gray-700"
      >
        ☰
      </button>

      {/* Empty div - desktop pe space ke liye */}
      <div className="hidden lg:block" ></div>

      {/* Right side - user info */}
      <div className="flex items-end gap-1">
        <span className="text-sm text-gray-600">{user?.email}</span>
        <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-white text-sm font-bold">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
