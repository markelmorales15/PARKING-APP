import React from 'react';

const GarageDetail = ({ garage, onClose }) => {
  if (!garage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-6">{garage.name}</h2>

        {garage.photo && (
          <img
            src={garage.photo}
            alt={garage.name}
            className="w-full max-h-64 object-cover rounded mb-6"
          />
        )}

        <div className="space-y-4 text-gray-700">
          <p><strong>Description:</strong> {garage.description}</p>
          <p><strong>Location:</strong> {garage.location}</p>
          <p><strong>Price per day:</strong> ${garage.price.toFixed(2)}</p>
          <p><strong>Dimensions:</strong> {garage.dimensions}</p>
          <p><strong>Access Type:</strong> {garage.accessType}</p>
          <p><strong>Covered:</strong> {garage.covered ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  );
};

export default GarageDetail;
