import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchClothes } from "../../redux/reducer/clothesSlice";
import { fetchCategory } from "../../redux/reducer/catagorySlice";
import { addToCart } from "../../redux/reducer/cartSlice";
import api from "../../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Eye, ShoppingBag, X, ArrowRight, Truck, ShieldCheck, Sparkles } from "lucide-react";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
    title: "The Fall Collection",
    subtitle: "Refined essentials for the modern wardrobe. Discover pieces designed to last.",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
    title: "Elevated Everyday",
    subtitle: "Timeless silhouettes crafted from premium materials.",
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop",
    title: "Modern Classics",
    subtitle: "Curated selections that transcend seasonal trends.",
  },
];

const Home = () => {
  const dispatch = useDispatch();

  const { clothes, loading, error } = useSelector((state) => state.clothes);
  const { categories } = useSelector((state) => state.category);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    dispatch(fetchClothes());
    dispatch(fetchCategory());
  }, [dispatch]);

  const clothesList = Array.isArray(clothes) ? clothes : clothes?.data || [];
  const categoryList = Array.isArray(categories) ? categories : categories?.data || [];

  const filteredClothes = selectedCategoryId
    ? clothesList.filter((item) => {
      const cat = item.category;
      const id = typeof cat === "object" ? cat?._id : cat;
      return id === selectedCategoryId;
    })
    : clothesList;

  const openQuickView = async (productId) => {
    setIsModalOpen(true);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/clothes/all/${productId}`);
      if (res.data?.data) {
        setSelectedProduct(res.data.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load product details");
      setIsModalOpen(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeQuickView = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  };

  const handleCategoryClick = (id) => {
    setSelectedCategoryId(id);
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    dispatch(addToCart(item));
    toast.success("Added to your bag", {
      position: "bottom-right",
      theme: "dark",
      style: { borderRadius: '0', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '12px', fontWeight: 'bold' }
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900"></div>
    </div>
  );
  if (error) return <div className="p-10 text-center text-red-500 tracking-wide font-medium">{error}</div>;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-0">

      <div className="relative h-[90vh] w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination, Navigation]}
          effect="fade"
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true, el: '.swiper-pagination-custom' }}
          loop={true}
          className="h-full w-full g roup"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full w-full">
                <img
                  src={slide.image}
                  className="h-full w-full object-cover"
                  alt={`Slide ${index}`}
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent flex flex-col justify-center px-8 md:px-24">
                  <div className="max-w-2xl animate-fade-in-up">
                    <h1 className="text-4xl md:text-7xl font-serif text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 font-light tracking-wide mb-10 max-w-lg">
                      {slide.subtitle}
                    </p>
                    <button
                      onClick={() => {
                        const el = document.getElementById('products-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="group/btn inline-flex items-center gap-4 bg-white text-slate-900 px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all duration-300"
                    >
                      Shop Collection <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination-custom absolute bottom-10 left-8 md:left-24 z-10 flex gap-2"></div>
        </Swiper>
      </div>
      <div className="border-b border-slate-100 bg-white py-8 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16">
          <div className="flex items-center gap-4 group cursor-default">
            <Truck className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            <span className="text-xs font-semibold tracking-widest text-slate-900 uppercase">Complimentary Shipping</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-slate-200"></div>
          <div className="flex items-center gap-4 group cursor-default">
            <Sparkles className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            <span className="text-xs font-semibold tracking-widest text-slate-900 uppercase">Premium Quality</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-slate-200"></div>
          <div className="flex items-center gap-4 group cursor-default">
            <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            <span className="text-xs font-semibold tracking-widest text-slate-900 uppercase">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 px-6 sm:px-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Curated Collections</h2>
          <div className="w-75 h-px bg-slate-900"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryList.slice(0, 4).map((item) => (
            <div
              key={item._id}
              onClick={() => handleCategoryClick(item._id)}
              className="group relative aspect-3/4 overflow-hidden bg-slate-100 cursor-pointer"
            >
              <img
                src={`http://localhost:3000/${item.image}`}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <h3 className="text-3xl font-serif text-white mb-4">{item.name}</h3>
                <span className="inline-flex items-center gap-2 text-white text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-[60vh] mt-32">
        <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover fixed-attachment" alt="Essentials" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center">
          <div className="max-w-3xl px-6">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-tight">Effortless Elegance for the Modern Silhouette</h2>
            <button
              onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-block border border-white bg-transparent text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              Discover the Edit
            </button>
          </div>
        </div>
      </div>

      <div id="products-section" className="max-w-7xl mx-auto mt-32 px-6 sm:px-10 mb-32">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Latest Arrivals</h2>
          <div className="w-50 h-px bg-slate-900 mb-12"></div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 border-b-2 ${!selectedCategoryId ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
            >
              All
            </button>
            {categoryList.map((item) => (
              <button
                key={item._id}
                onClick={() => setSelectedCategoryId(item._id)}
                className={`px-6 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-300 border-b-2 ${selectedCategoryId === item._id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-900'}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {filteredClothes.length === 0 ? (
          <div className="py-32 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-6" />
            <h3 className="text-xl font-serif text-slate-700 mb-2">No items found</h3>
            <p className="text-slate-500 text-sm">Explore our other collections.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {filteredClothes.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col cursor-pointer"
                onClick={() => openQuickView(item._id)}
              >
                <div className="relative aspect-3/4 overflow-hidden bg-slate-100 mb-6 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-shadow duration-500">
                  <img
                    src={`http://localhost:3000/${item.images?.[0]}`}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    alt={item.name}
                    loading="lazy"
                  />

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white text-slate-900 text-[10px] font-bold px-3 py-1 tracking-widest uppercase">New</span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex flex-col gap-2">
                    <button
                      onClick={(e) => handleAddToCart(e, item)}
                      className="w-full bg-slate-900 text-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-slate-800 transition-colors"
                    >
                      Add to Bag
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuickView(item._id);
                      }}
                      className="w-full bg-white/95 backdrop-blur-sm text-slate-900 py-3 text-xs font-bold tracking-widest uppercase hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Quick View
                    </button>
                  </div>
                </div>

                <div className="flex flex-col text-center px-2">
                  <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-widest">{item.category?.name || 'Category'}</p>
                  <h3 className="text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors mb-2 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm font-semibold text-slate-900 mt-auto">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeQuickView}></div>
          <div className="bg-white w-full max-w-5xl relative z-10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] animate-fade-in-up">
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-slate-900 p-2 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {loadingDetails ? (
              <div className="w-full flex flex-col items-center justify-center p-20 min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-slate-900 mb-4"></div>
                <p className="text-slate-500 font-medium text-sm uppercase tracking-widest">Loading Premium Detail...</p>
              </div>
            ) : selectedProduct ? (
              <>
                <div className="w-full md:w-1/2 bg-slate-50 relative h-[40vh] md:h-auto">
                  <img
                    src={`http://localhost:3000/${selectedProduct.images?.[0]}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={selectedProduct.name}
                  />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-white overflow-y-auto no-scrollbar">
                  <div className="my-auto">
                    <p className="text-xs text-slate-400 font-bold mb-3 uppercase tracking-widest">{selectedProduct.category?.name || 'Premium'}</p>
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">{selectedProduct.name}</h2>
                    <p className="text-xl text-slate-600 mb-8 font-medium">₹{selectedProduct.price}</p>

                    <div className="h-px w-16 bg-slate-200 mb-8"></div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-10 w-full">
                      {selectedProduct.description || "Indulge in our exquisite collection, crafted with precision for the modern individual seeking unparalleled comfort and style. Every detail has been thoughtfully considered."}
                    </p>

                    <div className="mb-8">
                      <span className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Color</span>
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.colors?.length ? selectedProduct.colors.map((color, i) => (
                          <span key={i} className="px-5 py-2 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider hover:border-slate-900 hover:bg-slate-50 cursor-pointer transition-colors">
                            {color}
                          </span>
                        )) : (
                          <span className="text-slate-500 text-sm italic">Standard Edition</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-10">
                      <span className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Size</span>
                      <div className="flex flex-wrap gap-3">
                        {selectedProduct.sizes?.length ? selectedProduct.sizes.map((size, i) => (
                          <span key={i} className="w-12 h-12 flex items-center justify-center border border-slate-200 text-slate-700 text-xs font-bold uppercase hover:border-slate-900 hover:bg-slate-50 cursor-pointer transition-colors">
                            {size}
                          </span>
                        )) : (
                          <span className="text-slate-500 text-sm italic">One Size</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        handleAddToCart(e, selectedProduct);
                        closeQuickView();
                      }}
                      className="w-full bg-slate-900 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-3"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Bag
                    </button>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <p className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wider">
                        <Truck className="w-4 h-4" /> Free shipping on all orders
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-20 w-full min-h-[50vh]">
                <p className="text-red-500 font-medium">Failed to load product details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
