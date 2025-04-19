// mock/contractorMockData.js

export const contractorProjects = {
    active: [
      {
        id: 1,
        date: "23/04 15:46",
        description: "Ремонт по хорошим ценам. Быстро, качественно наплавардф Быстро, качественно",
        tags: ["Демонтаж", "Отделка", "Дизайн интерьера", "Отделка", "Демонтаж"],
        image: require("../assets/imgs/proj1.png"),
        comments: 5,
        views: 52,
      },
    ],
    completed: [
      {
        id: 2,
        date: "23/04 15:46",
        description: "Ремонт по хорошим ценам. Быстро, качественно наплавардф Быстро, качественно",
        tags: ["Демонтаж", "Отделка", "Дизайн интерьера", "Отделка", "Демонтаж"],
        image: require("../assets/imgs/proj1.png"),
        comments: 0,
        views: 40,
      },
    ],
  };
  
  export const contractorRequests = [
    {
      id: 3,
      project: {
        description: "Ремонт по хорошим ценам. Быстро, качественно наплавардф Быстро, качественно",
        image: require("../assets/imgs/proj1.png"),
        tags: ["Демонтаж", "Отделка", "Дизайн интерьера", "Отделка", "Демонтаж"],
      },
    },
  ];
  