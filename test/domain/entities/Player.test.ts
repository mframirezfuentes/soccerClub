import { describe, it, expect } from 'vitest';
import { Player } from '../../../src/domain/entities/Player';

describe('Player Entity', () => {
  const id = 'player-1';
  const name = 'Cristiano Ronaldo';
  const age = 39;
  const position = 'Forward';
  const teamId = 'team-abc';
  const country = 'Portugal';

  const player = new Player(id, name, age, position, teamId, country);

  it('should store and return the id', () => {
    expect(player.getId()).toBe(id);
  });

  it('should store and return the name', () => {
    expect(player.getName()).toBe(name);
  });

  it('should store and return the age as a number', () => {
    expect(player.getAge()).toBe(age);
    expect(typeof player.getAge()).toBe('number');
  });

  it('should store and return the position', () => {
    expect(player.getPosition()).toBe(position);
  });

  it('should store and return the teamId', () => {
    expect(player.getTeamId()).toBe(teamId);
  });

  it('should store and return the country', () => {
    expect(player.getCountry()).toBe(country);
  });

  it('should create two independent instances', () => {
    const playerA = new Player('p1', 'Messi', 37, 'Forward', 'team-1', 'Argentina');
    const playerB = new Player('p2', 'Mbappé', 25, 'Forward', 'team-2', 'France');

    expect(playerA.getId()).not.toBe(playerB.getId());
    expect(playerA.getName()).not.toBe(playerB.getName());
    expect(playerA.getCountry()).not.toBe(playerB.getCountry());
  });
});
