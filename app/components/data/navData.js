export const navData = [
  {
    label: "Hem",
    href: "/",
  },
  {
    label: "För boende",
    children: [
      { label: "Stadgar & formalia", href: "/for-boende/stadgar" },
      { label: "Nyheter", href: "/for-boende/nyheter" },
      {
        label: "Goda grannar & trivselföreskrifter",
        href: "/for-boende/goda-grannar",
      },
      { label: "Medlemmar", href: "https://www.google.se/", external: true },
      { label: "Hyresgäster", href: "https://www.google.se/", external: true },
      { label: "Energideklaration", href: "/for-boende/energideklaration" },
    ],
  },
  {
    label: "Kontakt",
    children: [
      { label: "Felanmälan", href: "/kontakt/felanmalan" },
      { label: "Styrelsen", href: "/kontakt/styrelsen" },
    ],
  },
  {
    label: "Föreningsinformation",
    children: [
      { label: "Tvättstuga", href: "/foreningsinformation/tvattstuga" },
    ],
  },
  {
    label: "Miljö & avfall",
    children: [
      { label: "Sörab", href: "/miljo/sorab" },
      { label: "Mobilåtervinning", href: "/miljo/mobilatervinning" },
    ],
  },
];
