const config_categories = [
  { name: "system" },
  { name: "accounts" },
  { name: "security" },
  { name: "social" },
  { name: "project" },
];

const config = [
  {
    key: "maintenance_mode",
    value: "false",
    data_type: "boolean",
    description: "Manage app status",
    categoryId: 1
  },
  {
    key: "register_status",
    value: "true",
    data_type: "boolean",
    description: "Manage accounts register status",
    categoryId: 2
  },
  {
    key: "project_name",
    value: "Backend template",
    data_type: "string",
    description: "Name of project",
    categoryId: 5
  },
  {
    key: "project_logo",
    value: "/logo.png",
    data_type: "string",
    description: "Logo of project",
    categoryId: 5
  },
  {
    key: "project_icon",
    value: "/icon.png",
    data_type: "string",
    description: "Icon of project",
    categoryId: 5
  },
];

module.exports = { config_categories, config }