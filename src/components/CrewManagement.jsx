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
import { Plus, Edit, Trash2, Users, UserPlus } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001' // Fallback for local development

const CrewManagement = () => {
  const [crews, setCrews] = useState([])
  const [crewMembers, setCrewMembers] = useState([])
  const [isCrewDialogOpen, setIsCrewDialogOpen] = useState(false)
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)
  const [editingCrew, setEditingCrew] = useState(null)
  const [editingMember, setEditingMember] = useState(null)
  const [crewFormData, setCrewFormData] = useState({
    name: '',
    description: '',
    is_active: true
  })
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    phone: '',
    email: '',
    position: '',
    is_active: true
  })

  useEffect(() => {
    fetchCrews()
    fetchCrewMembers()
  }, [])

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

  const fetchCrewMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/crew_members`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setCrewMembers(data)
    } catch (error) {
      console.error('Error fetching crew members:', error)
    }
  }

  const handleCrewSubmit = async (e) => {
    e.preventDefault()
    try {
      let response
      if (editingCrew) {
        response = await fetch(`${API_BASE_URL}/api/crews/${editingCrew.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(crewFormData)
        })
      } else {
        response = await fetch(`${API_BASE_URL}/api/crews`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(crewFormData)
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchCrews()
      resetCrewForm()
      setIsCrewDialogOpen(false)
    } catch (error) {
      console.error('Error saving crew:', error)
    }
  }

  const handleMemberSubmit = async (e) => {
    e.preventDefault()
    try {
      let response
      if (editingMember) {
        response = await fetch(`${API_BASE_URL}/api/crew_members/${editingMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(memberFormData)
        })
      } else {
        response = await fetch(`${API_BASE_URL}/api/crew_members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(memberFormData)
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      fetchCrewMembers()
      resetMemberForm()
      setIsMemberDialogOpen(false)
    } catch (error) {
      console.error('Error saving crew member:', error)
    }
  }

  const handleEditCrew = (crew) => {
    setEditingCrew(crew)
    setCrewFormData({
      name: crew.name,
      description: crew.description,
      is_active: crew.is_active
    })
    setIsCrewDialogOpen(true)
  }

  const handleEditMember = (member) => {
    setEditingMember(member)
    setMemberFormData({
      name: member.name,
      phone: member.phone,
      email: member.email,
      position: member.position,
      is_active: member.is_active
    })
    setIsMemberDialogOpen(true)
  }

  const handleDeleteCrew = async (crewId) => {
    if (window.confirm('Are you sure you want to delete this crew?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/crews/${crewId}`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        fetchCrews()
      } catch (error) {
        console.error('Error deleting crew:', error)
      }
    }
  }

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this crew member?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/crew_members/${memberId}`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        fetchCrewMembers()
      } catch (error) {
        console.error('Error deleting crew member:', error)
      }
    }
  }

  const resetCrewForm = () => {
    setCrewFormData({
      name: '',
      description: '',
      is_active: true
    })
    setEditingCrew(null)
  }

  const resetMemberForm = () => {
    setMemberFormData({
      name: '',
      phone: '',
      email: '',
      position: '',
      is_active: true
    })
    setEditingMember(null)
  }

  return (
    <div className="space-y-6">
      {/* Crews Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Crew Teams</CardTitle>
              <CardDescription>
                Manage your moving crew teams and assignments
              </CardDescription>
            </div>
            <Dialog open={isCrewDialogOpen} onOpenChange={setIsCrewDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsCrewDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Crew
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingCrew ? 'Edit Crew' : 'Add New Crew'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingCrew
                      ? 'Update crew information below.'
                      : 'Create a new crew team.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCrewSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="crew-name">Crew Name *</Label>
                      <Input
                        id="crew-name"
                        value={crewFormData.name}
                        onChange={(e) => setCrewFormData({ ...crewFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="crew-description">Description</Label>
                      <Textarea
                        id="crew-description"
                        value={crewFormData.description}
                        onChange={(e) => setCrewFormData({ ...crewFormData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCrewDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingCrew ? 'Update' : 'Add'} Crew
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
                <TableHead>Crew Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crews.map((crew) => (
                <TableRow key={crew.id}>
                  <TableCell className="font-medium">{crew.name}</TableCell>
                  <TableCell>{crew.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {crew.members ? crew.members.length : 0} members
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={crew.is_active ? "default" : "secondary"}>
                      {crew.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCrew(crew)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCrew(crew.id)}
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

      {/* Crew Members Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Crew Members</CardTitle>
              <CardDescription>
                Manage individual crew members and their information
              </CardDescription>
            </div>
            <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsMemberDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingMember ? 'Edit Crew Member' : 'Add New Crew Member'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingMember
                      ? 'Update crew member information below.'
                      : 'Add a new crew member to your team.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleMemberSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="member-name">Name *</Label>
                      <Input
                        id="member-name"
                        value={memberFormData.name}
                        onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="member-phone">Phone</Label>
                      <Input
                        id="member-phone"
                        type="tel"
                        value={memberFormData.phone}
                        onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="member-email">Email</Label>
                      <Input
                        id="member-email"
                        type="email"
                        value={memberFormData.email}
                        onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="member-position">Position</Label>
                      <Select
                        value={memberFormData.position}
                        onValueChange={(value) => setMemberFormData({ ...memberFormData, position: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Team Lead">Team Lead</SelectItem>
                          <SelectItem value="Driver">Driver</SelectItem>
                          <SelectItem value="Helper">Helper</SelectItem>
                          <SelectItem value="Specialist">Specialist</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsMemberDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingMember ? 'Update' : 'Add'} Member
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
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crewMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.position}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {member.phone && <div>{member.phone}</div>}
                      {member.email && <div className="text-muted-foreground">{member.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.is_active ? "default" : "secondary"}>
                      {member.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
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

export default CrewManagement


