import { atom } from 'recoil';
import { CORVCRequest } from '@/lib/types';
import persistAtom from './persistAtom';

const certificateOfResidenceVCRequestState = atom<CORVCRequest | undefined>({
  key: 'CertificateOfResidenceVCRequestState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default certificateOfResidenceVCRequestState;
