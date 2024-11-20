import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
        

      {/* Main Content */}
      <main className="flex items-center justify-center flex-grow min-h-[calc(100vh-4rem)]">
        <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full m-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome</h2>
            <p className="text-gray-600">
              Choose an option below to get started with Quo-Vadis Youth week challenge 2024
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out"
            >
              Login to Your Account
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out"
            >
              Create New Account
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By continuing, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;