import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const RoleForm = ({ visible, onCancel, onSuccess, initialValues }) => {
    const [form] = Form.useForm();
    const isEditing = !!initialValues;

    React.useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async (values) => {
        try {
            if (isEditing) {
                await axios.put(`https://demcalo.onrender.com/api/roles/${initialValues._id}`, values);
                message.success('Role updated successfully');
            } else {
                await axios.post('https://demcalo.onrender.com/api/roles', values);
                message.success('Role added successfully');
            }
            form.resetFields();
            if (onSuccess) onSuccess();
        } catch (error) {
            message.error('Operation failed');
        }
    };

    return (
        <Modal
            title={isEditing ? 'Edit Role' : 'Add Role'}
            open={visible}
            onCancel={onCancel}
            onOk={() => form.submit()}
            destroyOnClose
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="roleId"
                    label="Role ID"
                    rules={[{ required: true, message: 'Role ID is required' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name="roleName"
                    label="Role Name"
                    rules={[{ required: true, message: 'Role Name is required' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RoleForm;
