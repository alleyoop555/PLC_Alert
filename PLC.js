module.exports = function (socketIP, socketPort, groups) {
    this.socketIP = socketIP; /* PLC IP */
    this.socketPort = socketPort; /* PLC port */
    this.groups = groups; /* Teams groups */

    /* PLC Connection and sending message to Teams groups */
    this.connect = function () {
        const net = require('net');
        const client = new net.Socket();

        /* initial variables */
        let preStr = '{}';
        let preFire = [];
        let preEq = '';
        let text, title = '';

        client.connect(this.socketPort, this.socketIP, function() {
            console.log(`PLC Connected (IP:${this.socketIP} Port:${this.socketPort})`);
        });

        client.on('data', function(data) {
            const str = data.toString('utf8');

            /* parse str if not equal to preStr */
            if (str!=preStr) {
                [Fire, Eq] = strParse(str);

                if (JSON.stringify(Fire)!=JSON.stringify(preFire)) {
                    if (Fire.length!=0) {
                        title = 'Fire Alert!!!';
                        text = `Fire area: ${Fire.join(' ')}`;
                    }
                    else {
                        title = `White Alert`;
                        text = `Fire alert all-clear`;
                    }
                    this.groups.forEach(group => group.sendMessage(text, title));
                    console.log(`Fire alert: ${Fire}`);
                }

                if (Eq!=preEq) {
                    if (Eq.length!=0) {
                        title = 'Earth Alert!!!';
                        text = `${Eq}`;
                    }
                    else {
                        title = `White Alert`;
                        text = `Earthquake alert all-clear`;
                    }
                    this.groups.forEach(group => group.sendMessage(text, title));
                    console.log(`Earthquake alert: ${Eq}`);
                }
               preStr = str; preFire = Fire; preEq = Eq;
            }

            else {
                console.log('No alert');
            }

        });

    }
};

function strParse(str) {
    const obj = JSON.parse(str.substring(0, str.length-1));
    const fire = obj.FIRE_RESULT;
    const eq = obj.EARTHQUAKE_RESULT;

    return [fire, eq]
}






