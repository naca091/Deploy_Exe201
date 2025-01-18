import React, { useState, useEffect } from 'react';
import { 
    Card, CardContent, CardHeader, 
    CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
    Table, TableBody, TableCell, 
    TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';

const RoleList = ({ onEdit, onAdd }) => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/roles');
            const data = await response.json();
            
            if (data.success) {
                setRoles(data.data);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: data.message || "Failed to fetch roles"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load roles"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleDelete = async (roleId) => {
        try {
            const response = await fetch(`/api/roles/${roleId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Role deleted successfully"
                });
                fetchRoles();
            } else {
                const data = await response.json();
                throw new Error(data.message);
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to delete role"
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Roles</CardTitle>
                        <CardDescription>
                            Manage system roles and permissions
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={fetchRoles}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button onClick={onAdd}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Role
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role ID</TableHead>
                                <TableHead>Role Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell 
                                        colSpan={4} 
                                        className="text-center h-24"
                                    >
                                        <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : roles.length === 0 ? (
                                <TableRow>
                                    <TableCell 
                                        colSpan={4} 
                                        className="text-center h-24"
                                    >
                                        No roles found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role) => (
                                    <TableRow key={role._id}>
                                        <TableCell>{role.roleId}</TableCell>
                                        <TableCell className="capitalize">
                                            {role.roleName}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(role.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEdit(role)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Delete Role
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete this role? 
                                                                This action cannot be undone and may affect users 
                                                                assigned to this role.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Cancel
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(role._id)}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default RoleList;