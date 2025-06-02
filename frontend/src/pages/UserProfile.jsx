import React from 'react';

const UserProfile = () => {
  const user = {
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
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <div className="flex items-center space-x-6">
          <img src={user.photo} alt="profile" className="w-24 h-24 rounded-full" />
          <div>
            <h2 className="text-3xl font-semibold">{user.name}</h2>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-gray-500 text-sm">Phone: {user.phone}</p>
            <p className="text-gray-500 text-sm">Joined on {formatDate(user.joined)}</p>
          </div>
        </div>

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
