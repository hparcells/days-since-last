import axios from 'axios';

export async function fetchDsl(dslId: string): Promise<any> {
  return await axios.get(`/api/dsl/${dslId}`);
}
export async function submitDsl(name: string, token: string) {
  return await axios.post('/api/dsl/create', {
    name,
    token
  });
}
