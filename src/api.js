import rest from 'rest';
import mime from 'rest/interceptor/mime';

let client = rest.wrap(mime);

class Api {
  constructor(uri, key){
    this.uri = uri;
    this.key = key;
    return this;
  }

  call(method, params){
    params = params || {};
    params.format = 'json';
    params.api_key = this.key;
    params.method = method;

    return client({
      path: this.uri,
      params: params
    }).then(function(response) {
      if (response.entity.error) {
        throw new Error(response.entity.message);
      }
      return response.entity;
    });
  }

  getUserInfos(username){
    return this.call('user.getinfo', {
      user: username
    }).then((result) => result.user);
  }

  getCurrentTrack(username){
    return this.call('user.getrecenttracks', {
      user: username,
      limit: 1,
    }).then((result) => result.recenttracks.track);
  }
}

export default Api;
