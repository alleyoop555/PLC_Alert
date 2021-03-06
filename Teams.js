module.exports = function (WebHook_url, proxy) {
    this.url = WebHook_url;
    this.proxy = proxy;

    this.sendMessage = function (text, title) {
        const request = require('request');
        const message = {
            "text": text,
            "title": title
        };
        this.url.forEach((url, index) => {
            request.post({
                url: url,
                body: message,
                proxy: this.proxy[index],
                json: true,
            }, function Callback(err, httpResponse, body) {
                if (err) {
                    return console.error('upload failed:', err);
                }
                console.log(`Http code: ${httpResponse.statusCode}`);
                console.log(`Upload successful! Server responded with ${body}`);
            });
        })

    }
};



