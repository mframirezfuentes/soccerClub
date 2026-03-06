import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListTeamsUseCase } from '../../../../src/application/use-cases/Team/ListTeamUseCase';
import { Team } from '../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../src/domain/repositories/ITeamRepository';
import { IFilterTeam } from '../../../../src/domain/repositories/IFiltersTeam';

describe('ListTeamsUseCase', () => {
  let mockFindAll: ReturnType<typeof vi.fn<(filters?: IFilterTeam) => Promise<Team[]>>>;
  let repository: ITeamRepository;
  let useCase: ListTeamsUseCase;

  const teamA = new Team('1', 'Real Madrid', 'Madrid', 'Spain', 'Santiago Bernabéu');
  const teamB = new Team('2', 'FC Barcelona', 'Barcelona', 'Spain', 'Camp Nou');

  beforeEach(() => {
    mockFindAll = vi.fn<(filters?: IFilterTeam) => Promise<Team[]>>();

    repository = {
      findAll: mockFindAll,
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new ListTeamsUseCase(repository);
  });

  it('should return all teams when no filters are provided', async () => {
    mockFindAll.mockResolvedValue([teamA, teamB]);

    const result = await useCase.execute({});

    expect(result).toEqual([teamA, teamB]);
    expect(result).toHaveLength(2);
  });

  it('should forward filters to repository.findAll', async () => {
    const filters: IFilterTeam = { country: 'Spain', city: 'Madrid' };
    mockFindAll.mockResolvedValue([teamA]);

    const result = await useCase.execute(filters);

    expect(mockFindAll).toHaveBeenCalledWith(filters);
    expect(result).toEqual([teamA]);
  });

  it('should return an empty array when no teams match', async () => {
    mockFindAll.mockResolvedValue([]);

    const result = await useCase.execute({ country: 'Brazil' });

    expect(result).toEqual([]);
  });

  it('should propagate errors from the repository', async () => {
    mockFindAll.mockRejectedValue(new Error('Query failed'));

    await expect(useCase.execute({})).rejects.toThrow('Query failed');
  });
});
