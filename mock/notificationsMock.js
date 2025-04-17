// mock/notificationsMock.js

export const notifications = [
    {
      id: 1,
      type: "chat",
      title: "Новый ответ в чате!",
      text: "Это да, нужно будет в уже созданном курсе возможность добавлять студентов...",
      time: "23/04 15:46",
      avatar: require("../assets/imgs/user1.png"),
    },
    {
      id: 2,
      type: "info",
      title: "Материалы подобраны!",
      text: "Мы нашли подходящие стройматериалы по вашему запросу.",
      time: "23/04 15:46",
      icon: "checkmark-circle-outline",
    },
    {
      id: 3,
      type: "info",
      title: "Почти готово!",
      text: "Осталось утвердить выбор сантехники.",
      time: "23/04 15:46",
      icon: "construct-outline",
    },
    {
        id: 4,
        type: "request",
        team: {
          name: "Constuction B&R",
          logo: require("../assets/imgs/teamlogo1.png"),
          project: "Ремонт двухкомнатной квартиры площадью 65 м² с полной заменой отделки и коммуникаций.",
          projectImage: require("../assets/imgs/proj1.png"),
        },
      }
      
  ];
  