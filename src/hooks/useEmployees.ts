"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

export type EmployeeStatus = "online" | "offline" | "busy"

export interface Employee {
  id: string
  name: string
  designation: string
  department: string
  phone: string
  avatar?: string
  status: EmployeeStatus
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/api/employees`)

      if (!response.ok) {
        throw new Error("Failed to fetch employees")
      }

      const data = await response.json()
      setEmployees(data || [])
    } catch (err: any) {
      console.error("Error fetching employees:", err)
      setError(err.message || "Failed to fetch employees")
      toast({
        title: "Error",
        description: "Failed to load employees. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const addEmployee = useCallback(
    async (employee: Omit<Employee, "id" | "status" | "avatar">) => {
      try {
        const response = await fetch(`${API_URL}/api/employees`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...employee,
            status: "online",
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add employee")
        }

        const data = await response.json()
        setEmployees((prev) => [...prev, data])

        toast({
          title: "Success",
          description: `${employee.name} has been added.`,
        })

        return data
      } catch (err: any) {
        console.error("Error adding employee:", err)
        toast({
          title: "Error",
          description: "Failed to add employee. Please try again.",
          variant: "destructive",
        })
        throw err
      }
    },
    [toast],
  )

  const deleteEmployee = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${API_URL}/api/employees/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete employee")
        }

        setEmployees((prev) => prev.filter((emp) => emp.id !== id))

        toast({
          title: "Success",
          description: "Employee has been removed.",
        })
      } catch (err: any) {
        console.error("Error deleting employee:", err)
        toast({
          title: "Error",
          description: "Failed to delete employee. Please try again.",
          variant: "destructive",
        })
        throw err
      }
    },
    [toast],
  )

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  return {
    employees,
    isLoading,
    error,
    addEmployee,
    deleteEmployee,
    refetch: fetchEmployees,
  }
}
