export class Player {
    constructor(
        private id: string,
        private name: string,
        private age: number,
        private position: string,
        private teamId: string,
        private country: string,
    ) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.position = position;
        this.teamId = teamId;
        this.country = country;
    }
    getId(): string {
        return this.id;
    }
    getName(): string {
        return this.name;
    }
    getAge(): number {
        return this.age;
    }
    getPosition(): string {
        return this.position;
    }
    getTeamId(): string {
        return this.teamId;
    }
    getCountry(): string {
        return this.country;
    }

}