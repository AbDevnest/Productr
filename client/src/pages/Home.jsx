import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import ProductCard from "../components/ProductCard"
import ProductModal from "../components/ProductModal"
import DeleteModal from "../components/DeleteModal"
import { getProducts, deleteProduct, togglePublish } from "../api/productApi"

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("published")
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

  const published = products.filter((p) => p.isPublished === true)
  const unpublished = products.filter((p) => p.isPublished === false)
  const activeProducts = activeTab === "published" ? published : unpublished

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* Tabs */}
          <div className="flex gap-6 border-b mb-6">
            {["published", "unpublished"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-900 text-blue-900"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading && <p className="text-gray-400 text-center mt-20">Loading...</p>}

          {!loading && activeProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
              <div className="text-5xl text-blue-900">⊞</div>
              <p className="font-semibold text-gray-700 text-lg">
                {activeTab === "published" ? "No Published Products" : "No Unpublished Products"}
              </p>
              <p className="text-gray-400 text-sm text-center">
                Your {activeTab} Products will appear here
              </p>
            </div>
          )}

          {!loading && activeProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProducts.map((product) => (
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
