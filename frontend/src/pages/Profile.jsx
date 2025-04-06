import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [newProductName, setNewProductName] = useState("");
  const [newProductImage, setNewProductImage] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStatus, setNewStatus] = useState("Delivered");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/user/${id}`);
        setUser(res.data);
        setName(res.data.Name);
        setAddress(res.data.address);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/${id}/receipts`);
        setReceipts(res.data);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    };

    fetchReceipts();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/user/${id}`, {
        name,
        address,
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddReceipt = async () => {
    try {
      await axios.post(`http://localhost:3000/api/user/${id}/receipts`, {
        product_name: newProductName,
        product_image: newProductImage,
        price: parseFloat(newPrice),
        status: newStatus,
      });

      setNewProductName("");
      setNewProductImage("");
      setNewPrice("");
      setNewStatus("Delivered");

      const res = await axios.get(`http://localhost:3000/api/user/${id}/receipts`);
      setReceipts(res.data);
    } catch (error) {
      console.error("Error adding receipt:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center text-gray-800 drop-shadow-sm tracking-wider">
          ✨ Your <span className="text-pink-500">Profile</span> ✨
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section - User Info & Add Receipt */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-pink-100 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-2 rounded-lg mr-3">👤</span>
              User Profile
            </h2>

            {updateSuccess && (
              <div className="mb-4 bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">
                Profile updated successfully!
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-2 rounded-lg font-medium hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] text-sm mb-8"
            >
              Update Profile
            </button>

            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-2 rounded-lg mr-3">➕</span>
              Add New Receipt
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Product Name"
                className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Product Image URL"
                className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                value={newProductImage}
                onChange={(e) => setNewProductImage(e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <select
                className="w-full px-3 py-2 rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition duration-200 outline-none bg-white/50 text-sm"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Delivered">Delivered</option>
                <option value="Processing">Processing</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button
                onClick={handleAddReceipt}
                className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-2 rounded-lg font-medium hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition duration-200 transform hover:scale-[1.02] text-sm"
              >
                Add Receipt
              </button>
            </div>
          </div>

          {/* Right Section - Orders */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-pink-100 p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 text-white p-2 rounded-lg mr-3">🧾</span>
              Your Orders
            </h3>
            
            {receipts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No orders found.</p>
                <p className="text-gray-400 text-xs mt-2">Add your first order using the form on the left.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {receipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/50 border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={receipt.product_image}
                        alt={receipt.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800">{receipt.product_name}</h4>
                      <p className="text-xs text-gray-500 mt-1">₹{receipt.price}</p>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-2 ${
                          receipt.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : receipt.status === "Processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {receipt.status}
                      </span>
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

export default Profile;
