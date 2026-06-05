export default function ProductCard({
  product,
  imageBaseUrl,
  onEdit,
  onDelete,
  onTogglePublish,
}) {
  return (
    <div className="border rounded-xl p-4 flex flex-col gap-3 bg-white">

      {/* Image Slider - simple */}
      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative">
        {product.images && product.images.length > 0 ? (
          <img
            src={imageBaseUrl + product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {/* Dots */}
        {product.images?.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {product.images.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === 0 ? "bg-red-400" : "bg-gray-300"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Name */}
      <p className="font-semibold text-gray-800">{product.name}</p>

      {/* Details */}
      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <div className="flex justify-between">
          <span>Product type -</span>
          <span className="text-gray-800">{product.productType}</span>
        </div>
        <div className="flex justify-between">
          <span>Quantity Stock -</span>
          <span className="text-gray-800">{product.quantityStock}</span>
        </div>
        <div className="flex justify-between">
          <span>MRP -</span>
          <span className="text-gray-800">₹ {product.mrp}</span>
        </div>
        <div className="flex justify-between">
          <span>Selling Price -</span>
          <span className="text-gray-800">₹ {product.sellingPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Brand Name -</span>
          <span className="text-gray-800">{product.brandName}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Number of images -</span>
          <span className="text-gray-800">{product.images?.length || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>Exchange Eligibility -</span>
          <span className="text-gray-800">
            {product.exchangeEligible ? "YES" : "NO"}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onTogglePublish(product._id)}
          className={`flex-1 py-2 rounded text-white text-sm font-medium ${
            product.isPublished ? "bg-green-500" : "bg-blue-900"
          }`}
        >
          {product.isPublished ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => onEdit(product)}
          className="flex-1 py-2 rounded border text-sm font-medium text-gray-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="p-2 border rounded text-gray-500 hover:text-red-500"
        >
          🗑️
        </button>
      </div>

    </div>
  )
}
