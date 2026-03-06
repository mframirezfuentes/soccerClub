import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FindByIdTeamUseCase } from '../../../../src/application/use-cases/Team/FindByIdTeamUseCase';
import { Team } from '../../../../src/domain/entities/Team';
import { ITeamRepository } from '../../../../src/domain/repositories/ITeamRepository';

describe('FindByIdTeamUseCase', () => {
  let mockFindById: ReturnType<typeof vi.fn<(id: string) => Promise<Team | null>>>;
  let repository: ITeamRepository;
  let useCase: FindByIdTeamUseCase;

  const team = new Team('abc-123', 'Real Madrid', 'Madrid', 'Spain', 'Santiago Bernabéu');

  beforeEach(() => {
    mockFindById = vi.fn<(id: string) => Promise<Team | null>>();

    repository = {
      findAll: vi.fn(),
      findById: mockFindById,
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new FindByIdTeamUseCase(repository);
  });

  it('should return the team when found', async () => {
    mockFindById.mockResolvedValue(team);

    const result = await useCase.execute('abc-123');

    expect(mockFindById).toHaveBeenCalledWith('abc-123');
    expect(result).toBe(team);
  });

  it('should return null when the team does not exist', async () => {
    mockFindById.mockResolvedValue(null);

    const result = await useCase.execute('non-existent-id');

    expect(result).toBeNull();
  });

  it('should propagate errors from the repository', async () => {
    mockFindById.mockRejectedValue(new Error('Connection timeout'));

    await expect(useCase.execute('abc-123')).rejects.toThrow('Connection timeout');
  });
});
