import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { validateBodyTeam } from '../../../../src/infrastructure/http/middlewares/validateBodyTeam';
import { teamSchema } from '../../../../src/infrastructure/http/middlewares/schema';

function buildMockRes() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  } as unknown as Response;
  (res.status as ReturnType<typeof vi.fn>).mockReturnValue(res);
  return res;
}

describe('validateBodyTeam middleware', () => {
  const middleware = validateBodyTeam(teamSchema);

  it('should call next() when the body is valid', () => {
    const req = {
      body: { name: 'Real Madrid', country: 'Spain', city: 'Madrid', stadium: 'Santiago Bernabéu' },
    } as unknown as Request;
    const res = buildMockRes();
    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should set req.body to the parsed/validated data on success', () => {
    const body = { name: 'FC Barcelona', country: 'Spain', city: 'Barcelona', stadium: 'Camp Nou' };
    const req = { body } as unknown as Request;
    const res = buildMockRes();
    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(req.body).toEqual(body);
  });

  it('should return 400 when a required field is missing', () => {
    const req = {
      body: { name: 'Incomplete Team', country: 'Spain' }, // missing city and stadium
    } as unknown as Request;
    const res = buildMockRes();
    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.anything() }));
  });

  it('should return 400 when all fields are missing', () => {
    const req = { body: {} } as unknown as Request;
    const res = buildMockRes();
    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when a field is an empty string', () => {
    const req = {
      body: { name: '', country: 'Spain', city: 'Madrid', stadium: 'Bernabéu' },
    } as unknown as Request;
    const res = buildMockRes();
    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 400 when a field is not a string', () => {
    const req = {
      body: { name: 123, country: 'Spain', city: 'Madrid', stadium: 'Bernabéu' },
    } as unknown as Request;
    const res = buildMockRes();
    const next = vi.fn() as unknown as NextFunction;

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
