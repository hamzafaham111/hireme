import test from 'node:test'
import assert from 'node:assert/strict'
import type { Worker as PrismaWorker } from '@prisma/client'
import { workerToApi } from './domain'

function makeWorkerRow(overrides: Partial<PrismaWorker>): PrismaWorker {
  return {
    id: 'w-1',
    workerId: 'HM-W-0001',
    name: 'Worker One',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    phone: '123',
    location: 'Riyadh',
    service: 'Legacy label',
    siteServiceIds: [],
    siteServiceId: null,
    status: 'active',
    internalRating: 4,
    customerRating: 4,
    ...overrides,
  } satisfies PrismaWorker
}

test('workerToApi resolves service from selected siteServiceIds', () => {
  const result = workerToApi(
    makeWorkerRow({
      service: 'Old title',
      siteServiceIds: ['svc-1', 'svc-2'],
      siteServiceId: 'svc-1',
    }),
    new Map([
      ['svc-1', 'Cleaning'],
      ['svc-2', 'Plumbing'],
    ]),
  )
  assert.equal(result.service, 'Cleaning, Plumbing')
  assert.equal(result.siteServiceId, 'svc-1')
  assert.deepEqual(result.siteServiceIds, ['svc-1', 'svc-2'])
})

test('workerToApi falls back to stored service when no ids resolve', () => {
  const result = workerToApi(
    makeWorkerRow({
      service: 'Window Cleaning',
      siteServiceIds: [],
      siteServiceId: null,
    }),
  )
  assert.equal(result.service, 'Window Cleaning')
  assert.equal(result.siteServiceId, null)
})
