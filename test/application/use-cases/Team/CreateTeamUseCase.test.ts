import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateTeamUseCase } from '../../../../src/application/use-cases/Team/CreateTeamUseCase';
import { Team } from '../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../src/domain/repositories/ITeamRepository';
import { IFilterTeam } from '../../../../src/domain/repositories/IFiltersTeam';

describe('CreateTeamUseCase', () => {
  let mockFindAll: ReturnType<typeof vi.fn<(filters: IFilterTeam) => Promise<Team[]>>>;
  let mockFindById: ReturnType<typeof vi.fn<(id: string) => Promise<Team | null>>>;
  let mockCreate: ReturnType<typeof vi.fn<(data: Team) => Promise<Team>>>;
  let mockUpdate: ReturnType<typeof vi.fn<(id: string, data: Partial<Team>) => Promise<Team | null>>>;
  let mockDelete: ReturnType<typeof vi.fn<(id: string) => Promise<void>>>;
  let repository: ITeamRepository;
  let useCase: CreateTeamUseCase;
  let team: Team;

  beforeEach(() => {
    mockFindAll = vi.fn<(filters: IFilterTeam) => Promise<Team[]>>();
    mockFindById = vi.fn<(id: string) => Promise<Team | null>>();
    mockCreate = vi.fn<(data: Team) => Promise<Team>>();
    mockUpdate = vi.fn<(id: string, data: Partial<Team>) => Promise<Team | null>>();
    mockDelete = vi.fn<(id: string) => Promise<void>>();

    repository = {
      findAll: mockFindAll,
      findById: mockFindById,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    };

    useCase = new CreateTeamUseCase(repository);
    team = new Team('1', 'Real Madrid', 'Madrid', 'Spain', 'Santiago Bernabéu');
  });

  it('should call repository.create with the team', async () => {
    mockCreate.mockResolvedValue(team);

    await useCase.execute(team);

    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockCreate).toHaveBeenCalledWith(team);
  });

  it('should return the created team', async () => {
    mockCreate.mockResolvedValue(team);

    const result = await useCase.execute(team);

    expect(result).toBe(team);
  });

  it('should propagate errors thrown by the repository', async () => {
    mockCreate.mockRejectedValue(new Error('DB connection failed'));

    await expect(useCase.execute(team)).rejects.toThrow('DB connection failed');
  });
});
