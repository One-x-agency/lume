import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import { Edit2, Trash2 } from "lucide-react";

const Products = () => {
    const [image, setImage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [categoriesList, setCategoriesList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
      name: "", price: "", category: "", type: "", sizes: "", colors: "", stock: "", description: "",
    });

    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/clothes/all");
        if (data && data.data) {
          setProducts(data.data);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch products");
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/category/all");
        if (data && data.data) {
          setCategoriesList(data.data);
        } else if (Array.isArray(data)) {
          setCategoriesList(data);
        }
      } catch (err) {
        console.log("Failed to fetch categories list", err);
      }
    };

    useEffect(() => {
      fetchProducts();
      fetchCategories();
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
    
    const handleFileChange = (e) => {
      const files = Array.from(e.target.files || []);
      setImage(files);
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
    
      try {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("type", form.type);
        formData.append("stock", form.stock);
        formData.append("description", form.description);
        
        const sizesArray = typeof form.sizes === 'string' ? form.sizes.split(",").map(s => s.trim()) : form.sizes;
        const colorsArray = typeof form.colors === 'string' ? form.colors.split(",").map(c => c.trim()) : form.colors;
        
        formData.append("sizes", JSON.stringify(sizesArray));
        formData.append("colors", JSON.stringify(colorsArray));
    
        for (let i = 0; i < image.length; i++) {
          formData.append("images", image[i]);
        }
    
        if (isEditMode) {
          await api.put(`/clothes/update/${editId}`, formData, {
            headers: { token: localStorage.getItem("token") },
          });
          toast.success("Product updated successfully");
        } else {
          await api.post("/clothes/add", formData, {
            headers: { token: localStorage.getItem("token") },
          });
          toast.success("Product added successfully");
        }
    
        setForm({
          name:"", price:"", category:"", type:"", sizes:"", colors:"", stock:"", description:"",
        });
        setImage([]);
        setIsEditMode(false);
        setEditId(null);
        fetchProducts();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const handleEdit = (product) => {
      setIsEditMode(true);
      setEditId(product._id);
      setForm({
        name: product.name,
        price: product.price,
        category: product.category?._id || product.category,
        type: product.type,
        sizes: product.sizes ? product.sizes.join(", ") : "",
        colors: product.colors ? product.colors.join(", ") : "",
        stock: product.stock,
        description: product.description || ""
      });
      setImage([]); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
      if (!window.confirm("Are you sure you want to delete this product?")) return;
      try {
        await api.delete(`/clothes/delete/${id}`, {
          headers: { token: localStorage.getItem("token") },
        });
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete product");
      }
    };

    const handleCancelEdit = () => {
      setIsEditMode(false);
      setEditId(null);
      setForm({ name:"", price:"", category:"", type:"", sizes:"", colors:"", stock:"", description:"" });
      setImage([]);
    };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form View */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" required/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" required/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" required/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" required>
                    <option value="">Select a Category</option>
                    {categoriesList.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name} - {cat.type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <input type="text" name="type" value={form.type} onChange={handleChange} placeholder="MEN / WOMEN" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition" required/>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sizes</label>
                <input type="text" name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L, XL" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                <input type="text" name="colors" value={form.colors} onChange={handleChange} placeholder="Red, Blue, Black" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="2" className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Images {isEditMode && "(Optional)"}</label>
                <input type="file" multiple onChange={handleFileChange} className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none transition file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"/>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition">
                  {loading ? "Saving..." : (isEditMode ? "Update Product" : "Add Product")}
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

        {/* List View */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">All Products</h2>
            
            {loadingProducts ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : products.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No products found. Add one to get started.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((item) => (
                  <div key={item._id} className="border border-gray-200 rounded-xl p-4 flex gap-4 bg-gray-50 hover:bg-white hover:shadow-md transition">
                    <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      <img src={`http://localhost:3000/${item.images?.[0]}`} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 truncate leading-tight">{item.name}</h3>
                        <p className="text-sm font-semibold text-emerald-600 mt-1">₹{item.price}</p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{document.body.clientWidth < 600 ? "" : (item.category?.name || item.category)} • {item.type}</p>
                        <p className="text-xs text-gray-500 mt-0.5"><span className="font-semibold text-gray-700">Stock:</span> {item.stock}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEdit(item)} className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-blue-100 transition text-xs font-medium">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-600 bg-red-50 px-3 py-1.5 rounded flex items-center gap-1 hover:bg-red-100 transition text-xs font-medium">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
