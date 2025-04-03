"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";


export default function GroupManager() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    group_name: "",
    description: "",
    members: [],
  });
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [personas, setPersonas] = useState([]);
  const [groups, setGroups] = useState([]);

  // Fetch personas and groups from backend
  const fetchData = async () => {
    try {
      const [groupsResponse, personasResponse] = await Promise.all([
        fetch("http://localhost:5000/api/groups"),
        fetch("http://localhost:5000/api/personas"),
      ]);

      const groupsData = await groupsResponse.json();
      const personasData = await personasResponse.json();

      // Create a lookup map for personas
      const personaMap = personasData.reduce((acc, persona) => {
        acc[persona.id] = persona.name;
        return acc;
      }, {});

      // Map member IDs to names
      const updatedGroups = groupsData.map((group) => ({
        ...group,
        members: group.members.map((memberId) => ({
          id: memberId,
          name: personaMap[memberId] || "Unknown",
        })),
      }));

      setGroups(updatedGroups);
      setPersonas(personasData);

      console.log("Updated Groups:", updatedGroups); // Debugging log
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // **Call fetchData inside useEffect only once on mount**
  useEffect(() => {
    fetchData();
  }, []);

  
  const handleMemberSelect = (personaId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.some((member) => member.id === personaId)
        ? prev.members.filter((member) => member.id !== personaId)
        : [...prev.members, { id: personaId, name: personas.find((p) => p.id === personaId)?.name || "Unknown" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingGroupId
        ? `http://localhost:5000/api/groups/${editingGroupId}`
        : "http://localhost:5000/api/groups";

      const method = editingGroupId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          group_name: formData.group_name,
          description: formData.description,
          members: formData.members.map((member) => member.id),
        }),
      });

      if (response.ok) {
        setFormData({ group_name: "", description: "", members: [] });
        setEditingGroupId(null);
        
        // **Wait for fetchData() to complete before updating UI**
        await fetchData();
      } else {
        console.error("Failed to create/update group");
      }
    } catch (error) {
      console.error("Error creating/updating group:", error);
    }
  };

  const handleDelete = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
      } else {
        console.error("Failed to delete group");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };
  

  const handleEdit = (groupId) => {
    const selectedGroup = groups.find((group) => group.id === groupId);
  
    if (selectedGroup) {
      setFormData({
        group_name: selectedGroup.group_name,
        description: selectedGroup.description,
        members: selectedGroup.members.map((memberId) => {
          const persona = personas.find((p) => p.id === memberId); 
          return { id: memberId, name: persona ? persona.name : "Unknown" }; 
        }),
      });
  
      setEditingGroupId(groupId);
    }
  };
  



  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </Button>
        <h1 className="text-5xl font-bold text-blue-700 dark:text-blue-400">
          Groups Manager
        </h1>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white border-b pb-3 mb-4">
          Created Groups
        </h2>
        {groups.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No groups created yet.</p>
        ) : (
          <div className="space-y-4">
            {groups.map((group) => (
              <Card key={group.id} className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {group.group_name}
                  </h3>
                  <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(group.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="h-5 w-5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(group.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                  <Trash2 className="h-5 w-5 mr-1" /> Delete
                  </Button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{group.description}</p>
                <div className="mt-3">
                  <Label className="text-gray-800 dark:text-gray-300">Members:</Label>
                  {group.members.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {group.members.map((member) => (
                        <Badge key={member.id} className="bg-blue-500 text-white">
                          {member.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No members added</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {editingGroupId ? "Edit Group" : "Create a New Group"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="group_name">
              Group Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="group_name"
              value={formData.group_name}
              onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
          <Label>Add Members</Label>
<Card className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
  {personas.map((persona) => {
    // Check if persona is already a selected member
    const isSelected = formData.members.some((m) => m.id === persona.id);

    return (
      <div
        key={persona.id}
        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
          isSelected ? "bg-blue-200 dark:bg-blue-700" : "" // Highlight selected members
        }`}
        onClick={() => handleMemberSelect(persona.id)}
      >
        <h3 className="font-semibold">{persona.name}</h3>
        <h3 className="font-semibold">{persona.phone}</h3>
        <Badge className={isSelected ? "bg-green-500 text-white" : "bg-gray-400"}>
          {isSelected ? "Selected" : "Select"}
        </Badge>
      </div>
    );
  })}
</Card>


          </div>

          <Button type="submit" className="bg-blue-600 text-white">
            {editingGroupId ? "Update Group" : "Create Group"}
          </Button>
        </form>
      </div>
    </div>
  );
}
