import express from 'express';
import path from 'path';

import { errorWrap } from './middlewares/errorHandler';
import { getWellKnownDidConfiguration, pageTop } from './views';
import { getIssuer, getVerifiableCredential, getVerifiableCredentialStatus } from './views/issuer';
import {
  getLinkedDomain,
  getManageCredential,
  getManageIssuer,
  getManagePresentationDefinition,
  getManageVc,
  getManageVerifier,
  getResolveIssuer,
  getResolveVerifier,
  getSetting,
  postManageCredential,
  postManageIssuer,
  postManagePresentationDefinition,
  postManageVc,
  postManageVerifier,
  postSetting,
} from './views/manage';
import {
  getAuthorization,
  getOpenidConfigration,
  postAuthorization,
  postCredential,
  postToken,
} from './views/oidc';
import { getTools, postTools } from './views/tools';
import {
  getPresentationDefinition,
  getVerifier,
  getVpSiopRequest,
  postVpSiopResponse,
} from './views/verifier';

/**
 * 画面ルーティングの設定
 * @param app
 */
export const setViewRoutings = (app: express.Express) => {
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../ejs'));

  // リソース
  app.use(express.static(path.join(__dirname, '../public')));

  // ドキュメント
  app.use('/docs/', express.static(path.join(__dirname, '../../did-sdk/docs/api/')));

  // Top
  app.get('/', errorWrap(pageTop));

  app.get('/.well-known/did-configuration.json', errorWrap(getWellKnownDidConfiguration));

  // Issuer
  app.get('/issuer/', errorWrap(getIssuer));
  app.get('/issuer/credential/:credential_id/vc/', errorWrap(getVerifiableCredential));

  // VC
  app.get('/vcstatus/:vc_id/', errorWrap(getVerifiableCredentialStatus));

  // Verifier
  app.get('/verifier/', errorWrap(getVerifier));
  app.get('/verifier/presentation/:presentation_id/vp/', errorWrap(getPresentationDefinition));

  // VP
  app
    .route('/vp/:vp_id/present/')
    .get(errorWrap(getVpSiopRequest))
    .post(errorWrap(postVpSiopResponse));

  // OIDC
  app.get('/issuer/:issuer_id/.well-known/openid-configuration/', errorWrap(getOpenidConfigration));
  app
    .route('/issuer/:issuer_id/authorization/')
    .get(errorWrap(getAuthorization))
    .post(errorWrap(postAuthorization));
  app.post('/issuer/:issuer_id/token/', errorWrap(postToken));
  app.post('/issuer/:issuer_id/credential/', errorWrap(postCredential));

  // Tools
  app.route('/tools').get(errorWrap(getTools)).post(errorWrap(postTools));

  // 管理画面
  app.route('/manage/issuer/').get(errorWrap(getManageIssuer)).post(errorWrap(postManageIssuer));
  app.get('/manage/resolve_issuer/:issuer_id/', errorWrap(getResolveIssuer));
  app
    .route('/manage/issuer/:issuer_id/credential/')
    .get(errorWrap(getManageCredential))
    .post(errorWrap(postManageCredential));
  app
    .route('/manage/credential/:credential_id/vc/')
    .get(errorWrap(getManageVc))
    .post(errorWrap(postManageVc));
  app
    .route('/manage/verifier/')
    .get(errorWrap(getManageVerifier))
    .post(errorWrap(postManageVerifier));
  app.get('/manage/resolve_verifier/:verifier_id/', errorWrap(getResolveVerifier));
  app
    .route('/manage/verifier/:verifier_id/presentation/')
    .get(errorWrap(getManagePresentationDefinition))
    .post(errorWrap(postManagePresentationDefinition));
  app.get('/manage/linked_domain/:type/:id/', errorWrap(getLinkedDomain));

  app.route('/manage/setting/').get(errorWrap(getSetting)).post(errorWrap(postSetting));
};

export default setViewRoutings;
