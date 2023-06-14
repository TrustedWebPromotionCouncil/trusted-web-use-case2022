/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import List from './List';

const responseBody = [
  {
    rowid: 1,
    id: 'did:ion:aaaaaaaaa',
    name: 'bbbbbbb Inc.',
    url: 'https://cccccccccc.com',
    issuedAt: '2023-01-10 08:53:52',
  },
];
describe('test List Originator Profiles', () => {
  it('get none', async () => {
    fetchMock.get('/api/3rd-party/op-list', {
      status: 200,
      body: {},
    });
    render(<List />);
    await waitFor(() => {
      const table = screen.getAllByRole('table');
      expect(table).toHaveLength(1);
      const tbody = table[0].getElementsByTagName('tbody');
      expect(tbody).toHaveLength(0);
    });
    fetchMock.restore();
  });
  it('get list', async () => {
    fetchMock.get('/api/3rd-party/op-list', {
      status: 200,
      body: responseBody,
    });
    render(<List />);
    await waitFor(() => {
      screen.debug();
      const table = screen.getAllByRole('table', {});
      expect(table).toHaveLength(1);
      const tbody = table[0].getElementsByTagName('tbody');
      expect(tbody).toHaveLength(responseBody.length);
      const tr = tbody[0].getElementsByTagName('tr');
      expect(tr).toHaveLength(1);
      const td = tr[0].getElementsByTagName('td');
      expect(td).toHaveLength(6);
      expect(td[0]).toHaveTextContent(responseBody[0].rowid.toString());
      expect(td[1]).toHaveTextContent(responseBody[0].id);
      expect(td[2]).toHaveTextContent(responseBody[0].name);
      expect(td[3]).toHaveTextContent(responseBody[0].url);
      expect(td[4]).toHaveTextContent(responseBody[0].issuedAt);
      expect(td[5]).toHaveTextContent('op(JWT)を確認する');
      const aTag = td[5].getElementsByTagName('a');
      expect(aTag).toHaveLength(1);
      const href = aTag[0].getAttribute('href');
      expect(href).toBe('http://localhost:3002/api/3rd-party/op/1');
    });
    fetchMock.restore();
  });
});
