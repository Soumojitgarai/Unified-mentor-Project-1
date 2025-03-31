"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, Edit, Trash, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type Todo = {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos")
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (e) {
        console.error("Failed to parse saved todos")
      }
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim() === "") return

    const newItem: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
    }

    setTodos([...todos, newItem])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = () => {
    if (editText.trim() === "") return

    setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editText.trim() } : todo)))
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed))
  }

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === "active") return !todo.completed
    if (activeFilter === "completed") return todo.completed
    return true
  })

  const activeTodosCount = todos.filter((todo) => !todo.completed).length
  const completedTodosCount = todos.filter((todo) => todo.completed).length

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-background rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Todo List</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </form>

      <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({todos.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeTodosCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTodosCount})</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredTodos.length > 0 ? (
        <ul className="space-y-2 mb-4">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={cn("flex items-center gap-2 p-3 rounded-md border", todo.completed && "bg-muted")}
            >
              {editingId === todo.id ? (
                <div className="flex items-center gap-2 w-full">
                  <Input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button size="icon" variant="ghost" onClick={saveEdit}>
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Save</span>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-6 w-6 rounded-full border",
                      todo.completed && "bg-primary text-primary-foreground",
                    )}
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.completed && <Check className="h-3 w-3" />}
                    <span className="sr-only">{todo.completed ? "Mark as incomplete" : "Mark as complete"}</span>
                  </Button>
                  <span className={cn("flex-1", todo.completed && "line-through text-muted-foreground")}>
                    {todo.text}
                  </span>
                  <Button size="icon" variant="ghost" onClick={() => startEditing(todo)} disabled={todo.completed}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {activeFilter === "all"
            ? "Add your first task!"
            : activeFilter === "active"
              ? "No active tasks"
              : "No completed tasks"}
        </div>
      )}

      {completedTodosCount > 0 && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearCompleted}>
            Clear completed
          </Button>
        </div>
      )}
    </div>
  )
}

