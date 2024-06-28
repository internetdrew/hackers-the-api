import request from 'supertest';
import app from '../../server';

const createTestOrganization = async ({
  authToken,
  name,
  description,
  imageUrl,
}: {
  authToken: string;
  name: string;
  description: string;
  imageUrl: string;
}) => {
  const orgRes = await request(app)
    .post('/admin/organizations')
    .auth(authToken, { type: 'bearer' })
    .send({
      name,
      description,
      imageUrl,
    });
  return orgRes;
};

export default createTestOrganization;
