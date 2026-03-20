interface IPlayerData {
    name: string;
    age: number;
    position: string;
    teamName: string;
    country: string;
    from: number;
}

// Crear un nuevo jugador
export const playersData: IPlayerData[] = [
    //Arsenal
    { name: "Leah Williamson", age: 27, position: "Defender", teamName: "Arsenal Women's", country: "England", from: 2014 },
    { name: "Kim Little", age: 34, position: "Midfielder", teamName: "Arsenal Women's", country: "Scotland", from: 2017 },
    { name: "Alessia Russo", age: 25, position: "Forward", teamName: "Arsenal Women's", country: "England", from: 2023 },
    { name: "Emily Fox", age: 26, position: "Defender", teamName: "Arsenal Women's", country: "USA", from: 2023 },
    { name: "Chloe Kelly", age: 27, position: "Forward", teamName: "Arsenal Women's", country: "England", from: 2025 },
    { name: "Vivianne Miedema", age: 28, position: "Forward", teamName: "Arsenal Women's", country: "Netherlands", from: 2017 },

    // Chelsea
    { name: "Millie Bright", age: 31, position: "Defender", teamName: "Chelsea Women's", country: "England", from: 2015 },
    { name: "Lucy Bronze", age: 33, position: "Defender", teamName: "Chelsea Women's", country: "England", from: 2023 },
    { name: "Niamh Charles", age: 25, position: "Midfielder", teamName: "Chelsea Women's", country: "England", from: 2020 },
    { name: "Kadidiatou Diani", age: 28, position: "Forward", teamName: "Chelsea Women's", country: "France", from: 2024 },

    // Manchester City
    { name: "Vivianne Miedema", age: 28, position: "Forward", teamName: "Manchester City", country: "Netherlands", from: 2024 },
    { name: "Khadija Shaw", age: 28, position: "Forward", teamName: "Manchester City", country: "Jamaica", from: 2021 },
    { name: "Lauren Hemp", age: 24, position: "Forward", teamName: "Manchester City", country: "England", from: 2018 },
    { name: "Alex Greenwood", age: 31, position: "Defender", teamName: "Manchester City", country: "England", from: 2019 },

    // Manchester United
    { name: "Ella Toone", age: 25, position: "Midfielder", teamName: "Manchester United", country: "England", from: 2018 },
    { name: "Lucy Staniforth", age: 32, position: "Midfielder", teamName: "Manchester United", country: "England", from: 2022 },

    // Liverpool
    { name: "Rachel Furness", age: 34, position: "Midfielder", teamName: "Liverpool", country: "Northern Ireland", from: 2019 },
    { name: "Shanice van de Sanden", age: 30, position: "Forward", teamName: "Liverpool", country: "Netherlands", from: 2022 },

    // Barcelona
    { name: "Alexia Putellas", age: 31, position: "Midfielder", teamName: "Barcelona", country: "Spain", from: 2012 },
    { name: "Aitana Bonmatí", age: 26, position: "Midfielder", teamName: "Barcelona", country: "Spain", from: 2016 },
    { name: "Caroline Graham Hansen", age: 30, position: "Forward", teamName: "Barcelona", country: "Norway", from: 2019 },
    { name: "Irene Paredes", age: 33, position: "Defender", teamName: "Barcelona", country: "Spain", from: 2022 },

    // Real Madrid
    { name: "Marta Corredera", age: 34, position: "Midfielder", teamName: "Real Madrid", country: "Spain", from: 2020 },
    { name: "Sofia Jakobsson", age: 33, position: "Forward", teamName: "Real Madrid", country: "Sweden", from: 2021 },

    // Juventus
    { name: "Cristiana Girelli", age: 34, position: "Forward", teamName: "Juventus", country: "Italy", from: 2018 },
    { name: "Barbara Bonansea", age: 30, position: "Forward", teamName: "Juventus", country: "Italy", from: 2017 },
    { name: "Sara Gama", age: 36, position: "Defender", teamName: "Juventus", country: "Italy", from: 2014 },

    // AC Milan
    { name: "Giorgia Spinelli", age: 27, position: "Midfielder", teamName: "AC Milan", country: "Italy", from: 2021 },
    { name: "Valentina Giacinti", age: 29, position: "Forward", teamName: "Fiorentina", country: "Italy", from: 2023 },

    // Lyon
    { name: "Ada Hegerberg", age: 29, position: "Forward", teamName: "Lyon", country: "Norway", from: 2014 },
    { name: "Wendie Renard", age: 34, position: "Defender", teamName: "Lyon", country: "France", from: 2006 },
    { name: "Amel Majri", age: 31, position: "Midfielder", teamName: "Lyon", country: "France", from: 2014 },
    { name: "Dzenifer Marozsán", age: 32, position: "Midfielder", teamName: "Lyon", country: "Germany", from: 2016 },

    // PSG
    { name: "Saki Kumagai", age: 34, position: "Midfielder", teamName: "Paris Saint-Germain", country: "Japan", from: 2021 },

    //Bayer Munich
    { name: "Lena Oberdorf", age: 23, position: "Midfielder", teamName: "Bayern Munich", country: "Germany", from: 2024 },

    // London City
    { name: "Nikita Parris", age: 30, position: "Forward", teamName: "Everton", country: "England", from: 2023 },
];