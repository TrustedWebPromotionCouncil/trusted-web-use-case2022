import { atom } from 'recoil';
import { CORVP } from '@/lib/types';
import persistAtom from './persistAtom';

const certificateOfResidenceVPState = atom<CORVP | undefined>({
  key: 'CertificateOfResidenceVPState',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});

export default certificateOfResidenceVPState;
