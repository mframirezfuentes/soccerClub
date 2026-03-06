import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { PlayerController } from '../../../../src/infrastructure/http/controllers/PlayerController';
import { Player } from '../../../../src/domain/entities/Player';
import { ListOfPlayerUserCase } from '../../../../src/application/use-cases/Player';

function buildMockRes() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;
  (res.status as ReturnType<typeof vi.fn>).mockReturnValue(res);
  return res;
}

describe('PlayerController', () => {
  let mockListExecute: ReturnType<typeof vi.fn>;
  let listUseCase: ListOfPlayerUserCase;
  let controller: PlayerController;

  const playerA = new Player('p1', 'Messi', 37, 'Forward', 'team-1', 'Argentina');
  const playerB = new Player('p2', 'Mbappé', 25, 'Forward', 'team-2', 'France');

  beforeEach(() => {
    mockListExecute = vi.fn();
    listUseCase = { execute: mockListExecute } as unknown as ListOfPlayerUserCase;
    controller = new PlayerController(listUseCase);
  });

  // ─── findAll ──────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return 200 with the list of players', async () => {
      mockListExecute.mockResolvedValue([playerA, playerB]);
      const req = { query: {} } as unknown as Request;
      const res = buildMockRes();

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([playerA, playerB]);
    });

    it('should forward all query filters to the use case', async () => {
      mockListExecute.mockResolvedValue([playerB]);
      const req = {
        query: { name: 'Mbappé', age: '25', position: 'Forward', country: 'France', teamId: 'team-2' },
      } as unknown as Request;
      const res = buildMockRes();

      await controller.findAll(req, res);

      expect(mockListExecute).toHaveBeenCalledWith({
        name: 'Mbappé',
        age: 25,
        position: 'Forward',
        country: 'France',
        teamId: 'team-2',
      });
    });

    it('should parse age as integer', async () => {
      mockListExecute.mockResolvedValue([]);
      const req = { query: { age: '30' } } as unknown as Request;
      const res = buildMockRes();

      await controller.findAll(req, res);

      const calledFilters = mockListExecute.mock.calls[0][0];
      expect(typeof calledFilters.age).toBe('number');
      expect(calledFilters.age).toBe(30);
    });

    it('should leave age as undefined when not provided', async () => {
      mockListExecute.mockResolvedValue([]);
      const req = { query: {} } as unknown as Request;
      const res = buildMockRes();

      await controller.findAll(req, res);

      const calledFilters = mockListExecute.mock.calls[0][0];
      expect(calledFilters.age).toBeUndefined();
    });

    it('should return 500 when the use case throws', async () => {
      mockListExecute.mockRejectedValue(new Error('Player query error'));
      const req = { query: {} } as unknown as Request;
      const res = buildMockRes();

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
