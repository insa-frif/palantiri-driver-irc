import * as Promise from "bluebird";
import {Proxy, Discussion, Contact, Message} from "palantiri-interfaces";
import {DiscussionIRC} from "./discussion";
import {Client} from "./client/client";

// TODO: sort this out...
interface IAccount {}

export interface AccountIRCData{
  server: string,
  username: string,
  nick?: string,
  password?: string
}

export class Account implements IAccount{
  static isCompatibleWith(protocolName: string) {
    return protocolName === "irc";
  }

  protocols: string;
  data: any;

  private _client: Client = null;

  constructor(data: AccountIRCData){
    this.data = data;
  }

  getClient(): Client {
    if (this._client === null) {
      this._client = new Client({server: this.data.server, nick: this.data.nick || this.data.username});
    }
    return this._client;
  }

  createDiscussion(name:string): Promise<Discussion> {
    let client = this.getClient();

    return client
      .connect()
      .then(() => {
        console.log('connected');
        let discussion = new DiscussionIRC(this.data.server, name);
        return client.join(name)
          .thenReturn(discussion);
        // return discussion;
      });
  }
}
