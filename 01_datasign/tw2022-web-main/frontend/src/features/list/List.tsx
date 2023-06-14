import React, { FunctionComponent, useEffect } from 'react';
import apiClient from '../../shered/apiClient';

export interface HolderProfile {
  rowid: string;
  name: string;
  url: string;
  issuedAt: string;
  expire: string;
}

export const List: FunctionComponent = () => {
  const [holderProfiles, setHolderProfiles] = React.useState<HolderProfile[]>([]);
  useEffect(() => {
    const getHolderProfileList = async (): Promise<void> => {
      const response = await apiClient.get<HolderProfile[]>('/api/3rd-party/op-list');
      setHolderProfiles(response);
    };
    void getHolderProfileList();
  }, []);

  return (
    <div>
      登録済みOriginator Profile一覧
      <table>
        <thead>
          <tr>
            <th>
              <label>#</label>
            </th>
            <th>
              <label>name</label>
            </th>
            <th>
              <label>url</label>
            </th>
            <th>
              <label>date of issue</label>
            </th>
            <th>
              <label>date of expire</label>
            </th>
            <th></th>
          </tr>
        </thead>
        {holderProfiles.map((profile) => {
          return (
            <tbody key={profile.name}>
              <tr>
                <td>
                  <label>{profile.rowid}</label>
                </td>
                <td>
                  <label>{profile.name}</label>
                </td>
                <td>
                  <label>{profile.url}</label>
                </td>
                <td>
                  <label>{profile.issuedAt}</label>
                </td>
                <td>
                  <label>{profile.expire}</label>
                </td>
                <td>
                  <a
                    href={`http://localhost:3002/api/3rd-party/op/${profile.rowid}`}
                    target={'_blank'}
                    rel={'noreferrer'}
                  >
                    op(JWT)を確認する
                  </a>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};

export default List;
