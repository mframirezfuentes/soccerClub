export class Team {
    private readonly id: string;
    private readonly name: string;
    private readonly city: string;
    private readonly country: string;
    private readonly stadium: string;

    constructor(id: string, name: string, city: string, country: string, stadium: string) {
        this.id = id;
        this.name = name;
        this.city = city;
        this.country = country;
        this.stadium = stadium;
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getCity(): string {
        return this.city;
    }

    getCountry(): string {
        return this.country;
    }

    getStadium(): string {
        return this.stadium;
    }

}