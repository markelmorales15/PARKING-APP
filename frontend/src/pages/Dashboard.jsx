import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditListing from './EditListing';
import GarageDetail from './GarageDetail';

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingDetail, setIsViewingDetail] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);

  const navigate = useNavigate();

  const handleEditListing = (garage) => {
    setSelectedGarage(garage);
    setIsEditing(true);
  };

  const handleViewDetails = (garage) => {
    setSelectedGarage(garage);
    setIsViewingDetail(true);
  };

  const handleCloseEditModal = () => {
    setIsEditing(false);
    setSelectedGarage(null);
  };

  const handleCloseDetailModal = () => {
    setIsViewingDetail(false);
    setSelectedGarage(null);
  };

  // Navegar a perfil usuario
  const goToUserProfile = () => {
    navigate('/UserProfile');
  };

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    photo: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  const userBookings = [
    {
      id: "b1",
      garageName: "Downtown Secure Garage",
      location: "123 Main St, Downtown",
      startDate: "2023-06-15",
      endDate: "2023-06-17",
      totalPrice: 75.00,
      status: "Active",
      garagePhoto: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "b2",
      garageName: "Riverside Carport",
      location: "789 River Rd, Riverside",
      startDate: "2023-07-01",
      endDate: "2023-07-05",
      totalPrice: 60.00,
      status: "Upcoming",
      garagePhoto: "https://images.unsplash.com/photo-1565361641430-1f15c3467d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "b3",
      garageName: "Luxury Condo Garage",
      location: "1010 Parkway Blvd, Eastside",
      startDate: "2023-05-20",
      endDate: "2023-05-22",
      totalPrice: 70.00,
      status: "Completed",
      garagePhoto: "https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const userGarages = [
    {
      id: "g1",
      name: "Home Garage Spot",
      location: "456 Residential Ave, Suburbia",
      price: 22.00,
      dimensions: "10x20 ft",
      accessType: "Remote",
      covered: true,
      description: "Clean, secure garage space in residential area. Perfect for daily parking.",
      status: "Available",
      photo: "https://images.unsplash.com/photo-1558349699-f6dd3c78be7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      totalBookings: 12,
      rating: 4.8
    },
    {
      id: "g2",
      name: "Business District Parking",
      location: "789 Commerce St, Financial District",
      price: 30.00,
      dimensions: "12x24 ft",
      accessType: "Key Fob",
      covered: true,
      description: "Secure parking in downtown business district with 24/7 security.",
      status: "Available",
      photo: "https://images.unsplash.com/photo-1582202736582-861480b8fcea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      totalBookings: 28,
      rating: 4.5
    }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/HomePage" className="font-bold text-xl text-blue-700">
              PrivateGarage
            </Link>
            <div className="flex items-center">
              <Link to="/HomePage" className="px-3 py-2 text-gray-600 hover:text-blue-700">Home</Link>
              <Link to="/GarageListing" className="px-3 py-2 text-gray-600 hover:text-blue-700">Find Garages</Link>
              <div
                className="ml-4 flex items-center cursor-pointer"
                onClick={goToUserProfile}
                title="Edit Profile"
              >
                <img 
                  src={user.photo} 
                  alt="User profile" 
                  className="h-8 w-8 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user.name}!</h1>
                <p className="mt-1 text-sm text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={goToUserProfile}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats Summary */}
        <div className="mt-4 px-4 sm:px-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Bookings</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{userBookings.length}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Active Listings</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{userGarages.length}</dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">Avg. Rating</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">4.7</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Current Bookings Section */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Your Current Bookings</h2>
            <Link to="/BookingPage" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View All
            </Link>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {userBookings.map((booking) => (
                <li key={booking.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden">
                          <img 
                            src={booking.garagePhoto} 
                            alt={booking.garageName} 
                            className="h-12 w-12 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600">{booking.garageName}</p>
                          <p className="text-sm text-gray-500">{booking.location}</p>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-14a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V4z" clipRule="evenodd" />
                        </svg>
                        <span>${booking.totalPrice.toFixed(2)} total</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User's Listed Garages Section */}
        <div className="mt-8 px-4 sm:px-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Your Listed Garages</h2>
            <Link to="/my-garages" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {userGarages.map((garage) => (
              <div key={garage.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={garage.photo} 
                    alt={garage.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{garage.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {garage.status}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-1 text-sm text-gray-500">{garage.location}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-500">{garage.rating} ({garage.totalBookings} bookings)</span>
                    </div>
                    <div className="text-green-600 font-medium">${garage.price.toFixed(2)}/day</div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEditListing(garage)}
                      className="px-3 py-1 border border-gray-300 text-sm rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Edit Listing
                    </button>
                    <button
                      onClick={() => handleViewDetails(garage)}
                      className="px-3 py-1 border border-gray-300 text-sm rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <EditListing listing={selectedGarage} onClose={handleCloseEditModal} />
        )}

        {isViewingDetail && (
          <GarageDetail garage={selectedGarage} onClose={handleCloseDetailModal} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
