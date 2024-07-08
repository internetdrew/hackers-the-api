const apiData = [
  {
    title: "Characters",
    options: [
      {
        method: "GET",
        endpoint: "/api/v1/characters",
        description: "returns a list of characters.",
      },
      {
        method: "GET",
        endpoint: "/api/v1/characters/:id",
        description: "returns information on a particular character.",
      },
      {
        method: "GET",
        endpoint: "api/v1/characters/:id/quotes",
        description: "returns famous lines from particular characters.",
      },
      {
        method: "GET",
        endpoint: "api/v1/characters/:id/hacks",
        description:
          "returns hacks a character contributed to and was targeted by.",
      },
    ],
  },
  {
    title: "Organizations",
    options: [
      {
        method: "GET",
        endpoint: "/api/v1/oranizations",
        description: "returns a list of organizations.",
      },
      {
        method: "GET",
        endpoint: "/api/v1/oranizations/:id",
        description: "returns information on a specific organization.",
      },
    ],
  },
  {
    title: "Hacks",
    options: [
      {
        method: "GET",
        endpoint: "/api/v1/oranizations",
        description: "returns a list of organizations.",
      },
      {
        method: "GET",
        endpoint: "/api/v1/oranizations/:id",
        description: "returns information on a specific organization.",
      },
    ],
  },
  {
    title: "Quotes",
    options: [
      {
        method: "GET",
        endpoint: "/api/v1/oranizations",
        description: "Returns a list of organizations.",
      },
      {
        method: "GET",
        endpoint: "/api/v1/oranizations/:id",
        description: "Returns information on a specific organization.",
      },
    ],
  },
];

export default apiData;
