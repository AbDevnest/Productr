import { useState, useEffect } from "react"
import { addProduct, updateProduct } from "../api/productApi"

export default function ProductModal({ show, onClose, onSuccess, editProduct }) {
  const [form, setForm] = useState({
    name: "",
    productType: "",
    quantityStock: "",
    mrp: "",
    sellingPrice: "",
    brandName: "",
    exchangeEligible: "Yes",
  })
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [loading, setLoading] = useState(false)

  const imageBaseUrl = "http://localhost:8000/images/products/"

  // Edit mode mein form prefill karo
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || "",
        productType: editProduct.productType || "",
        quantityStock: editProduct.quantityStock || "",
        mrp: editProduct.mrp || "",
        sellingPrice: editProduct.sellingPrice || "",
        brandName: editProduct.brandName || "",
        exchangeEligible: editProduct.exchangeEligible ? "Yes" : "No",
      })
      setPreviewImages(editProduct.images?.map((img) => imageBaseUrl + img) || [])
      setImages([])
    } else {
      setForm({
        name: "",
        productType: "",
        quantityStock: "",
        mrp: "",
        sellingPrice: "",
        brandName: "",
        exchangeEligible: "Yes",
      })
      setImages([])
      setPreviewImages([])
    }
  }, [editProduct, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    setPreviewImages(files.map((f) => URL.createObjectURL(f)))
  }

  const handleRemovePreview = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    try {
      if (!form.name) {
        alert("Please enter product name")
        return
      }
      setLoading(true)

      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("productType", form.productType)
      formData.append("quantityStock", form.quantityStock)
      formData.append("mrp", form.mrp)
      formData.append("sellingPrice", form.sellingPrice)
      formData.append("brandName", form.brandName)
      formData.append("exchangeEligible", form.exchangeEligible === "Yes")

      // Multiple images append
      if (images.length > 0) {
        images.forEach((img) => {
          formData.append("images", img)
        })
      }

      if (editProduct) {
        await updateProduct(editProduct._id, formData)
      } else {
        await addProduct(formData)
      }

      onSuccess()
      onClose()

    } catch (err) {
      console.log(err)
      alert("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {editProduct ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-gray-500 text-xl">✕</button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">

          <div>
            <label className="text-sm text-gray-600">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="border p-2 rounded w-full mt-1 text-sm outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Product Type</label>
            <select
              name="productType"
              value={form.productType}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1 text-sm outline-none focus:border-blue-900"
            >
              <option value="">Select product type</option>
              <option value="Foods">Foods</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothes">Clothes</option>
              <option value="Beauty Products">Beauty Products</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">Quantity Stock</label>
            <input
              name="quantityStock"
              value={form.quantityStock}
              onChange={handleChange}
              placeholder="Total numbers of Stock available"
              type="number"
              className="border p-2 rounded w-full mt-1 text-sm outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">MRP</label>
            <input
              name="mrp"
              value={form.mrp}
              onChange={handleChange}
              placeholder="MRP"
              type="number"
              className="border p-2 rounded w-full mt-1 text-sm outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Selling Price</label>
            <input
              name="sellingPrice"
              value={form.sellingPrice}
              onChange={handleChange}
              placeholder="Selling Price"
              type="number"
              className="border p-2 rounded w-full mt-1 text-sm outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Brand Name</label>
            <input
              name="brandName"
              value={form.brandName}
              onChange={handleChange}
              placeholder="Brand Name"
              className="border p-2 rounded w-full mt-1 text-sm outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Upload Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="border p-2 rounded w-full mt-1 text-sm"
            />
            {previewImages.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {previewImages.map((src, i) => (
                  <div key={i} className="relative">
                    <img
                      src={src}
                      className="w-16 h-16 object-cover rounded border"
                      alt=""
                    />
                    <button
                      onClick={() => handleRemovePreview(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">Exchange or return eligibility</label>
            <select
              name="exchangeEligible"
              value={form.exchangeEligible}
              onChange={handleChange}
              className="border p-2 rounded w-full mt-1 text-sm outline-none focus:border-blue-900"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-900 text-white py-2 rounded w-full mt-4 text-sm font-medium"
        >
          {loading ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
        </button>

      </div>
    </div>
  )
}
