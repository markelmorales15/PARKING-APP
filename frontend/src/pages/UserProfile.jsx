import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Assuming AuthContext is here

// Create a new React component for the User Profile page
const UserProfile = () => {
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const [walletBalance, setWalletBalance] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const [walletError, setWalletError] = useState(null);

  // Mock data for demonstration - replace with actual data fetching for reviews and user details later
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    phone: "123-456-7890",
    joined: "2023-01-10"
  };

  const reviews = [
    { id: 1, garage: "Downtown Garage", rating: 5, comment: "Excellent space!", date: "2023-06-12" },
    { id: 2, garage: "Suburb Carport", rating: 4, comment: "Nice and clean", date: "2023-05-03" }
  ];

  useEffect(() => {
    // Fetch the logged-in user's wallet balance using AuthContext and the GET /api/wallet/:userId endpoint
    const fetchWalletBalance = async () => {
      if (!user || !user.id) {
        setLoadingWallet(false);
        return;
      }
      try {
        setLoadingWallet(true);
        const response = await fetch(`/api/wallet/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
          },
        });
        const data = await response.json();
        setWalletBalance(data.balance);
      } catch (err) {
        setWalletError('Failed to fetch wallet balance.');
      } finally {
        setLoadingWallet(false);
      }
    };
    fetchWalletBalance();
  }, [user]);

  // Formatea la fecha para presentación
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Renderiza estrellas para rating
  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center space-x-6">
          <img src={mockUser.photo} alt="profile" className="w-24 h-24 rounded-full" />
          <div>
            <h2 className="text-3xl font-semibold">{user ? user.name : 'Guest'}</h2> {/* Use actual user name */}
            {user && <p className="text-gray-700">{user.email}</p>} {/* Use actual user email */}
            <p className="text-gray-500 text-sm">Phone: {mockUser.phone}</p>
            <p className="text-gray-500 text-sm">Joined on {formatDate(mockUser.joined)}</p>
          </div>
        </div>

        <section className="mt-8 p-6 bg-blue-50 rounded-lg shadow-inner">
 <h3 className="text-xl font-semibold mb-4 border-b border-blue-300 pb-2">Wallet</h3>
          {loadingWallet ? (
            <p>Loading wallet balance...</p>
          ) : walletError ? (
            <p className="text-red-600">{walletError}</p>
          ) : (
            <div className="flex justify-between items-center">
 <p className="text-2xl font-bold text-blue-700">Balance: ${walletBalance !== null ? walletBalance.toFixed(2) : 'N/A'}</p>
              <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                Top Up Wallet {/* "Top Up Wallet" button (non-functional for now) */}
              </button>
            </div>
          )}
        </section>

        <section className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">Transaction History</h3>
          {/* Section for future transaction history */}
          <p className="text-gray-600">Transaction history will be displayed here.</p>
        </section>

        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">My Reviews</h3>
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="p-4 bg-gray-50 rounded-md shadow">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{review.garage}</p>
                    <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                  </div>
                  <span className="text-yellow-400 font-semibold text-lg">{renderStars(review.rating)}</span>
                </div>
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
