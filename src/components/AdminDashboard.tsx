"use client"

import { useState, useMemo } from "react"
import { Users, Bell, Plus, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmployeeCard } from "@/components/EmployeeCard"
import { SearchBar } from "@/components/SearchBar"
import { DepartmentFilter } from "@/components/DepartmentFilter"
import { BuzzingModal } from "@/components/BuzzingModal"
import { AddEmployeeModal } from "@/components/AddEmployeeModal"
import { useEmployees, type Employee } from "@/hooks/useEmployees"

export function AdminDashboard() {
  const { employees, isLoading, addEmployee, refetch } = useEmployees()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [buzzingEmployee, setBuzzingEmployee] = useState<Employee | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const departments = useMemo(() => {
    const depts = [...new Set(employees.map((e) => e.department))]
    return depts.sort()
  }, [employees])

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.designation.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment
      return matchesSearch && matchesDepartment
    })
  }, [employees, searchQuery, selectedDepartment])

  const onlineCount = employees.filter((e) => e.status === "online").length

  const handleBuzz = (employee: Employee) => {
    setBuzzingEmployee(employee)
    setTimeout(() => {
      setBuzzingEmployee(null)
    }, 5000)
  }

  const handleAddEmployee = async (employee: {
    name: string
    designation: string
    department: string
    phone: string
  }) => {
    await addEmployee(employee)
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card rounded-none border-t-0 border-x-0">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center glow-primary">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-foreground">Veda Office</h1>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={refetch} disabled={isLoading}>
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{employees.length}</p>
                <p className="text-xs text-muted-foreground">Total Employees</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/20 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full status-online" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground">{onlineCount}</p>
                <p className="text-xs text-muted-foreground">Online Now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Employee Button */}
        <Button onClick={() => setShowAddModal(true)} className="w-full" size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Employee
        </Button>

        {/* Search */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Department filter */}
        {departments.length > 0 && (
          <DepartmentFilter departments={departments} selected={selectedDepartment} onChange={setSelectedDepartment} />
        )}

        {/* Employee list */}
        <div className="space-y-4">
          <h2 className="font-display font-semibold text-foreground">Employees ({filteredEmployees.length})</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEmployees.map((employee, index) => (
                <EmployeeCard key={employee.id} employee={employee} onBuzz={handleBuzz} index={index} />
              ))}
            </div>
          )}

          {!isLoading && filteredEmployees.length === 0 && (
            <div className="text-center py-12 glass-card">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {employees.length === 0
                  ? "No employees yet. Add your first employee!"
                  : "No employees found matching your search."}
              </p>
              {employees.length === 0 && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Buzzing Modal */}
      <BuzzingModal isOpen={!!buzzingEmployee} employee={buzzingEmployee} onClose={() => setBuzzingEmployee(null)} />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEmployee}
        departments={departments.length > 0 ? departments : ["Engineering", "Design", "Product", "HR", "Marketing"]}
      />
    </div>
  )
}

export default AdminDashboard
