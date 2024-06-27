import request from 'supertest';
import app from '../../server';

interface OrganizationCreationArgs {
  name: string;
  authToken: string;
  description: string;
  imageUrl: string;
}

const createTestOrganization = async (props: OrganizationCreationArgs) => {
  const { name, authToken, description, imageUrl } = props;
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
