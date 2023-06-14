import { atom } from 'recoil';
import { CORVC } from '@/lib/types';
import persistAtom from './persistAtom';

const certificateOfResidenceVCState = atom<CORVC | undefined>({
  key: 'CertificateOfResidenceVCState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default certificateOfResidenceVCState;
