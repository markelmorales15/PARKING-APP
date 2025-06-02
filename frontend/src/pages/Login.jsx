// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password });
    navigate('/dashboard');
  };

  const handleGoogleLogin = () => {
    alert('Login con Google (simulado)');
    navigate('/dashboard');
  };

  const handleAppleLogin = () => {
    alert('Login con Apple (solo diseño)');
  };

  const handleGoToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Inicia sesión</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* ... tus inputs ... */}
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Entrar
          </button>
        </form>

        <div className="my-4 text-center text-gray-500 text-sm">o continuar con</div>

        {/* Botones de login social */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 w-full py-2 border rounded-md hover:bg-gray-100 transition"
          >
            <FcGoogle className="text-xl" />
            <span>Iniciar sesión con Google</span>
          </button>
          <button
            onClick={handleAppleLogin}
            className="flex items-center justify-center gap-3 w-full py-2 border rounded-md hover:bg-gray-100 transition"
          >
            <FaApple className="text-xl" />
            <span>Iniciar sesión con Apple</span>
          </button>
        </div>

        {/* Botón para ir a registro */}
        <div className="text-center">
          <button
            onClick={handleGoToRegister}
            className="text-blue-600 hover:underline font-medium"
          >
            ¿No tienes cuenta? Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
