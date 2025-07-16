import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, DollarSign } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001' // Fallback for local development

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([])
  const [customers, setCustomers] = useState([])
  const [crews, setCrews] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    crew_id: '',
    appointment_date: '',
    appointment_time: '',
    estimated_duration: '',
    origin_address: '',
    destination_address: '',
    status: 'scheduled',
    notes: '',
    estimated_cost: '',
    actual_cost: ''
  })

  useEffect(() => {
    fetchAppointments()
    fetchCustomers()
    fetchCrews()
  }, [])

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointments`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setAppointments(data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchCrews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crews`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCrews(data)
    } catch (error) {
      console.error('Error fetching crews:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let response
      const payload = {
        ...formData,
        customer_id: parseInt(formData.customer_id),
        crew_id: formData.crew_id ? parseInt(formData.crew_id) : null,
        estimated_duration: formData.estimated_duration ? parseInt(formData.estimated_duration) : null,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
        actual_cost: formData.actual_cost ? parseFloat(formData.actual_cost) : null,
      }

      if (editingAppointment) {
        response = await fetch(`${API_BASE_URL}/api/appointments/${editingAppointment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      } else {
        response = await fetch(`${API_BASE_URL}/api/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchAppointments()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving appointment:', error)
    }
  }

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment)
    setFormData({
      customer_id: appointment.customer_id.toString(),
      crew_id: appointment.crew_id?.toString() || '',
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      estimated_duration: appointment.estimated_duration?.toString() || '',
      origin_address: appointment.origin_address,
      destination_address: appointment.destination_address,
      status: appointment.status,
      notes: appointment.notes || '',
      estimated_cost: appointment.estimated_cost?.toString() || '',
      actual_cost: appointment.actual_cost?.toString() || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        fetchAppointments()
      } catch (error) {
        console.error('Error deleting appointment:', error)
      }
    }
  }

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const appointmentToUpdate = appointments.find(app => app.id === appointmentId)
      if (!appointmentToUpdate) return

      const response = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...appointmentToUpdate, status: newStatus })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      fetchAppointments()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      customer_id: '',
      crew_id: '',
      appointment_date: '',
      appointment_time: '',
      estimated_duration: '',
      origin_address: '',
      destination_address: '',
      status: 'scheduled',
      notes: '',
      estimated_cost: '',
      actual_cost: ''
    })
    setEditingAppointment(null)
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

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Appointment Management</CardTitle>
              <CardDescription>
                Schedule and manage moving appointments
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingAppointment
                      ? 'Update appointment details below.'
                      : 'Fill in the details to schedule a new moving appointment.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="customer">Customer *</Label>
                        <Select
                          value={formData.customer_id}
                          onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map(customer => (
                              <SelectItem key={customer.id} value={customer.id.toString()}>
                                {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="crew">Crew</Label>
                        <Select
                          value={formData.crew_id}
                          onValueChange={(value) => setFormData({ ...formData, crew_id: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select crew" />
                          </SelectTrigger>
                          <SelectContent>
                            {crews.map(crew => (
                              <SelectItem key={crew.id} value={crew.id.toString()}>
                                {crew.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.appointment_date}
                          onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.appointment_time}
                          onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.estimated_duration}
                          onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                          placeholder="240"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="origin">Origin Address *</Label>
                      <Textarea
                        id="origin"
                        value={formData.origin_address}
                        onChange={(e) => setFormData({ ...formData, origin_address: e.target.value })}
                        placeholder="Starting address"
                        required
                        rows={2}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="destination">Destination Address *</Label>
                      <Textarea
                        id="destination"
                        value={formData.destination_address}
                        onChange={(e) => setFormData({ ...formData, destination_address: e.target.value })}
                        placeholder="Ending address"
                        required
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="estimated-cost">Estimated Cost ($)</Label>
                        <Input
                          id="estimated-cost"
                          type="number"
                          step="0.01"
                          value={formData.estimated_cost}
                          onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                          placeholder="1200.00"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="actual-cost">Actual Cost ($)</Label>
                        <Input
                          id="actual-cost"
                          type="number"
                          step="0.01"
                          value={formData.actual_cost}
                          onChange={(e) => setFormData({ ...formData, actual_cost: e.target.value })}
                          placeholder="1150.00"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Additional notes about the move"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingAppointment ? 'Update' : 'Schedule'} Appointment
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Addresses</TableHead>
                <TableHead>Crew</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.customer?.name}</div>
                      <div className="text-sm text-muted-foreground">{appointment.customer?.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {appointment.appointment_date}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {appointment.appointment_time}
                      </div>
                      {appointment.estimated_duration && (
                        <div className="text-xs text-muted-foreground">
                          Duration: {formatDuration(appointment.estimated_duration)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 max-w-xs">
                      <div className="flex items-start text-sm">
                        <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0 text-green-600" />
                        <span className="line-clamp-2">{appointment.origin_address}</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0 text-red-600" />
                        <span className="line-clamp-2">{appointment.destination_address}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {appointment.crew?.name || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={appointment.status}
                      onValueChange={(value) => handleStatusUpdate(appointment.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {appointment.estimated_cost && (
                        <div className="flex items-center text-sm">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Est: ${appointment.estimated_cost}
                        </div>
                      )}
                      {appointment.actual_cost && (
                        <div className="flex items-center text-sm font-medium">
                          <DollarSign className="h-3 w-3 mr-1" />
                          Actual: ${appointment.actual_cost}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(appointment)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default AppointmentManagement


