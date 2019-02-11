import google from 'googleapis';
import loglevel from 'loglevel';

import { OAUTH } from './../constants';

export default class GoogleOAuth {

  constructor () {
    this.oauthClient = new google.auth.OAuth2(
      OAUTH.CLIENT_ID,
      process.env.GOOGLE_OAUTH_SECRET,
      '0.0.0.0:3030/siteSelect'
    );
  }

  login () {
    const scopes = ['openid'];
    const url = this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    })
    loglevel.info("authUrl: " + url);
  }

}
