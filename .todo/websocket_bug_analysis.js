
// sometimes connection is dropped while executing some cell
// after losing the connecition with the websocket the following is called:

// in kernel.js 136
Kernel.prototype._websocket_closed = function(ws_url, early) {
    this.stop_channels();
    $([IPython.events]).trigger('websocket_closed.Kernel',
        {ws_url: ws_url, kernel: this, early: early}
    );
};

// which triggers  notificationarea.js 142 which reestablishes the connection
$([IPython.events]).on('websocket_closed.Kernel', function (event, data) {
    var kernel = data.kernel;
    var ws_url = data.ws_url;
    var early = data.early;
    var msg;
    if (!early) {
            knw.set_message('Reconnecting WebSockets', 1000);
            setTimeout(function () {
                kernel.start_channels();
            }, 5000);
        return;
    }

    // ...

    });
// but the cell is never executed again! Failed executions should be queued
// and reexecuted after reestablishing the connection!

// the error is returned from kernel.js 239:
Kernel.prototype.send_shell_message = function (msg_type, content, callbacks, metadata) {
    var msg = this._get_msg(msg_type, content, metadata);

    // below we send directly to websocket but since it's already
    // none because it was disabled by connection closed in kernel.js 225
    // (stop_channels) which was triggered on websocket close event - see below
    this.shell_channel.send(JSON.stringify(msg));
    this.set_callbacks_for_msg(msg.header.msg_id, callbacks);
    return msg.header.msg_id;
};

// called on websocket close -> kernel.js 136
Kernel.prototype._websocket_closed = function(ws_url, early) {
    this.stop_channels();
    $([IPython.events]).trigger('websocket_closed.Kernel',
        {ws_url: ws_url, kernel: this, early: early}
    );
};

// so if this.shell_channel is null one can queue remainging tasks (
//    look for repetitions) and then on start_channels (kernel.js line 149) one
// can purge the queue by calling each task!

// the remaining question is why the connection is dropped?
