import {
  cilSpeedometer,
  cilFolder,
  cilDescription,
  cilPeople,
  cilUser,
  cilBriefcase,
  cilEnvelopeOpen,
  cilGroup,
  cilLanguage,
  cilCreditCard,
  cilTags,
  cilGlobeAlt
} from '@coreui/icons';

export const sidebarConfig = [
  {
    type: "item",
    path: "/dashboard",
    label: "Dashboard",
    icon: cilSpeedometer,
    roles: ["Client", "Admin", "Translator"]
  },

  {
    type: "title",
    label: "MAIN MENU",
    roles: ["Client", "Admin", "Translator"]
  },

  {
    type: "title",
    label: "CLIENT",
    roles: ["Client"]
  },
  {
    type: "item",
    path: "/my-projects",
    label: "My Projects",
    icon: cilFolder,
    roles: ["Client"]
  },
  {
    type: "item",
    path: "/post-project",
    label: "Post a Project",
    icon: cilDescription,
    roles: ["Client"]
  },
  {
    type: "item",
    path: "/translators",
    label: "Find Translators",
    icon: cilPeople,
    roles: ["Client"]
  },

  {
    type: "title",
    label: "TRANSLATOR",
    roles: ["Translator"]
  },
  {
    type: "item",
    path: "/translator/projects",
    label: "My Projects",
    icon: cilFolder,
    roles: ["Translator"]
  },
  {
    type: "item",
    path: "/available-projects",
    label: "Available Projects",
    icon: cilBriefcase,
    roles: ["Translator"]
  },
  {
    type: "item",
    path: "/invitations",
    label: "Invitations",
    icon: cilEnvelopeOpen,
    roles: ["Translator"]
  },

  {
    type: "title",
    label: "ADMIN",
    roles: ["Admin"]
  },
  {
    type: "item",
    path: "/admin/users",
    label: "Users",
    icon: cilGroup,
    roles: ["Admin"]
  },
  {
    type: "item",
    path: "/admin/translators",
    label: "Translators",
    icon: cilLanguage,
    roles: ["Admin"]
  },
  {
    type: "item",
    path: "/admin/projects",
    label: "Projects",
    icon: cilFolder,
    roles: ["Admin"]
  },
  {
    type: "item",
    path: "/admin/payments",
    label: "Payments",
    icon: cilCreditCard,
    roles: ["Admin"]
  },

  {
    type: "title",
    label: "MASTER DATA",
    roles: ["Admin"]
  },
  {
    type: "item",
    path: "/admin/languages",
    label: "Languages",
    icon: cilGlobeAlt,
    roles: ["Admin"]
  },
  {
    type: "item",
    path: "/admin/specializations",
    label: "Specializations",
    icon: cilTags,
    roles: ["Admin"]
  },

  {
    type: "title",
    label: "ACCOUNT",
    roles: ["Client", "Translator", "Admin"]
  },
  {
    type: "item",
    path: "/profile",
    label: "Profile",
    icon: cilUser,
    roles: ["Client"]
  },
  {
    type: "item",
    path: "/my-profile",
    label: "Profile",
    icon: cilUser,
    roles: ["Translator"]
  },
  {
    type: "item",
    path: "/admin/profile",
    label: "Profile",
    icon: cilUser,
    roles: ["Admin"]
  }
];