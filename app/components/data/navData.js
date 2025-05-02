export const navData = [
    {
        label: "Hem",
        href: "/",
    },
    {
        label: "För boende",
        children : [
            { label: "Stadgar & formalia", href: "/stadgar" },
            { label: "Goda grannar & trivselföreskrifter", href: "/goda-grannar" },
            { label: "Medlemmar", href: "google.se", external: true },
            { label: "Hyresgäster", href: "google.se", external: true },
            { label: "Energideklaration", href: "/energideklaration" },
        ],
    },
    {
        label: "Kontakt",
        children : [
            { label: "Felanmälan", href: "/felanmalan" },
            { label: "Styrelsen", href: "/styrelsen" },
        ],
    },
    {
        label: "Föreningsinformation",
        children : [
            { label: "Tvättstuga", href: "/tvattstuga" },
        ],
    },
    {
        label: "Miljö & avfall",
        children : [
            { label: "Sörab", href: "/sorab" },
            { label: "Mobilåtervinning", href: "/mobilatervinning" },
        ],
    },
]