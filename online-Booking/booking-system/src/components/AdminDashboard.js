import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Users, LogOut, Edit, Trash, Save, AlertCircle, X } from 'lucide-react';

const AdminDashboard = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return false;
      }

      const response = await fetch('http://localhost:5000/api/admin/check-auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });


      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Invalid response format');
      }

      const adminData = await response.json();
      
      // Handle redirect based on role
      if (adminData.redirect) {
        navigate(adminData.redirect); // Redirect to the appropriate dashboard
        return false; // Prevent further execution
      }

      setCurrentAdmin(adminData); // Set the current admin data
      return true;

    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try logging in again.');
      navigate('/login');
      return false;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchTables = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/tables', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch tables: ${response.status}`);
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Invalid response format');
      }
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
      setError('Failed to load tables. Please try refreshing the page.');
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTableData = async (tableName) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5000/api/admin/tables/${tableName}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch table data: ${response.status}`);
      }
      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Invalid response format');
      }
      const data = await response.json();
      setTableData(data);
      setSelectedTable(tableName);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setError(`Failed to load data for ${tableName}. Please try again.`);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditingRow({ ...row });
  };

  const handleSave = async () => {
    try {
      setError(null);
      const response = await fetch(`http://localhost:5000/api/admin/tables/${selectedTable}/${editingRow.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(editingRow),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`Failed to save changes: ${response.status}`);
      }
      setEditingRow(null);
      await fetchTableData(selectedTable);
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save changes. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        setError(null);
        const response = await fetch(`http://localhost:5000/api/admin/tables/${selectedTable}/${id}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to delete record: ${response.status}`);
        }
        await fetchTableData(selectedTable);
      } catch (error) {
        console.error('Error deleting record:', error);
        setError('Failed to delete record. Please try again.');
      }
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        await fetchTables();
      }
    };
    initializeDashboard();
  }, [checkAuth, fetchTables]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={() => navigate('/logout')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Custom Error Alert */}
      {error && (
        <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-md relative">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto pl-3"
            >
              <X className="h-5 w-5 text-red-500 hover:text-red-600" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm">
          {/* Admin Profile */}
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h2 className="font-medium">{currentAdmin?.name}</h2>
                <p className="text-sm text-gray-500">{currentAdmin?.email}</p>
              </div>
            </div>
          </div>

          {/* Tables List */}
          <nav className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Database Tables
            </h3>
            <div className="mt-4 space-y-1">
              {loading ? (
                <div className="text-sm text-gray-500">Loading tables...</div>
              ) : tables.length > 0 ? (
                tables.map((table) => (
                  <button
                    key={table.name}
                    onClick={() => fetchTableData(table.name)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                      selectedTable === table.name
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Database className="w-4 h-4 mr-3" />
                    <span>{table.name}</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {table.fields} fields
                    </span>
                  </button>
                ))
              ) : (
                <div className="text-sm text-gray-500">No tables available</div>
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading && <div>Loading...</div>}

          {!loading && selectedTable && tableData.length > 0 && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Data for {selectedTable}
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      {/* Map column names */}
                      {tableData[0] &&
                        Object.keys(tableData[0]).map((col) => (
                          <th key={col} className="px-4 py-2 text-sm font-medium text-left text-gray-600 border-b">
                            {col}
                          </th>
                        ))}
                      <th className="px-4 py-2 text-sm text-gray-600 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.id}>
                        {Object.keys(row).map((key) => (
                          <td key={key} className="px-4 py-2 text-sm text-gray-600 border-b">
                            {key === 'id' ? row[key] : editingRow?.id === row.id ? (
                              <input
                                type="text"
                                value={editingRow[key]}
                                onChange={(e) =>
                                  setEditingRow({ ...editingRow, [key]: e.target.value })
                                }
                                className="px-2 py-1 border border-gray-300 rounded-md"
                              />
                            ) : (
                              row[key]
                            )}
                          </td>
                        ))}
                        <td className="px-4 py-2 text-sm text-gray-600 border-b">
                          <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800">
                            <Edit className="w-4 h-4 inline-block mr-2" />
                            Edit
                          </button>
                          <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-800">
                            <Trash className="w-4 h-4 inline-block mr-2" />
                            Delete
                          </button>
                          {editingRow?.id === row.id && (
                            <button onClick={handleSave} className="text-green-600 hover:text-green-800">
                              <Save className="w-4 h-4 inline-block mr-2" />
                              Save
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
