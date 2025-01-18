import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Space,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const MenuForm = ({ visible, onCancel, onSuccess, initialValues }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    // Fetch categories and ingredients for dropdowns
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(categoriesResponse.data.data);

        const ingredientsResponse = await axios.get(
          "http://localhost:5000/api/ingredients"
        );
        setIngredients(ingredientsResponse.data.data);
      } catch (error) {
        message.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Transform initialValues for form if they exist
    if (initialValues) {
      const transformedValues = {
        ...initialValues,
        cookingTimePrep: initialValues.cookingTime?.prep,
        cookingTimeCook: initialValues.cookingTime?.cook,
      };
      form.setFieldsValue(transformedValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      let imageUrl = values.image;
      
      // Kiểm tra xem có file mới được upload không
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const formData = new FormData();
        formData.append("image", fileList[0].originFileObj);

        // Upload ảnh
        const uploadResponse = await axios.post(
          "http://localhost:5000/api/menus/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadResponse.data.success) {
          imageUrl = uploadResponse.data.filePath;
        } else {
          throw new Error("Failed to upload image");
        }
      } else if (!initialValues?.image) {
        // Nếu không có ảnh mới và không phải là edit mode
        message.error("Please upload an image!");
        setLoading(false);
        return;
      }

      // Chuẩn bị dữ liệu để gửi
      const menuData = {
        ...values,
        image: imageUrl,
        cookingTime: {
          prep: values.cookingTimePrep,
          cook: values.cookingTimeCook
        }
      };

      // Gửi dữ liệu menu
      if (initialValues && initialValues._id) {
        await axios.put(
          `http://localhost:5000/api/menus/${initialValues._id}`,
          menuData
        );
        message.success("Menu updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/menus", menuData);
        message.success("Menu added successfully");
      }

      setFileList([]);
      form.resetFields();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Modal
      title={initialValues ? "Edit Menu" : "Add New Menu"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        {/* Name */}
        <Form.Item
          name="name"
          label="Menu Name"
          rules={[{ required: true, message: "Please input the menu name!" }]}
        >
          <Input />
        </Form.Item>

        {/* Ingredients */}
        <Form.List name="ingredients">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }}>
                  {/* Ingredient Dropdown */}
                  <Form.Item
                    {...restField}
                    name={[name, "ingredient"]}
                    label="Ingredient"
                    rules={[
                      { required: true, message: "Please select an ingredient!" },
                    ]}
                  >
                    <Select placeholder="Select an ingredient">
                      {ingredients.map((ing) => (
                        <Option key={ing._id} value={ing._id}>
                          {ing.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Weight */}
                  <Form.Item
                    {...restField}
                    name={[name, "weight"]}
                    label="Weight"
                    rules={[
                      { required: true, message: "Please input the weight!" },
                    ]}
                  >
                    <InputNumber min={0} />
                  </Form.Item>

                  {/* Unit */}
                  <Form.Item
                    {...restField}
                    name={[name, "unit"]}
                    label="Unit"
                    rules={[
                      { required: true, message: "Please input the unit!" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  {/* Remove Button */}
                  <Button type="link" onClick={() => remove(name)}>
                    Remove
                  </Button>
                </Space>
              ))}
              {/* Add Button */}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Ingredient
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Description */}
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>

        {/* Cooking Time */}
        <Form.Item
          name="cookingTimePrep"
          label="Preparation Time"
          rules={[{ required: true, message: "Please input preparation time!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          name="cookingTimeCook"
          label="Cooking Time"
          rules={[{ required: true, message: "Please input cooking time!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        {/* Difficulty */}
        <Form.Item
          name="difficulty"
          label="Difficulty"
          rules={[{ required: true, message: "Please select difficulty!" }]}
        >
          <Select>
            <Option value="easy">Easy</Option>
            <Option value="medium">Medium</Option>
            <Option value="hard">Hard</Option>
          </Select>
        </Form.Item>

        {/* Serving Size */}
        <Form.Item
          name="servingSize"
          label="Serving Size"
          rules={[{ required: true, message: "Please input serving size!" }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        {/* Default Status */}
        <Form.Item
          name="defaultStatus"
          label="Default Status"
          rules={[{ required: true, message: "Please select default status!" }]}
        >
          <Select>
            <Option value="lock">Lock</Option>
            <Option value="unlock">Unlock</Option>
          </Select>
        </Form.Item>

        {/* Category */}
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select>
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Tags */}
        <Form.Item name="tags" label="Tags">
          <Select mode="tags" placeholder="Add tags" />
        </Form.Item>

        <Form.Item name="image" label="Image">
          <Upload
            beforeUpload={() => false}
            onChange={handleFileChange}
            fileList={fileList}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        {/* Calories */}
        <Form.Item
          name="calories"
          label="Calories"
          rules={[{ required: true, message: "Please input calories!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        {/* Nutritional Info */}
        <Form.Item label="Nutritional Info">
          <Space>
            <Form.Item name={["nutritionalInfo", "protein"]} label="Protein">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name={["nutritionalInfo", "carbs"]} label="Carbs">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name={["nutritionalInfo", "fat"]} label="Fat">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item name={["nutritionalInfo", "fiber"]} label="Fiber">
              <InputNumber min={0} />
            </Form.Item>
          </Space>
        </Form.Item>

        {/* Unlock Price */}
        <Form.Item
          name="unlockPrice"
          label="Unlock Price"
          rules={[{ required: true, message: "Please input unlock price!" }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        {/* Average Rating */}
        <Form.Item
          name="averageRating"
          label="Average Rating"
          rules={[{ required: true, message: "Please input average rating!" }]}
        >
          <InputNumber min={0} max={5} />
        </Form.Item>

        {/* Is Active */}
        <Form.Item name="isActive" label="Is Active">
          <Select>
            <Option value={true}>Yes</Option>
            <Option value={false}>No</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuForm;