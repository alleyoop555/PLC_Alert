module.exports = function (socketIP, socketPort, groups) {
    this.socketIP = socketIP; /* PLC IP */
    this.socketPort = socketPort; /* PLC port */
    this.fireState = new Set([]); /* PLC fire state */
    this.eqState = new Set([]); /* PLC earthquake state */
    this.groups = groups; /* Teams groups */

    /* PLC Connection and sending message to Teams groups */
    this.connect = function () {
        const net = require('net');
        const client = new net.Socket();

        client.connect(this.socketPort, this.socketIP, function() {
            console.log(`PLC Connected (IP:${this.socketIP} Port:${this.socketPort})`);
        });

        client.on('data', function(data) {
            console.log(`PLC Received (IP:${this.socketIP} Port:${this.socketPort})`);

            /* parse buffer message */
            const str = data.toString('utf8');
            const obj = JSON.parse(str.substring(0, str.length-1));
            const fireResult = new Set(obj.FIRE_RESULT);
            const eqResult = new Set(obj.EARTHQUAKE_RESULT);
            console.log(`Fire result: ${fireResult}`);
            console.log(`Earthquake result: ${eqResult}`);

            /* determine whether send message or not */
            let text, title; /* message to Teams groups */
            if (!eqSet(fireResult, this.fireState)) {
                if (!(fireResult.size==0)) {
                    title = 'Fire Alert!!!';
                    text = `Fire area: ${Array.from(fireResult).join(' ')}`;
                    this.groups.forEach(group => group.sendMessage(text, title));
                }
                else {
                    title = `White Alert`;
                    text = `Fire alert all-clear`;
                    this.groups.forEach(group => group.sendMessage(text, title));
                }
            }
            if (!eqSet(eqResult, this.eqState)) {
                if (!(eqResult.size==0)) {
                    title = 'Earthquake Alert!!!';
                    text = `${Array.from(eqResult).join(' ')}`;
                    this.groups.forEach(group => group.sendMessage(text, title));
                }
                else {
                    title = `White Alert`;
                    text = `Earthquake alert all-clear`;
                    this.groups.forEach(group => group.sendMessage(text, title));
                }
            }

        });

    }
};

function eqSet(as, bs) {
    if (as.size !== bs.size) return false;
    for (let a of as) if (!bs.has(a)) return false;
    return true;
}




