import { useEffect, useState } from "react"
import { MdDelete } from "react-icons/md";

export default function ProductCard({
  product,
  imageBaseUrl,
  onEdit,
  onDelete,
  onTogglePublish,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const totalImages = product.images?.length || 0

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [product._id, totalImages])

  const handlePrevImage = (e) => {
    e.stopPropagation()
    if (totalImages <= 1) return
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    if (totalImages <= 1) return
    setCurrentImageIndex((prev) => (prev + 1) % totalImages)
  }

  return (
    <div className="border rounded-xl p-4 flex flex-col gap-3 bg-white">

      {/* Image Slider */}
      <div className="w-full h-52 bg-gray-100 rounded-lg overflow-hidden relative group">
        {totalImages > 0 ? (
          <img
            src={imageBaseUrl + product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/45 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(i)
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentImageIndex ? "bg-red-400" : "bg-gray-300"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
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
          className={`flex-1 py-2 rounded text-white text-sm font-medium cursor-pointer ${
            product.isPublished ? "bg-green-500 hover:bg-yellow-500" : "bg-blue-900 hover:bg-yellow-500"
          }`}
        >
          {product.isPublished ? "Unpublish" : "Publish"}
        </button>
        <button
          onClick={() => onEdit(product)}
          className="flex-1 py-2 rounded cursor-pointer border hover:border-green-500 hover:text-green-500 text-sm font-medium text-gray-700"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product)}
          className="p-2 border cursor-pointer rounded text-gray-500 hover:text-red-500"
        >
          <MdDelete size={20} />
        </button>
      </div>

    </div>
  )
}
