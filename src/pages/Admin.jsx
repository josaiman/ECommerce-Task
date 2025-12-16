import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, deleteProduct, updateProduct } from '../slices/productSlice';

export default function Admin() {
    const dispatch = useDispatch();
    const { items, loading } = useSelector(state => state.products);
    const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            dispatch(updateProduct({ ...formData, price: Number(formData.price), id: editingId }));
            setEditingId(null);
        } else {
            dispatch(createProduct({ ...formData, price: Number(formData.price) }));
        }
        setFormData({ name: '', price: '', category: '', image: '', description: '' });
    };

    const handleEdit = (product) => {
        setFormData(product);
        setEditingId(product.id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', price: '', category: '', image: '', description: '' });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit lg:col-span-1">
                    <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            placeholder="Product Name"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            placeholder="Price"
                            type="number"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                        <input
                            placeholder="Category"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                        <input
                            placeholder="Image URL (e.g., https://via.placeholder.com/150)"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                                {editingId ? 'Update Product' : 'Add Product'}
                            </button>
                            {editingId && (
                                <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>


                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">Product List</h2>
                    {loading ? <p>Loading...</p> : (
                        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
                            {items.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{p.name}</h4>
                                            <p className="text-sm text-gray-500">₹{p.price} • {p.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="text-blue-500 hover:text-blue-700 p-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
