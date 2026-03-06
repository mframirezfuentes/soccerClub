import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UpdateTeamUseCase } from '../../../../src/application/use-cases/Team/UpdateUseCases';
import { Team } from '../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../src/domain/repositories/ITeamRepository';

describe('UpdateTeamUseCase', () => {
  let mockFindById: ReturnType<typeof vi.fn<(id: string) => Promise<Team | null>>>;
  let mockUpdate: ReturnType<typeof vi.fn<(id: string, data: Partial<Team>) => Promise<Team>>>;
  let repository: ITeamRepository;
  let useCase: UpdateTeamUseCase;

  const existingTeam = new Team('team-1', 'Real Madrid', 'Madrid', 'Spain', 'Santiago Bernabéu');
  const updatedTeam = new Team('team-1', 'Real Madrid CF', 'Madrid', 'Spain', 'Santiago Bernabéu');

  beforeEach(() => {
    mockFindById = vi.fn<(id: string) => Promise<Team | null>>();
    mockUpdate = vi.fn<(id: string, data: Partial<Team>) => Promise<Team>>();

    repository = {
      findAll: vi.fn(),
      findById: mockFindById,
      create: vi.fn(),
      update: mockUpdate,
      delete: vi.fn(),
    };

    useCase = new UpdateTeamUseCase(repository);
  });

  it('should return null when the team does not exist', async () => {
    mockFindById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent', {} as Partial<Team>);

    expect(result).toBeNull();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should call findById before updating', async () => {
    mockFindById.mockResolvedValue(existingTeam);
    mockUpdate.mockResolvedValue(updatedTeam);

    await useCase.execute('team-1', {} as Partial<Team>);

    expect(mockFindById).toHaveBeenCalledWith('team-1');
  });

  it('should call repository.update and return the updated team', async () => {
    mockFindById.mockResolvedValue(existingTeam);
    mockUpdate.mockResolvedValue(updatedTeam);

    const result = await useCase.execute('team-1', {} as Partial<Team>);

    expect(mockUpdate).toHaveBeenCalledOnce();
    expect(result).toBe(updatedTeam);
  });

  it('should propagate errors from findById', async () => {
    mockFindById.mockRejectedValue(new Error('DB error on findById'));

    await expect(useCase.execute('team-1', {} as Partial<Team>)).rejects.toThrow('DB error on findById');
  });

  it('should propagate errors from update', async () => {
    mockFindById.mockResolvedValue(existingTeam);
    mockUpdate.mockRejectedValue(new Error('DB error on update'));

    await expect(useCase.execute('team-1', {} as Partial<Team>)).rejects.toThrow('DB error on update');
  });
});
