import React from "react";
import { Card, Input, Select, Button } from "antd";

const MenuFilter = ({
  filterValues,
  setFilterValues,
  categories,
  onFilter,
  onClearFilter,
}) => {
  return (
    <Card className="mb-6">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {/* Total Cooking Time Filter */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Total Cooking Time (minutes)
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <Input
              type="number"
              placeholder="Min"
              value={filterValues.totalCookingTimeMin}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  totalCookingTimeMin: e.target.value,
                })
              }
              min={0}
              style={{ width: "100%" }}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filterValues.totalCookingTimeMax}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  totalCookingTimeMax: e.target.value,
                })
              }
              min={0}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Difficulty Level
          </label>
          <Select
            value={filterValues.difficulty}
            onChange={(value) =>
              setFilterValues({
                ...filterValues,
                difficulty: value,
              })
            }
            placeholder="Select difficulty"
            style={{ width: "100%" }}
          >
            <Select.Option value="">All</Select.Option>
            <Select.Option value="easy">Easy</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="hard">Hard</Select.Option>
          </Select>
        </div>

        {/* Serving Size Filter */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Serving Size
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <Input
              type="number"
              placeholder="Min servings"
              value={filterValues.servingSizeMin}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  servingSizeMin: e.target.value,
                })
              }
              min={1}
              style={{ width: "100%" }}
            />
            <Input
              type="number"
              placeholder="Max servings"
              value={filterValues.servingSizeMax}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  servingSizeMax: e.target.value,
                })
              }
              min={1}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Category
          </label>
          <Select
            value={filterValues.categoryId}
            onChange={(value) =>
              setFilterValues({
                ...filterValues,
                categoryId: value,
              })
            }
            placeholder="Select category"
            style={{ width: "100%" }}
          >
            <Select.Option value="">All Categories</Select.Option>
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Calories Filter */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Calories
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <Input
              type="number"
              placeholder="Min calories"
              value={filterValues.caloriesMin}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  caloriesMin: e.target.value,
                })
              }
              min={0}
              style={{ width: "100%" }}
            />
            <Input
              type="number"
              placeholder="Max calories"
              value={filterValues.caloriesMax}
              onChange={(e) =>
                setFilterValues({
                  ...filterValues,
                  caloriesMax: e.target.value,
                })
              }
              min={0}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <Button type="primary" onClick={onFilter} style={{ width: "100%" }}>
            Apply Filters
          </Button>
          <Button onClick={onClearFilter} style={{ width: "100%" }}>
            Clear Filters
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MenuFilter;
