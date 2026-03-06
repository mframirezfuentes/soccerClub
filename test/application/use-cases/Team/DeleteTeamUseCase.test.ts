import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTeamUseCase } from '../../../../src/application/use-cases/Team/DeleteTeamUseCase';
import { ITeamRepository } from '../../../../src/domain/repositories/ITeamRepository';

describe('DeleteTeamUseCase', () => {
  let mockDelete: ReturnType<typeof vi.fn<(id: string) => Promise<void>>>;
  let repository: ITeamRepository;
  let useCase: DeleteTeamUseCase;

  beforeEach(() => {
    mockDelete = vi.fn<(id: string) => Promise<void>>();

    repository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: mockDelete,
    };

    useCase = new DeleteTeamUseCase(repository);
  });

  it('should call repository.delete with the given id', async () => {
    mockDelete.mockResolvedValue(undefined);

    await useCase.execute('team-id-1');

    expect(mockDelete).toHaveBeenCalledOnce();
    expect(mockDelete).toHaveBeenCalledWith('team-id-1');
  });

  it('should resolve without returning a value', async () => {
    mockDelete.mockResolvedValue(undefined);

    const result = await useCase.execute('team-id-1');

    expect(result).toBeUndefined();
  });

  it('should propagate errors from the repository', async () => {
    mockDelete.mockRejectedValue(new Error('Delete failed'));

    await expect(useCase.execute('team-id-1')).rejects.toThrow('Delete failed');
  });
});
