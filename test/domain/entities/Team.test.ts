import { describe, it, expect } from 'vitest';
import { Team } from '../../../src/domain/entities/Team';

describe('Team Entity', () => {
  const id = 'abc-123';
  const name = 'Real Madrid';
  const city = 'Madrid';
  const country = 'Spain';
  const stadium = 'Santiago Bernabéu';

  const team = new Team(id, name, city, country, stadium);

  it('should store and return the id', () => {
    expect(team.getId()).toBe(id);
  });

  it('should store and return the name', () => {
    expect(team.getName()).toBe(name);
  });

  it('should store and return the city', () => {
    expect(team.getCity()).toBe(city);
  });

  it('should store and return the country', () => {
    expect(team.getCountry()).toBe(country);
  });

  it('should store and return the stadium', () => {
    expect(team.getStadium()).toBe(stadium);
  });

  it('should create two independent instances', () => {
    const teamA = new Team('1', 'FC Barcelona', 'Barcelona', 'Spain', 'Camp Nou');
    const teamB = new Team('2', 'Atletico Madrid', 'Madrid', 'Spain', 'Wanda Metropolitano');

    expect(teamA.getId()).not.toBe(teamB.getId());
    expect(teamA.getName()).not.toBe(teamB.getName());
    expect(teamA.getStadium()).not.toBe(teamB.getStadium());
  });
});
