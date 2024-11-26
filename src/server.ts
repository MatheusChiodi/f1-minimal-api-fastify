import fastify from 'fastify';
import cors from '@fastify/cors';

const teams = [
  {
    id: 1,
    name: 'Ferrari',
    base: 'Maranello',
  },
  {
    id: 2,
    name: 'Mercedes',
    base: 'Brackley',
  },
  {
    id: 3,
    name: 'Red Bull Racing',
    base: 'Milton Keynes',
  },
];

const drivers = [
  {
    id: 1,
    name: 'Max Verstappen',
    team: teams[2],
  },
  {
    id: 2,
    name: 'Lewis Hamilton',
    team: teams[1],
  },
  {
    id: 3,
    name: 'Charles Leclerc',
    team: teams[0],
  },
];

const server = fastify({ logger: true });
server.register(cors, {
  origin: '*',
  methods: ['GET'],
});

// Routes
server.get('/teams', async (request, reply) => {
  reply.type('application/json').code(200);
  return teams;
});

server.get('/drivers', async (request, reply) => {
  reply.type('application/json').code(200);
  return drivers;
});

interface DriveParams {
  id: string;
}

server.get<{ Params: DriveParams }>('/drivers/:id', async (request, reply) => {
  const id = parseInt(request.params.id);
  const driver = drivers.find((driver) => driver.id === id);
  if (!driver) {
    reply.status(404).send({ message: 'Driver not found' });
    return;
  } else {
    reply.type('application/json').code(200);
    return driver;
  }
});

// Start the server
server.listen({ port: 3333 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`Server running at ${address}`);
});
