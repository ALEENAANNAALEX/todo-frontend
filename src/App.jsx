import { useState, useEffect } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editingTodo, setEditingTodo] = useState(null)
  const [editText, setEditText] = useState('')

  const API_URL = 'http://localhost:5000/api/todos'

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newTodo,
          completed: false
        }),
      })
      const data = await response.json()
      setTodos([...todos, data])
      setNewTodo('')
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      setTodos(todos.filter(todo => todo._id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find(t => t._id === id)
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed
        }),
      })
      const data = await response.json()
      setTodos(todos.map(t => t._id === id ? data : t))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const startEdit = (todo) => {
    setEditingTodo(todo._id)
    setEditText(todo.text)
  }

  const saveEdit = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: editText
        }),
      })
      const data = await response.json()
      setTodos(todos.map(t => t._id === id ? data : t))
      setEditingTodo(null)
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Add Todo Form */}
          <form onSubmit={addTodo} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          </form>

          {/* Todo List */}
          <div className="space-y-4">
            {todos.map(todo => (
              <div
                key={todo._id}
                className="bg-white p-4 rounded-lg shadow flex items-center justify-between transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo._id)}
                    className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
                  />
                  {editingTodo === todo._id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(todo._id)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo._id)}
                      className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.text}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingTodo !== todo._id && (
                    <button
                      onClick={() => startEdit(todo)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
