import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { TeamController } from '../../../../src/infrastructure/http/controllers/TeamController';
import { Team } from '../../../../src/domain/entities/Team';
import { CreateTeamUseCase } from '../../../../src/application/use-cases/Team/CreateTeamUseCase';
import { ListTeamsUseCase } from '../../../../src/application/use-cases/Team/ListTeamUseCase';
import { FindByIdTeamUseCase } from '../../../../src/application/use-cases/Team/FindByIdTeamUseCase';
import { DeleteTeamUseCase } from '../../../../src/application/use-cases/Team/DeleteTeamUseCase';
import { UpdateTeamUseCase } from '../../../../src/application/use-cases/Team/UpdateUseCases';

// Helper to build mock Express req/res
function buildMockRes() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;
  (res.status as ReturnType<typeof vi.fn>).mockReturnValue(res);
  return res;
}

describe('TeamController', () => {
  let mockCreateExecute: ReturnType<typeof vi.fn>;
  let mockListExecute: ReturnType<typeof vi.fn>;
  let mockFindByIdExecute: ReturnType<typeof vi.fn>;
  let mockDeleteExecute: ReturnType<typeof vi.fn>;
  let mockUpdateExecute: ReturnType<typeof vi.fn>;

  let createUseCase: CreateTeamUseCase;
  let listUseCase: ListTeamsUseCase;
  let findByIdUseCase: FindByIdTeamUseCase;
  let deleteUseCase: DeleteTeamUseCase;
  let updateUseCase: UpdateTeamUseCase;
  let controller: TeamController;

  const sampleTeam = new Team('1', 'Real Madrid', 'Madrid', 'Spain', 'Santiago Bernabéu');

  beforeEach(() => {
    mockCreateExecute = vi.fn();
    mockListExecute = vi.fn();
    mockFindByIdExecute = vi.fn();
    mockDeleteExecute = vi.fn();
    mockUpdateExecute = vi.fn();

    createUseCase = { execute: mockCreateExecute } as unknown as CreateTeamUseCase;
    listUseCase = { execute: mockListExecute } as unknown as ListTeamsUseCase;
    findByIdUseCase = { execute: mockFindByIdExecute } as unknown as FindByIdTeamUseCase;
    deleteUseCase = { execute: mockDeleteExecute } as unknown as DeleteTeamUseCase;
    updateUseCase = { execute: mockUpdateExecute } as unknown as UpdateTeamUseCase;

    controller = new TeamController(
      createUseCase,
      listUseCase,
      findByIdUseCase,
      deleteUseCase,
      updateUseCase,
    );
  });

  // ─── findAll ──────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return 200 with the list of teams', async () => {
      mockListExecute.mockResolvedValue([sampleTeam]);
      const req = { query: {} } as unknown as Request;
      const res = buildMockRes();

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([sampleTeam]);
    });

    it('should forward query filters to the use case', async () => {
      mockListExecute.mockResolvedValue([]);
      const req = {
        query: { name: 'Real Madrid', country: 'Spain', city: 'Madrid', stadium: 'Bernabéu' },
      } as unknown as Request;
      const res = buildMockRes();

      await controller.findAll(req, res);

      expect(mockListExecute).toHaveBeenCalledWith({
        name: 'Real Madrid',
        country: 'Spain',
        city: 'Madrid',
        stadium: 'Bernabéu',
      });
    });

    it('should return 500 when the use case throws', async () => {
      mockListExecute.mockRejectedValue(new Error('Unexpected error'));
      const req = { query: {} } as unknown as Request;
      const res = buildMockRes();

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // ─── findById ─────────────────────────────────────────────────────────────
  describe('findById', () => {
    it('should return 200 with the team when found', async () => {
      mockFindByIdExecute.mockResolvedValue(sampleTeam);
      const req = { params: { id: '1' } } as unknown as Request;
      const res = buildMockRes();

      await controller.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(sampleTeam);
    });

    it('should return 400 when the team is not found', async () => {
      mockFindByIdExecute.mockResolvedValue(null);
      const req = { params: { id: 'missing-id' } } as unknown as Request;
      const res = buildMockRes();

      await controller.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Team missing-id not found' });
    });

    it('should return 500 when the use case throws', async () => {
      mockFindByIdExecute.mockRejectedValue(new Error('DB error'));
      const req = { params: { id: '1' } } as unknown as Request;
      const res = buildMockRes();

      await controller.findById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // ─── save ─────────────────────────────────────────────────────────────────
  describe('save', () => {
    it('should return 400 when the team already exists', async () => {
      mockListExecute.mockResolvedValue([sampleTeam]);
      const req = {
        body: { name: 'Real Madrid', city: 'Madrid', country: 'Spain', stadium: 'Bernabéu' },
      } as unknown as Request;
      const res = buildMockRes();

      await controller.save(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Team Real Madrid already exists' });
      expect(mockCreateExecute).not.toHaveBeenCalled();
    });

    it('should return 201 when the team is created successfully', async () => {
      mockListExecute.mockResolvedValue([]);
      mockCreateExecute.mockResolvedValue(sampleTeam);
      const req = {
        body: { name: 'Real Madrid', city: 'Madrid', country: 'Spain', stadium: 'Bernabéu' },
      } as unknown as Request;
      const res = buildMockRes();

      await controller.save(req, res);

      expect(mockCreateExecute).toHaveBeenCalledOnce();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('Real Madrid') }),
      );
    });

    it('should return 500 when the use case throws', async () => {
      mockListExecute.mockRejectedValue(new Error('Query error'));
      const req = {
        body: { name: 'Team X', city: 'City', country: 'Country', stadium: 'Stadium' },
      } as unknown as Request;
      const res = buildMockRes();

      await controller.save(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────
  describe('update', () => {
    it('should return 200 when the team is updated', async () => {
      mockUpdateExecute.mockResolvedValue(sampleTeam);
      const req = { params: { id: '1' }, body: { name: 'New Name' } } as unknown as Request;
      const res = buildMockRes();

      await controller.update(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when the team is not found', async () => {
      mockUpdateExecute.mockResolvedValue(null);
      const req = { params: { id: 'missing' }, body: {} } as unknown as Request;
      const res = buildMockRes();

      await controller.update(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Team not found' });
    });

    it('should return 500 when the use case throws', async () => {
      mockUpdateExecute.mockRejectedValue(new Error('Update error'));
      const req = { params: { id: '1' }, body: {} } as unknown as Request;
      const res = buildMockRes();

      await controller.update(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // ─── delete ───────────────────────────────────────────────────────────────
  describe('delete', () => {
    it('should return 200 when the team is deleted', async () => {
      mockDeleteExecute.mockResolvedValue(undefined);
      const req = { params: { id: '1' } } as unknown as Request;
      const res = buildMockRes();

      await controller.delete(req, res);

      expect(mockDeleteExecute).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 when the use case throws', async () => {
      mockDeleteExecute.mockRejectedValue(new Error('Delete error'));
      const req = { params: { id: '1' } } as unknown as Request;
      const res = buildMockRes();

      await controller.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
