import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
  localStorage.removeItem("token"); 
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  sessionStorage.clear(); 
  navigate("/");
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="ml-3 text-xl font-bold text-white">
              Manager
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              <Link 
                to="/dashboard"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                Dashboard
              </Link>
              
              <Link 
                to="/simulation"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Simulation
              </Link>
              
              <Link 
                to="/drivers"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Drivers
              </Link>
              
              <Link 
                to="/routes"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Routes
              </Link>
              
              <Link 
                to="/orders"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Orders
              </Link>
            </div>
          </div>

          {/* Right side - Logout */}
          <div className="flex items-center">
            <button 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center border border-transparent hover:border-red-500/30"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (you can add state to toggle this) */}
      <div className="md:hidden border-t border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            to="/dashboard"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          >
            Dashboard
          </Link>
          <Link 
            to="/simulation"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          >
            Simulation
          </Link>
          <Link 
            to="/drivers"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          >
            Drivers
          </Link>
          <Link 
            to="/routes"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          >
            Routes
          </Link>
          <Link 
            to="/orders"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          >
            Orders
          </Link>
        </div>
      </div>
    </nav>
  );
}