
import { TableGeneric } from '@/components/tables'
import { Woollet } from '@/data/woollet'
import { Did } from '@/data/did'

export default function Page({ data }) {

  return (
      <TableGeneric name={data.title} cols={data.cols} items={data.items} time={data.time} title={data.title} />
  )
}

Page.getInitialProps = async (x) => {
  const w = new Woollet('Verify a specific member')
  w.data = await Did.User.list();
  w.cols = [
    {key: 'key', label: 'DID'},
    {key: 'name', label: 'Name'},
    {key: 'role_points', label: 'Role / Points'},
    {key: 'created_updated', label: 'Created / Updated'},
    {key: 'connection', label: 'Connection'},
  ];
  w.path = w.data
  w.extract_array((i)=>{
      return ([
          i.did,
          i.name,
          i.role + '<br>' + i.points,
          i.created_at + '<br>' + i.updated_at,
          i.con_id,
      ]);
  })
  return { data: w.output() }
}