import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, Users, UserCheck, Clock, TrendingUp } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001' // Fallback for local development

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalCustomers: 0,
    totalCrews: 0,
    upcomingAppointments: []
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, customersRes, crewsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/appointments`),
        fetch(`${API_BASE_URL}/api/customers`),
        fetch(`${API_BASE_URL}/api/crews`)
      ])

      if (!appointmentsRes.ok || !customersRes.ok || !crewsRes.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const appointments = await appointmentsRes.json()
      const customers = await customersRes.json()
      const crews = await crewsRes.json()

      const today = new Date().toISOString().split('T')[0]
      const todayAppointments = appointments.filter(app => app.appointment_date === today).length

      // Sort upcoming appointments by date and time
      const upcomingAppointments = appointments
        .filter(app => new Date(app.appointment_date) >= new Date())
        .sort((a, b) => {
          const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`)
          const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`)
          return dateA - dateB
        })
        .slice(0, 5) // Limit to 5 upcoming appointments
        .map(app => ({
          id: app.id,
          customer: app.customer?.name || 'N/A',
          date: app.appointment_date,
          time: app.appointment_time,
          status: app.status,
          origin: app.origin_address,
          destination: app.destination_address
        }))

      setStats({
        totalAppointments: appointments.length,
        todayAppointments: todayAppointments,
        totalCustomers: customers.length,
        totalCrews: crews.length,
        upcomingAppointments: upcomingAppointments
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {/* Dynamic message based on actual data */}
              {stats.totalAppointments > 0 ? `Total: ${stats.totalAppointments}` : 'No appointments yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayAppointments > 0 ? `Scheduled for today` : 'No appointments today'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCustomers > 0 ? `Total: ${stats.totalCustomers}` : 'No customers yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crews</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCrews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCrews > 0 ? `Total: ${stats.totalCrews}` : 'No crews yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>
            Next scheduled moving appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.upcomingAppointments.length > 0 ? (
              stats.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{appointment.customer}</h4>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {appointment.date} at {appointment.time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      From: {appointment.origin}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      To: {appointment.destination}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No upcoming appointments.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard


