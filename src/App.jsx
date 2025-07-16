import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Calendar, Users, UserCheck, Truck } from 'lucide-react'
import CustomerManagement from './components/CustomerManagement.jsx'
import CrewManagement from './components/CrewManagement.jsx'
import AppointmentManagement from './components/AppointmentManagement.jsx'
import Dashboard from './components/Dashboard.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Moving Company Scheduler</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Professional Moving Services Management
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </TabsTrigger>
            <TabsTrigger value="crews" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Crews</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <AppointmentManagement />
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="crews" className="mt-6">
            <CrewManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App

