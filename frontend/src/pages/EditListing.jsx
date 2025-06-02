import React, { useState, useEffect } from 'react';

const EditListing = ({ listing, onClose, onSave }) => {
  // Inicializar estado local con los datos del listing
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    dimensions: '',
    accessType: '',
    covered: false,
    description: '',
    photoUrl: '',
    photoFile: null, // Para almacenar archivo local
  });

  // Cargar los datos actuales cuando listing cambie
  useEffect(() => {
    if (listing) {
      setFormData({
        name: listing.name || '',
        location: listing.location || '',
        price: listing.price || '',
        dimensions: listing.dimensions || '',
        accessType: listing.accessType || '',
        covered: listing.covered || false,
        description: listing.description || '',
        photoUrl: listing.photo || '',
        photoFile: null,
      });
    }
  }, [listing]);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar subida de imagen (simulada, solo preview)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoUrl: URL.createObjectURL(file)
      }));
    }
  };

  // Validación básica
  const validate = () => {
    if (!formData.name.trim()) {
      alert('Name is required');
      return false;
    }
    if (!formData.location.trim()) {
      alert('Location is required');
      return false;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      alert('Price must be a positive number');
      return false;
    }
    if (!formData.dimensions.trim()) {
      alert('Dimensions are required');
      return false;
    }
    if (!formData.accessType.trim()) {
      alert('Access Type is required');
      return false;
    }
    if (!formData.description.trim()) {
      alert('Description is required');
      return false;
    }
    return true;
  };

  // Manejar submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Aquí normalmente enviarías a backend, pero para demo:
    onSave({
      ...formData,
      price: Number(formData.price),
      photo: formData.photoUrl,
    });

    onClose();
  };

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
        <h2 className="text-xl font-bold mb-6">Edit Listing: {listing.name}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Foto actual + upload */}
          <div>
            <label className="block mb-2 font-medium">Current Photo</label>
            {formData.photoUrl && (
              <img
                src={formData.photoUrl}
                alt="Garage"
                className="mb-3 w-full max-h-48 object-cover rounded"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Ubicación */}
          <div>
            <label htmlFor="location" className="block mb-1 font-medium">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="price" className="block mb-1 font-medium">Price (per day)</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Dimensiones */}
          <div>
            <label htmlFor="dimensions" className="block mb-1 font-medium">Dimensions</label>
            <input
              id="dimensions"
              name="dimensions"
              type="text"
              value={formData.dimensions}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Tipo de acceso */}
          <div>
            <label htmlFor="accessType" className="block mb-1 font-medium">Access Type</label>
            <input
              id="accessType"
              name="accessType"
              type="text"
              value={formData.accessType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Cubierto */}
          <div className="flex items-center">
            <input
              id="covered"
              name="covered"
              type="checkbox"
              checked={formData.covered}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="covered" className="font-medium">Covered</label>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block mb-1 font-medium">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
