'use strict';
import * as liveServer from 'live-server';
import * as httpShutdown from 'http-shutdown';
import * as EventEmitter from 'events';

export class LiveServerHelper extends EventEmitter {

    static StartServer(params, callback) {
        setTimeout(() => {
            try {
                let ServerInstance = liveServer.start(params);
                setTimeout(() => {

                    if (!ServerInstance._connectionKey) {
                        return callback({});
                    }

                    httpShutdown(ServerInstance);
                    return callback(ServerInstance);

                }, 1000);
            } catch (err) {
                console.error(err);
                callback({
                    errorMsg: err
                });
            }

        }, 0);

    }

    static StopServer(LiveServerInstance, callback) {
        LiveServerInstance.shutdown(() => {
            // callback(); /*only Working first time, Unknown Bug*/
        });
        LiveServerInstance.close();
        liveServer.shutdown();
        setTimeout(() => { callback(); }, 1000);
    }

    constructor() {
        super();
        this.on('liveEditing', (file, content) => {
            liveServer.liveEditing(file, content);
        });
    }
}