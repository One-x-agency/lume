import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { Edit2, Trash2 } from "lucide-react"

const Categories = () => {
  const [form, setForm] = useState({ name: "", type: "" })
  const [image, setImage] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCats, setLoadingCats] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/category/all")
      if (data && data.data) {
        setCategories(data.data);
      } else if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.log(err)
      toast.error("Failed to fetch categories")
    } finally {
      setLoadingCats(false)
    }
  }
  useEffect(() => {
    fetchCategories()
  }, [])
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleFileChange = (e) => {
    setImage(Array.from(e.target.files))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("type", form.type)

      image.forEach((file) => {
        formData.append("image", file)
      })
      if (isEditMode) {
        await axios.put(`http://localhost:3000/category/update/${editId}`, formData)
        toast.success("Category updated successfully")
      } else {
        await axios.post("http://localhost:3000/category/add", formData)
        toast.success("Category added successfully")
      }
      setForm({ name: "", type: "" })
      setImage([])
      setIsEditMode(false)
      setEditId(null)
      fetchCategories()
    } catch (err) {
      console.log(err.response?.data)
      toast.error(err.response?.data?.message || (isEditMode ? "Error updating category" : "Error adding category"))
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category) => {
    setIsEditMode(true)
    setEditId(category._id)
    setForm({ name: category.name, type: category.type })
    setImage([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return
    try {
      await axios.delete(`http://localhost:3000/category/delete/${id}`)
      toast.success("Category deleted successfully")
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category")
    }
  }

  const handleCancelEdit = () => {
    setIsEditMode(false)
    setEditId(null)
    setForm({ name: "", type: "" })
    setImage([])
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
              {isEditMode ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. T-Shirts" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" required>
                  <option value="">Select type</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image {isEditMode && "(Optional)"}</label>
                <input type="file" onChange={handleFileChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-emerald-700 transition">
                  {loading ? "Saving..." : (isEditMode ? "Update Category" : "Add Category")}
                </button>
                {isEditMode && (
                  <button type="button" onClick={handleCancelEdit} className="bg-slate-200 text-slate-700 font-medium rounded-lg px-4 py-2.5 hover:bg-slate-300 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">All Categories</h2>
            {loadingCats ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No categories found. Add one to get started.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat._id} className="border border-gray-200 rounded-xl p-4 flex gap-4 items-center bg-gray-50 hover:bg-white hover:shadow-md transition">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      <img src={`http://localhost:3000/${cat.image}`} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{cat.name}</h3>
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mt-1">{cat.type}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => handleEdit(cat)} className="text-blue-600 bg-blue-50 p-2 rounded-md hover:bg-blue-100 transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat._id)} className="text-red-600 bg-red-50 p-2 rounded-md hover:bg-red-100 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories
