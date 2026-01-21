import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Form, Input, message, Upload, Popconfirm, Avatar } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import type { IUser } from "../types/account/IUser";
import { fetchUsers, createUser, updateUser, deleteUser } from "../services/api";

type UserFormValues = {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  password?: string;
  image?: any;
};

const UsersCrudPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [form] = Form.useForm<UserFormValues>();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error: any) {
      message.error("Не вдалося завантажити користувачів");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (user: IUser) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const imageFile: File | undefined =
        values.image && values.image.length > 0 ? values.image[0].originFileObj : undefined;

      setSaving(true);

      if (editingUser) {
        await updateUser(editingUser.id, {
          username: values.username,
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          image: imageFile,
        });
        message.success("Користувача оновлено");
      } else {
        await createUser({
          username: values.username!,
          email: values.email!,
          password: values.password!,
          first_name: values.first_name!,
          last_name: values.last_name!,
          phone: values.phone!,
          image: imageFile,
        });
        message.success("Користувача створено");
      }

      setModalOpen(false);
      form.resetFields();
      await loadUsers();
    } catch (error: any) {
      if (error?.errorFields) return; // validation errors
      const detail = error?.response?.data;
      if (detail && typeof detail === "object") {
        const firstKey = Object.keys(detail)[0];
        message.error(`${firstKey}: ${detail[firstKey]}`);
      } else {
        message.error("Помилка збереження");
      }
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success("Користувача видалено");
      await loadUsers();
    } catch (error: any) {
      message.error("Не вдалося видалити користувача");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Аватар",
      dataIndex: "image_small",
      render: (_: any, record: IUser) => (
        <Avatar src={record.image_small || record.image_medium || record.image_large} icon={<UserOutlined />} />
      ),
    },
    { title: "Логін", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    { title: "Ім'я", dataIndex: "first_name" },
    { title: "Прізвище", dataIndex: "last_name" },
    { title: "Телефон", dataIndex: "phone" },
    {
      title: "Дії",
      render: (_: any, record: IUser) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm title="Видалити користувача?" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Користувачі (CRUD)</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Додати користувача
        </Button>
      </div>

      <Table<IUser>
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={loading}
        bordered
      />

      <Modal
        title={editingUser ? "Редагувати користувача" : "Створити користувача"}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item<UserFormValues>
            label="Логін"
            name="username"
            rules={[{ required: true, message: "Вкажіть логін" }]}
          >
            <Input placeholder="username" />
          </Form.Item>

          <Form.Item<UserFormValues>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Вкажіть email" }, { type: "email", message: "Некоректний email" }]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>

          {!editingUser && (
            <Form.Item<UserFormValues>
              label="Пароль"
              name="password"
              rules={[{ required: true, message: "Вкажіть пароль" }, { min: 8, message: "Мінімум 8 символів" }]}
            >
              <Input.Password placeholder="Пароль" />
            </Form.Item>
          )}

          <Form.Item<UserFormValues>
            label="Ім'я"
            name="first_name"
            rules={[{ required: true, message: "Вкажіть ім'я" }]}
          >
            <Input placeholder="Ім'я" />
          </Form.Item>

          <Form.Item<UserFormValues>
            label="Прізвище"
            name="last_name"
            rules={[{ required: true, message: "Вкажіть прізвище" }]}
          >
            <Input placeholder="Прізвище" />
          </Form.Item>

          <Form.Item<UserFormValues>
            label="Телефон"
            name="phone"
            rules={[{ required: true, message: "Вкажіть телефон" }]}
          >
            <Input placeholder="+380..." />
          </Form.Item>

          <Form.Item<UserFormValues>
            label="Аватар"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Обрати файл</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersCrudPage;

