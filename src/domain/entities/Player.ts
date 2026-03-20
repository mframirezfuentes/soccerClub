export class Player {
    constructor(
        private id: string,
        private name: string,
        private age: number,
        private position: string,
        private country: string,
        private teamIds: string[] = [],
    ) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.position = position;
        this.country = country;
        this.teamIds = teamIds;
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
    getCountry(): string {
        return this.country;
    }
    getTeamIds(): string[] {
        return this.teamIds;
    }
}