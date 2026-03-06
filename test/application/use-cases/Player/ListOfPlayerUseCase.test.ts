import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListOfPlayerUserCase } from '../../../../src/application/use-cases/Player/ListOfPlayerUseCase';
import { Player } from '../../../../src/domain/entities/Player';
import { IPlayerRepository } from '../../../../src/domain/repositories/IPlayerRepository';
import { IFilterPlayer } from '../../../../src/domain/repositories/IFilterPlayer';

describe('ListOfPlayerUserCase', () => {
  let mockFindAll: ReturnType<typeof vi.fn<(filters?: IFilterPlayer) => Promise<Player[]>>>;
  let repository: IPlayerRepository;
  let useCase: ListOfPlayerUserCase;

  const playerA = new Player('p1', 'Messi', 37, 'Forward', 'team-1', 'Argentina');
  const playerB = new Player('p2', 'Mbappé', 25, 'Forward', 'team-2', 'France');

  beforeEach(() => {
    mockFindAll = vi.fn<(filters?: IFilterPlayer) => Promise<Player[]>>();

    repository = {
      save: vi.fn(),
      findAll: mockFindAll,
      update: vi.fn(),
      delete: vi.fn(),
      findByName: vi.fn(),
    };

    useCase = new ListOfPlayerUserCase(repository);
  });

  it('should return all players when no filters are provided', async () => {
    mockFindAll.mockResolvedValue([playerA, playerB]);

    const result = await useCase.execute({});

    expect(result).toEqual([playerA, playerB]);
    expect(result).toHaveLength(2);
  });

  it('should forward filters to repository.findAll', async () => {
    const filters: IFilterPlayer = { position: 'Forward', country: 'France' };
    mockFindAll.mockResolvedValue([playerB]);

    const result = await useCase.execute(filters);

    expect(mockFindAll).toHaveBeenCalledWith(filters);
    expect(result).toEqual([playerB]);
  });

  it('should return an empty array when no players match', async () => {
    mockFindAll.mockResolvedValue([]);

    const result = await useCase.execute({ position: 'Goalkeeper' });

    expect(result).toEqual([]);
  });

  it('should propagate errors from the repository', async () => {
    mockFindAll.mockRejectedValue(new Error('Player query failed'));

    await expect(useCase.execute({})).rejects.toThrow('Player query failed');
  });
});
