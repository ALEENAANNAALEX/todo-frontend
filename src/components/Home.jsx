import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import Header from './Header';

function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const API_BASE_URL = 'https://todo-backend-qqex.onrender.com/api/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post(API_BASE_URL, { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, {
        completed: !completed,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, {
        text: editText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h1 className="text-2xl font-bold text-center mb-8">Todo List</h1>
                  <form onSubmit={addTodo} className="flex gap-2">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="Add a new todo"
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                      Add
                    </button>
                  </form>
                  <div className="space-y-4 mt-6">
                    {todos.map((todo) => (
                      <div
                        key={todo._id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        {editingId === todo._id ? (
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={() => saveEdit(todo._id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <span
                              className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}
                            >
                              {todo.text}
                            </span>
                            <button
                              onClick={() => toggleComplete(todo._id, todo.completed)}
                              className="p-2 text-green-500 hover:text-green-600"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => startEdit(todo)}
                              className="p-2 text-blue-500 hover:text-blue-600"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => deleteTodo(todo._id)}
                              className="p-2 text-red-500 hover:text-red-600"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
