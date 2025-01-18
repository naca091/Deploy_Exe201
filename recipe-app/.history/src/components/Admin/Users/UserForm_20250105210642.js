import React, { useEffect } from 'react';
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

const UserForm = ({ user, onSubmit, onCancel }) => {
    const [roles, setRoles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Initialize form with default values
    const defaultValues = {
        username: '',
        password: '',
        email: '',
        fullName: '',
        phone: '',
        address: '',
        coins: 0,
        role: '',
        isActive: true,
        avatar: ''
    };

    const [formData, setFormData] = useState(defaultValues);

    useEffect(() => {
        // Fetch roles when component mounts
        fetchRoles();
        
        // If editing, populate form with user data
        if (user) {
            setFormData({
                ...user,
                password: '', // Don't populate password for security
                role: user.role?._id || user.role // Handle both populated and unpopulated role
            });
        }
    }, [user]);

    const fetchRoles = async () => {
        try {
            const response = await fetch('/api/roles');
            const data = await response.json();
            if (data.success) {
                setRoles(data.data);
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleRoleChange = (value) => {
        setFormData(prev => ({
            ...prev,
            role: value
        }));
    };

    const validateForm = () => {
        const errors = {};

        // Username validation
        if (!formData.username) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 4) {
            errors.username = 'Username must be at least 4 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            errors.username = 'Username can only contain letters, numbers and underscores';
        }

        // Password validation (required for new users)
        if (!user && !formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password && formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            errors.email = 'Invalid email address';
        }

        // Full name validation
        if (!formData.fullName) {
            errors.fullName = 'Full name is required';
        } else if (formData.fullName.length < 2) {
            errors.fullName = 'Full name must be at least 2 characters';
        }

        // Phone validation
        if (formData.phone && !/^(\+84|84|0)?[1-9]\d{8,9}$/.test(formData.phone)) {
            errors.phone = 'Invalid phone number';
        }

        // Coins validation
        if (formData.coins < 0) {
            errors.coins = 'Coins cannot be negative';
        }

        // Role validation
        if (!formData.role) {
            errors.role = 'Role is required';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setError(Object.values(errors).join(', '));
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = { ...formData };
            if (!submitData.password) {
                delete submitData.password; // Don't send empty password
            }

            await onSubmit(submitData);
            if (!user) {
                setFormData(defaultValues); // Reset form after successful creation
            }
        } catch (error) {
            setError(error.message || 'An error occurred while saving the user');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>
                    {user ? 'Edit User' : 'Create New User'}
                </CardTitle>
            </CardHeader>
            
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <FormItem>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <FormControl>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                            />
                        </FormControl>
                        <FormDescription>
                            Must be at least 4 characters, letters, numbers and underscores only
                        </FormDescription>
                    </FormItem>

                    <FormItem>
                        <FormLabel htmlFor="password">
                            {user ? 'New Password (leave blank to keep current)' : 'Password'}
                        </FormLabel>
                        <FormControl>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                            />
                        </FormControl>
                        <FormDescription>
                            Must be at least 6 characters
                        </FormDescription>
                    </FormItem>

                    <FormItem>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <FormControl>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </FormControl>
                    </FormItem>

                    <FormItem>
                        <FormLabel htmlFor="fullName">Full Name</FormLabel>
                        <FormControl>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />
                        </FormControl>
                    </FormItem>

                    <FormItem>
                        <FormLabel htmlFor="phone">Phone</FormLabel>
                        <FormControl>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </FormControl>
                    </FormItem>

                    <FormItem>
                        <FormLabel htmlFor="address">Address</FormLabel>
                        <FormControl>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                            />
                        </FormControl>
                    </FormItem>

                    <FormItem>
                        <FormLabel htmlFor="coins">Coins</FormLabel>
                        <FormControl>
                            <Input
                                id="coins"
                                name="coins"
                                type="number"
                                value={formData.coins}
                                onChange={handleChange}
                                min="0"
                            />
                        </FormControl>
                    </FormItem>

                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                            value={formData.role}
                            onValueChange={handleRoleChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((role) => (
                                    <SelectItem key={role._id} value={role._id}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>

                    <FormItem>
                        <FormLabel htmlFor="avatar">Avatar URL</FormLabel>
                        <FormControl>
                            <Input
                                id="avatar"
                                name="avatar"
                                value={formData.avatar}
                                onChange={handleChange}
                                placeholder="Enter avatar URL"
                            />
                        </FormControl>
                    </FormItem>
                </form>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default UserForm;