import { NavLink } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { MdHome } from "react-icons/md";

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay - mobile pe */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static top-0 left-0 h-full w-56 bg-gray-900 
        text-white z-30 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Close button - mobile pe */}

        <div className="flex lg:justify-center justify-between lg:px-0 px-4 items-center  mt-5  gap-3">
            <div className="flex gap-2">
                <p className="lg:text-2xl text-xl font-bold items-center">Productr</p>
                <img src="/images/vector.png" alt="" />
            </div>

        <button
          onClick={onClose}
          className="lg:hidden text-white text-xl"
        >
          ✕
        </button>
        </div>


        {/* Search */}
        <div className="px-2 mt-5">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-700 text-white  px-3 py-2 rounded-md text-sm outline-none"
          />
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-2 mt-4 pt-4 border-t">
          <NavLink
            to="/home"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded text-sm ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <FiHome size={20} /> Home
          </NavLink>

          <NavLink
            to="/products"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded text-sm ${
                isActive ? "bg-gray-700" : "hover:bg-gray-700"
              }`
            }
          >
            <MdHome size={24} /> Products
          </NavLink>
        </nav>
      </div>
    </>
  );
}
