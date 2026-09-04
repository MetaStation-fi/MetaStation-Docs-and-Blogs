import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/metastation-webhook-api",
    },
    {
      type: "category",
      label: "Webhook",
      items: [
        {
          type: "doc",
          id: "api/execute-webhook",
          label: "Execute a trade signal",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
