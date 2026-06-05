import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import ProductCard from "../components/ProductCard"
import ProductModal from "../components/ProductModal"
import DeleteModal from "../components/DeleteModal"
import { getProducts, deleteProduct, togglePublish } from "../api/productApi"

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const imageBaseUrl = "http://localhost:8000/images/products/"

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await getProducts()
      setProducts(res.data.data.products)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  const handleDelete = (product) => {
    setSelectedProduct(product)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(selectedProduct._id)
      setShowDeleteModal(false)
      fetchProducts()
    } catch (err) {
      console.log(err)
    }
  }

  const handleTogglePublish = async (id) => {
    try {
      await togglePublish(id)
      fetchProducts()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg font-semibold text-gray-800">Products</h1>
            <button
              onClick={() => { setSelectedProduct(null); setShowModal(true) }}
              className="text-sm text-blue-900 font-medium"
            >
              + Add Products
            </button>
          </div>

          {loading && <p className="text-gray-400 text-center mt-20">Loading...</p>}

          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
              <div className="text-5xl text-blue-900">⊞</div>
              <p className="font-semibold text-gray-700 text-lg">
                Feels a little empty over here...
              </p>
              <p className="text-gray-400 text-sm text-center">
                You can create products without connecting store
              </p>
              <button
                onClick={() => { setSelectedProduct(null); setShowModal(true) }}
                className="bg-blue-900 text-white px-6 py-2 rounded text-sm mt-2"
              >
                Add your Products
              </button>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  imageBaseUrl={imageBaseUrl}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTogglePublish={handleTogglePublish}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      <ProductModal
        show={showModal}
        onClose={() => { setShowModal(false); setSelectedProduct(null) }}
        onSuccess={fetchProducts}
        editProduct={selectedProduct}
      />

      <DeleteModal
        show={showDeleteModal}
        product={selectedProduct}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
