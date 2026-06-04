export default function DeleteModal({ show, product, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Delete Product</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">
            ✕
          </button>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you really want to delete this Product{" "}
          <span className="font-bold text-gray-800">"{product?.name}"</span> ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-900 text-white rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
