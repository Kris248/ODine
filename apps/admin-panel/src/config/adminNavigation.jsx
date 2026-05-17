export const ADMIN_NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      {
        to: "/",
        label: "Overview",
        description: "Live command center for today’s revenue, floor, and service pulse.",
        icon: "overview",
        end: true,
        badge: "Live"
      },
      {
        to: "/orders",
        label: "Orders",
        description: "Manage live tickets, routing, and fulfillment status.",
        icon: "orders",
        badge: "Now"
      },
      {
        to: "/kitchen",
        label: "Kitchen",
        description: "Monitor prep queues and kitchen execution in real time.",
        icon: "kitchen",
        badge: "KDS"
      },
      {
        to: "/tables",
        label: "Tables",
        description: "Track floor occupancy, QR routing, and table readiness.",
        icon: "tables"
      }
    ]
  },
  {
    label: "Management",
    items: [
      {
        to: "/menu",
        label: "Menu",
        description: "Publish categories, items, prices, and availability rules.",
        icon: "menu"
      },
      {
        to: "/staff",
        label: "Staff",
        description: "Control access, roles, and outlet permissions.",
        icon: "staff"
      },
      {
        to: "/customers",
        label: "Customers",
        description: "View guests, repeat visits, and contact capture.",
        icon: "customers",
        badge: "CRM"
      }
    ]
  },
  {
    label: "Insights",
    items: [
      {
        to: "/analytics",
        label: "Analytics",
        description: "Revenue, utilization, and operational intelligence.",
        icon: "analytics",
        badge: "Data"
      },
      {
        to: "/settings",
        label: "Settings",
        description: "Branding, taxes, currency, and outlet-level rules.",
        icon: "settings"
      }
    ]
  }
];
